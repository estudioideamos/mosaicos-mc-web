import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

// Pages remains a preview. Only this validated artifact is sent to the client host.
const source='_site', output='_production';
const origin='https://mosaicosmc.com/';
const release=process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!fs.existsSync(source)||fs.existsSync(output))throw Error('Build _site first; _production must not exist.');
fs.cpSync(source,output,{recursive:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const file of walk(output).filter(f=>/\.(html|xml|txt|css|js)$/.test(f))){
  const s=fs.readFileSync(file,'utf8').replaceAll('https://estudioideamos.github.io/mosaicos-mc-web/',origin).replaceAll('/mosaicos-mc-web/','/');
  fs.writeFileSync(file,s);
}
// Existing client container: GA4 G-ZX9S3561M4 and Meta 1046792330735176.
// The hash authorizes only the existing Meta Custom HTML script, not arbitrary inline JS.
const csp="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://connect.facebook.net 'sha256-vrwA5kdFP2Cl0aFF9yopFp+fSauROffhqjnqBmOWnlM='; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://www.facebook.com https://www.google.com https://www.google.com.ar; media-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://www.google.com https://www.google.com.ar https://*.googletagmanager.com https://*.doubleclick.net https://www.facebook.com; frame-src https://www.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests";
const loader=`(() => {\n  if (window.__mcGtmLoaded) return;\n  window.__mcGtmLoaded = true;\n  window.dataLayer = window.dataLayer || [];\n  window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});\n  const script = document.createElement('script');\n  script.async = true;\n  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-NKPK2WMQ';\n  document.head.appendChild(script);\n})();\n`;
fs.writeFileSync(path.join(output,'assets/js/production-tracking.js'),loader);
let pages=0;
for(const file of walk(output).filter(f=>f.endsWith('.html'))){
  let html=fs.readFileSync(file,'utf8');
  if(!/http-equiv=["']refresh/i.test(html)){
    html=html.replace(/<meta http-equiv="Content-Security-Policy" content="[^"]*"\s*\/>/,`<meta http-equiv="Content-Security-Policy" content="${csp}" />`);
    html=html.replace('</head>',`<meta name="mc-release" content="${release}" />\n<script defer src="/assets/js/production-tracking.js"></script>\n</head>`);
    html=html.replace(/(<body\b[^>]*>)/,'$1\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NKPK2WMQ" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>');
    pages++;
  }
  html=html.replace(/((?:src|href)=")([^"?]+\.(?:css|js))(?:\?[^" ]*)?"/g,(m,a,ref)=>{
    if(/^(https?:|\/\/)/.test(ref))return m;
    const asset=ref.startsWith('/')?path.join(output,ref):path.resolve(path.dirname(file),ref);
    if(!fs.existsSync(asset))throw Error('Missing production asset '+ref);
    const hash=createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0,12);
    return `${a}${ref}?v=${hash}"`;
  });
  fs.writeFileSync(file,html);
}
const redirects=['exterior-pulida','mosaicos','atermicos','rusticos','bloques-de-hormigon'].map(s=>`RewriteRule ^${s}/?$ /productos/${s}/ [R=301,L]`).join('\n');
fs.writeFileSync(path.join(output,'.htaccess'),`Options -Indexes\nDirectoryIndex index.html\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{REQUEST_URI} !^/\\.well-known/acme-challenge/\nRewriteCond %{HTTPS} !=on [OR]\nRewriteCond %{HTTP_HOST} !^mosaicosmc\\.com$ [NC]\nRewriteRule ^ https://mosaicosmc.com%{REQUEST_URI} [R=301,L]\n${redirects}\nRewriteRule ^index\\.php$ / [R=301,L]\nRewriteRule (^|/)\\.(?!well-known/) - [F,L]\n</IfModule>\n<FilesMatch "\\.(?:php|phtml|phar|ini|sql|bak|log)$">\nRequire all denied\n</FilesMatch>\n<IfModule mod_headers.c>\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set X-Frame-Options "SAMEORIGIN"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set Content-Security-Policy "frame-ancestors 'self'"\nHeader always set Permissions-Policy "camera=(), microphone=(), geolocation=()"\n<FilesMatch "\\.(?:html|xml|txt)$">\nHeader set Cache-Control "public, max-age=0, must-revalidate"\n</FilesMatch>\n<FilesMatch "\\.(?:css|js|woff2|webp|jpg|jpeg|png|svg|mp4|pdf)$">\nHeader set Cache-Control "public, max-age=86400"\n</FilesMatch>\n</IfModule>\n<IfModule mod_deflate.c>\nAddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml application/xml text/plain\n</IfModule>\n`);
for(const file of walk(output).filter(f=>/\.(html|xml|txt|css|js)$/.test(f))){
  if(fs.readFileSync(file,'utf8').includes('estudioideamos.github.io/mosaicos-mc-web'))throw Error('Preview URL leaked: '+file);
}
if(pages!==32)throw Error('Unexpected production page count '+pages);
const manifest={release,files:Object.fromEntries(walk(output).map(file=>[path.relative(output,file).replaceAll('\\','/'),createHash('sha256').update(fs.readFileSync(file)).digest('hex')]))};
fs.writeFileSync(path.join(output,'.mc-release.json'),JSON.stringify(manifest));
console.log(`Production ready: ${pages} pages, canonical domain, original GTM, redirects and hosting headers.`);
