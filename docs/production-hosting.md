# Production hosting

Production is https://mosaicosmc.com/ on the client's Ferozo hosting. GitHub Pages remains a preview. WordPress is not required by the new static website.

The contact form is the single server-side exception: `/api/contact.php` sends email using the hosting's PHP `mail()` transport to the fixed recipient `info@mosaicosmc.com`. No external form or email delivery service is used. The cart remains a WhatsApp inquiry. PHP 8.5 and session support were checked on the client hosting before deployment. Only this PHP endpoint is granted public access; legacy WordPress PHP remains blocked.

Contact submissions require a valid email, same-origin session token, minimum completion time, an empty honeypot and bounded text fields. Headers and recipient cannot be supplied by the visitor. Per-address and global rate limits are stored outside `public_html` in `/_mc_contact_state`; no message body is stored there. That private directory must survive deployments. A successful mail response means the hosting accepted the email for delivery; inbox reception and spam placement must be checked in the recipient mailbox. GitHub Pages links to the production form because Pages does not execute PHP.

The Website workflow validates the source, builds the public allowlist, then generates a separate `_production` artifact. It rewrites canonical URLs, sitemap and LLM discovery files for the definitive domain. It includes Apache redirects for the five old product-line URLs, cache/compression settings and response security headers.

## Existing tracking preserved

Public source and browser requests inspected on 2026-11-11:

- Google Tag Manager: `GTM-NKPK2WMQ` (container version 5).
- Google Analytics 4 via that container: `G-ZX9S3561M4`.
- Meta Pixel via that container: `1046792330735176`.
- No separate Google Ads tag was identified in the published container or observed requests.

Only the original GTM container is installed, on the production artifact's 32 content pages. Analytics and Meta are not installed a second time. Preview pages do not load client tracking. The existing container includes WhatsApp click and legacy JoinChat/form event triggers. Future changes to those triggers belong in GTM; a legacy plugin-specific event is not proof that a WhatsApp message was sent.

CSP permits the observed analytics origins and the exact SHA-256 of the existing Meta Custom HTML script, without enabling arbitrary inline JavaScript or eval. If that Custom HTML tag changes in GTM, its CSP hash must be reviewed and updated.

## Automatic publishing

Only changes merged into protected `main` are published. Required PR checks remain in place. `PRODUCTION_DEPLOY_ENABLED=true` enables the production job after the first supervised migration. Credentials are stored in GitHub Secrets: `FTP_HOST`, `FTP_PORT`, `FTP_USERNAME`, `FTP_PASSWORD`. Do not add them to files or configure a second Ferozo Git webhook to deploy this source repository.

The publisher requires a managed release marker and the exact `/public_html` directory. It uploads to a private staging directory, checks every file's SHA-256 by downloading it over FTPS, and only then swaps top-level entries. ACME `.well-known` stays in place. The hosting-owned web root itself is preserved. HTTPS certificate validation is required. A failed live release check restores the previous files. Only one production deployment runs at a time.

The first `--legacy` migration additionally verifies that the current root contains the inspected WordPress files. Legacy files are moved to a private `/_mc_legacy_*` directory outside the web root. No database, mail or DNS settings are modified. This is a filesystem rollback copy, not a database export. The old database remains in the hosting account.

Later releases retain their predecessor in `/_mc_backup_*`. Monitor disk usage and remove obsolete deployment backups only after verifying the desired retention; the initial legacy backup must be kept until migration acceptance. Backups are not publicly downloadable.

## Rollback

Disable `PRODUCTION_DEPLOY_ENABLED` first. Using FTPS, move the current web-root entries except `.well-known` to a new private directory, then move the selected backup's entries back into `/public_html`. Verify the website. For the legacy WordPress version, its unchanged database must still exist. Never merge old WordPress PHP files into a new static release.

The publisher's `--legacy` option is intentionally absent from GitHub Actions. A production failure must not bypass that guard or overwrite an unrelated installation.
