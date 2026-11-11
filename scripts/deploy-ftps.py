"""Publish only a verified static artifact, with a recoverable directory swap.

Credentials come from GitHub Secrets via environment. The original WordPress
database is never accessed or modified. Legacy files remain outside the web root.
"""
import argparse
import ftplib
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import ssl
import time
import urllib.request
import uuid

parser = argparse.ArgumentParser()
parser.add_argument('--source', default='_production')
parser.add_argument('--legacy', action='store_true', help='First migration only: allow replacing a WordPress root')
args = parser.parse_args()
root = '/public_html'
source = Path(args.source).resolve()
manifest = json.loads((source / '.mc-release.json').read_text())
release = manifest['release']
if not re.fullmatch('[a-f0-9]{40}', release):
    raise SystemExit('Invalid release ID')
files = manifest['files']
required = {'index.html', '.htaccess', 'sitemap.xml', 'robots.txt', 'assets/js/production-tracking.js'}
if not required.issubset(files) or not 200 < len(files) < 1000:
    raise SystemExit('Incomplete public artifact')
for name, digest in files.items():
    parts = PurePosixPath(name).parts
    if name.startswith('/') or '..' in parts or '\\' in name or any(c in name for c in '\r\n'):
        raise SystemExit('Unsafe artifact path')
    p = source / name
    if p.is_symlink() or not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != digest:
        raise SystemExit('Artifact checksum mismatch: ' + name)
actual = {p.relative_to(source).as_posix() for p in source.rglob('*') if p.is_file()}
if actual != set(files) | {'.mc-release.json'}:
    raise SystemExit('Unexpected files in public artifact')

suffix = time.strftime('%Y%m%d-%H%M%S', time.gmtime()) + '-' + uuid.uuid4().hex[:8]
stage = '/_mc_stage_' + suffix
backup = ('/_mc_legacy_' if args.legacy else '/_mc_backup_') + suffix

def entries(ftp, directory):
    result = []
    for name, facts in ftp.mlsd(directory):
        if name in ('.', '..') or facts.get('type') in ('cdir', 'pdir'):
            continue
        if '/' in name or '\\' in name or any(c in name for c in '\r\n'):
            raise RuntimeError('Unsafe remote entry')
        if facts.get('type') not in ('file', 'dir'):
            raise RuntimeError('Unsupported remote entry type')
        result.append(name)
    return result

with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=90) as ftp:
    ftp.connect(os.environ['FTP_HOST'], int(os.environ.get('FTP_PORT', '21')))
    ftp.login(os.environ['FTP_USERNAME'], os.environ['FTP_PASSWORD'])
    ftp.prot_p()
    def transfer(operation):
        # Shared hosting can close an otherwise valid FTP control connection.
        # Retry only isolated staging transfers; never replay a live rename.
        for attempt in range(3):
            try:
                return operation()
            except (EOFError, OSError, ftplib.error_temp):
                if attempt == 2:
                    raise
                ftp.close()
                time.sleep(2 ** attempt)
                ftp.connect(os.environ['FTP_HOST'], int(os.environ.get('FTP_PORT', '21')))
                ftp.login(os.environ['FTP_USERNAME'], os.environ['FTP_PASSWORD'])
                ftp.prot_p()
                print('Reconnected securely; retrying staging transfer.', flush=True)
    ftp.cwd(root)
    if ftp.pwd().rstrip('/') != root:
        raise RuntimeError('Unexpected web root; refusing deployment')
    current = entries(ftp, root)
    if args.legacy:
        if not {'wp-config.php', 'index.php', 'wp-content'}.issubset(current):
            raise RuntimeError('Legacy root does not match the inspected WordPress site')
    elif '.mc-release.json' not in current or 'wp-config.php' in current:
        raise RuntimeError('Initial migration must be supervised; no managed release found')
    ftp.mkd(stage)
    print('Uploading verified release ' + release[:12], flush=True)
    directories = sorted({str(p) for name in files for p in PurePosixPath(name).parents if str(p) != '.'}, key=lambda p: (p.count('/'), p))
    for directory in directories:
        ftp.mkd(stage + '/' + directory)
    for i, name in enumerate(sorted(actual), 1):
        def upload():
            with (source / name).open('rb') as stream:
                ftp.storbinary('STOR ' + stage + '/' + name, stream, blocksize=131072)
        transfer(upload)
        if i % 40 == 0:
            print('Uploaded ' + str(i) + '/' + str(len(actual)), flush=True)
    # Read every uploaded byte over protected FTPS before changing the live site.
    for i, (name, digest) in enumerate(files.items(), 1):
        def verify():
            checksum = hashlib.sha256()
            ftp.retrbinary('RETR ' + stage + '/' + name, checksum.update, blocksize=131072)
            return checksum.hexdigest()
        if transfer(verify) != digest:
            raise RuntimeError('Remote checksum mismatch: ' + name)
        if i % 60 == 0:
            print('Verified ' + str(i) + '/' + str(len(files)), flush=True)
    ftp.mkd(backup)
    ftp.sendcmd('SITE CHMOD 700 ' + backup)
    moved_old, moved_new = [], []
    print('Staged files verified. Backup outside public_html: ' + backup, flush=True)
    try:
        # Keep ACME validation in place. Preserve the hosting-owned public_html directory.
        for name in current:
            if name == '.well-known':
                continue
            ftp.rename(root + '/' + name, backup + '/' + name)
            moved_old.append(name)
        for name in entries(ftp, stage):
            ftp.rename(stage + '/' + name, root + '/' + name)
            moved_new.append(name)
        expected = 'name="mc-release" content="' + release + '"'
        for attempt in range(5):
            try:
                req = urllib.request.Request('https://mosaicosmc.com/?release=' + release, headers={'Cache-Control': 'no-cache'})
                with urllib.request.urlopen(req, timeout=30) as response:
                    if response.status != 200 or expected not in response.read().decode('utf-8'):
                        raise RuntimeError('Live release verification failed')
                break
            except Exception:
                if attempt == 4:
                    raise
                time.sleep(3)
    except Exception:
        for name in reversed(moved_new):
            ftp.rename(root + '/' + name, stage + '/' + name)
        for name in reversed(moved_old):
            ftp.rename(backup + '/' + name, root + '/' + name)
        print('Publication failed; previous website restored.', flush=True)
        raise
    ftp.rmd(stage)
    print('Published and verified: https://mosaicosmc.com/', flush=True)
    print('Rollback files retained outside web root at ' + backup, flush=True)
