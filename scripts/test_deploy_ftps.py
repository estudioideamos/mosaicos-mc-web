"""Exercise staging and rollback without a network connection or credentials."""
import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch

RELEASE = 'a' * 40

class FakeFTP:
    def __init__(self, corrupt=False):
        self.files = {'/public_html/index.php': b'old entry', '/public_html/wp-config.php': b'old config', '/public_html/wp-content/site.txt': b'old content', '/public_html/.well-known/acme-challenge/token': b'acme', '/mail/untouched': b'mail'}
        self.dirs = {'/public_html', '/public_html/wp-content', '/public_html/.well-known', '/public_html/.well-known/acme-challenge', '/mail'}
        self.corrupt = corrupt
    def __enter__(self): return self
    def __exit__(self, *args): pass
    def connect(self, *args): pass
    def login(self, *args): pass
    def prot_p(self): pass
    def cwd(self, value): self.current = value
    def pwd(self): return self.current
    def mkd(self, value): self.dirs.add(value)
    def rmd(self, value): self.dirs.remove(value)
    def sendcmd(self, value): return '200 OK'
    def mlsd(self, directory):
        for p in sorted(self.dirs | set(self.files)):
            if p.startswith(directory + '/') and '/' not in p[len(directory)+1:]:
                yield p[len(directory)+1:], {'type': 'dir' if p in self.dirs else 'file'}
    def storbinary(self, command, stream, **kwargs): self.files[command[5:]] = stream.read()
    def retrbinary(self, command, callback, **kwargs): callback(b'corrupt' if self.corrupt else self.files[command[5:]])
    def rename(self, old, new):
        if old in self.files:
            self.files[new] = self.files.pop(old)
        elif old in self.dirs:
            for p in list(self.files):
                if p.startswith(old + '/'): self.files[new + p[len(old):]] = self.files.pop(p)
            for p in list(self.dirs):
                if p == old or p.startswith(old + '/'):
                    self.dirs.remove(p); self.dirs.add(new + p[len(old):])
        else: raise RuntimeError('Missing rename source')

class DeploymentTests(unittest.TestCase):
    def run_deploy(self, ftp, live_ok=True, legacy=True):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            names = ['index.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'assets/js/production-tracking.js'] + ['assets/test' + str(i) + '.txt' for i in range(200)]
            for name in names:
                p = root / name; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(b'new site')
            (root / '.mc-release.json').write_text(json.dumps({'release': RELEASE, 'files': {name: hashlib.sha256(b'new site').hexdigest() for name in names}}))
            response = io.BytesIO(('name="mc-release" content="' + (RELEASE if live_ok else 'wrong') + '"').encode())
            response.status = 200
            def get_response(*args, **kwargs):
                data = io.BytesIO(response.getvalue()); data.status = 200; return data
            argv = ['deploy-ftps.py', '--source', temp] + (['--legacy'] if legacy else [])
            with patch('sys.argv', argv), patch.dict(os.environ, {'FTP_HOST':'example.test','FTP_USERNAME':'test','FTP_PASSWORD':'test','FTP_PORT':'21'}), patch('ftplib.FTP_TLS', return_value=ftp), patch('urllib.request.urlopen', side_effect=get_response), patch('time.sleep'), contextlib.redirect_stdout(io.StringIO()):
                runpy.run_path(str(Path(__file__).with_name('deploy-ftps.py')), run_name='__main__')
    def test_success_preserves_legacy_and_unrelated_files(self):
        ftp = FakeFTP(); self.run_deploy(ftp)
        self.assertEqual(ftp.files['/public_html/index.html'], b'new site')
        self.assertNotIn('/public_html/wp-config.php', ftp.files)
        self.assertTrue(any(p.startswith('/_mc_legacy_') and p.endswith('/wp-config.php') for p in ftp.files))
        self.assertEqual(ftp.files['/public_html/.well-known/acme-challenge/token'], b'acme')
        self.assertEqual(ftp.files['/mail/untouched'], b'mail')
    def test_corrupt_upload_never_changes_live_root(self):
        ftp = FakeFTP(corrupt=True); before = dict(ftp.files)
        with self.assertRaisesRegex(RuntimeError, 'checksum'): self.run_deploy(ftp)
        self.assertTrue(all(ftp.files[p] == value for p, value in before.items()))
        self.assertNotIn('/public_html/index.html', ftp.files)
    def test_failed_live_check_restores_wordpress(self):
        ftp = FakeFTP(); before = dict(ftp.files)
        with self.assertRaisesRegex(RuntimeError, 'verification'): self.run_deploy(ftp, live_ok=False)
        self.assertTrue(all(ftp.files[p] == value for p, value in before.items()))
        self.assertNotIn('/public_html/index.html', ftp.files)
    def test_automation_cannot_replace_unmanaged_site(self):
        ftp = FakeFTP(); before = dict(ftp.files)
        with self.assertRaisesRegex(RuntimeError, 'supervised'): self.run_deploy(ftp, legacy=False)
        self.assertEqual(ftp.files, before)

if __name__ == '__main__': unittest.main()
