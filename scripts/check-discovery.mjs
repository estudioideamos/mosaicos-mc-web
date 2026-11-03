import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>f.endsWith('.html')&&!f.startsWith('_site/'));
const titles=new Set();let checked=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');if(/http-equiv=["']refresh/i.test(html))continue;
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];if(titles.has(title))throw Error('Duplicate title '+file);titles.add(title);
 const desc=html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
 const og=html.match(/<meta property="og:description" content="([^"]*)"/)?.[1];
 if(!desc||desc!==og)throw Error('Missing/inconsistent description '+file);
 if(/fonts\.(?:googleapis|gstatic)\.com/.test(html))throw Error('Remote fonts remain '+file);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 if(!graph.some(n=>n['@type']==='WebPage')||!graph.some(n=>Array.isArray(n['@type'])&&n['@type'].includes('LocalBusiness')))throw Error('Missing entity data '+file);
 if(file!=='index.html'&&!graph.some(n=>n['@type']==='BreadcrumbList'))throw Error('Missing breadcrumbs '+file);
 if(file==='preguntas-frecuentes/index.html'&&!graph.some(n=>n['@type']==='FAQPage'&&n.mainEntity.length===20))throw Error('Missing FAQ structured data');
 for(const [,ref,hash] of html.matchAll(/(?:src|href)="([^"?]+\.(?:css|js))\?v=([a-f0-9]+)"/g)){
   const actual=createHash('sha256').update(fs.readFileSync(path.resolve(path.dirname(file),ref))).digest('hex').slice(0,12);
   if(actual!==hash)throw Error('Stale asset version '+file+' '+ref);
 }
 checked++;
}
for(const file of ['robots.txt','llms.txt','llms-full.txt','sitemap.xml'])if(!fs.existsSync(file))throw Error('Missing discovery file '+file);
const full=fs.readFileSync('llms-full.txt','utf8');
if((full.match(/^## /gm)||[]).length!==20)throw Error('Incomplete text catalog');
console.log(`Discovery validated: ${checked} unique pages, matching descriptions, entity graphs, FAQ, local fonts, current asset hashes and 20-product text catalog.`);
