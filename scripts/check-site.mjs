import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const files = execFileSync('git', ['ls-files','--cached','--others','--exclude-standard'], {encoding:'utf8'}).trim().split(/\r?\n/);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const errors = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file,'utf8');
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(file+': missing title');
  if (!/name=["']viewport["']/i.test(html)) errors.push(file+': missing viewport');
  for (const match of html.matchAll(/\b(?:href|src|poster)=["']([^"']+)["']/gi)) {
    const ref = match[1].split(/[?#]/)[0];
    if (!ref || /^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const local = decodeURIComponent(ref).replace(/^\/mosaicos-mc-web\//,'/');
    const target = local.startsWith('/') ? local.slice(1) : path.join(path.dirname(file),local);
    if (!fs.existsSync(target)) errors.push(file+': missing '+ref);
  }
}
for (const file of files.filter(f=>f.endsWith('.js') || f.endsWith('.mjs'))) {
  try { execFileSync(process.execPath,['--check',file],{stdio:'pipe'}); }
  catch { errors.push(file+': invalid JavaScript'); }
}
const faq = fs.readFileSync('preguntas-frecuentes/index.html','utf8');
if ((faq.match(/<details\b/g)||[]).length !== 20) errors.push('FAQ: expected 20 questions');
if ((faq.match(/<summary\b/g)||[]).length !== 20) errors.push('FAQ: each question needs a summary');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Validated '+htmlFiles.length+' HTML pages, local links, JavaScript syntax and FAQ.');
