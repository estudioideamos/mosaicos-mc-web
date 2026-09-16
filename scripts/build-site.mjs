import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const output = '_site';
if (fs.existsSync(output)) throw new Error('_site already exists; use a clean build directory.');
fs.mkdirSync(output);
const files = execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/);
for (const file of files) {
  if (!(file.startsWith('assets/') || file.endsWith('.html') || ['robots.txt','sitemap.xml','.nojekyll'].includes(file))) continue;
  if (file.split('/').some(part=>part.startsWith('.')) && file!=='.nojekyll') continue;
  if (!/\.(?:html|css|js|svg|png|jpe?g|webp|avif|gif|ico|pdf|mp4|webm|woff2?|ttf|xml|txt)$/i.test(file) && file!=='.nojekyll') continue;
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Non-regular public file: '+file);
  const dest=path.join(output,file);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(file,dest);
}
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log('Public website prepared in _site; repository configuration and tools excluded.');
