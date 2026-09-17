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
import vm from 'node:vm';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('assets/js/client-catalog.js','utf8'),context);
const received=context.window.clientCatalog;
const seenProducts=new Set();
for(const p of received.products){
 const id=p.line+'/'+p.slug;
 if(seenProducts.has(id)) throw new Error('Duplicate product: '+id);
 seenProducts.add(id);
 if(!fs.existsSync('productos/'+id+'/index.html')) throw new Error('Missing product route: '+id);
 for(const image of [p.image,p.detailImage,...p.variants.map(v=>v.image)]){
  if(!fs.existsSync(image.replace(/^@\//,''))) throw new Error('Missing client photo: '+image);
 }
 for(const v of p.variants){
  if(v.code && !v.name.includes(v.code)) throw new Error('Variant code not visible: '+id);
  if(!v.source) throw new Error('Missing variant provenance: '+id);
 }
}
for(const b of received.banners) if(!fs.existsSync(b.image.replace(/^@\//,''))) throw new Error('Missing banner');
console.log('Client catalog validated: '+seenProducts.size+' products; codes, routes, photographs and source references.');
