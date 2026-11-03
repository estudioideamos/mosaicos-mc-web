import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

const decode = s => s.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp|aacute|eacute|iacute|oacute|uacute|ntilde|times|sup2);/gi, (m,k) => k[0]==='#' ? String.fromCodePoint(k[1].toLowerCase()==='x'?parseInt(k.slice(2),16):Number(k.slice(1))) : ({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' ',aacute:'á',eacute:'é',iacute:'í',oacute:'ó',uacute:'ú',ntilde:'ñ',times:'×',sup2:'²'}[k]||m));
const plain = s => decode(s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
const digest = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
const data={window:{}};vm.runInNewContext(fs.readFileSync('assets/js/client-catalog.js','utf8'),data);
const catalog=data.window.clientCatalog;

export function enhanceOutput(files, root) {
  const labels = {'exterior-pulida':'Exterior pulida','mosaicos':'Mosaicos','atermicos':'Atérmicos','rusticos':'Rústicos','bloques-de-hormigon':'Bloques de hormigón','productos':'Productos','nosotros':'Nosotros','contacto':'Contacto','descargas':'Descargas','obras':'Obras','preguntas-frecuentes':'Preguntas frecuentes'};
  for (const line of catalog.lines||[]) labels[line.slug]=line.name;
  for (const product of catalog.products) labels[product.slug]=product.name;
  for(const file of files){
    let html=fs.readFileSync(file,'utf8');if(/http-equiv=["']refresh/i.test(html))continue;
    const prefix=path.relative(path.dirname(file),'.').replaceAll('\\','/');const base=prefix?prefix+'/':'';
    // Remove the remote CSS/font handshake and use the licensed local variable fonts.
    html=html.replace(/\s*<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g,'');
    html=html.replace(/\s*<!-- performance:start -->[\s\S]*?<!-- performance:end -->/g,'');
    const localFonts=`<!-- performance:start -->\n<link rel="preload" href="${base}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />\n<link rel="preload" href="${base}assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin />\n<link rel="stylesheet" href="${base}assets/css/fonts.css" />\n<!-- performance:end -->\n`;
    html=html.replace(/(<link\b[^>]*rel="stylesheet")/,localFonts+'$1');
    html=html.replace(/ https:\/\/fonts\.googleapis\.com/g,'').replace(/ https:\/\/fonts\.gstatic\.com/g,'');
    html=html.replace(/\s*<script defer src="[^"]*assets\/js\/form-guard.js[^"]*"><\/script>/g,'');
    html=html.replace('</body>',`<script defer src="${base}assets/js/form-guard.js"></script>\n</body>`);
    if (file === 'contacto/index.html') {
      html=html.replace(/(<iframe\b[^>]*?)\ssrc="/g,'$1 data-map-src="');
      html=html.replace(/\s*<script defer src="[^"]*assets\/js\/lazy-embeds.js[^"]*"><\/script>/g,'');
      html=html.replace('</body>',`<script defer src="${base}assets/js/lazy-embeds.js"></script>\n</body>`);
    }
    // Avoid layout changes while the small brand image decodes.
    html=html.replace(/<img\b[^>]*class="brand__logo"[^>]*>/g, tag=>tag.includes('width=')?tag:tag.replace(' />',' width="1175" height="208" decoding="async" />'));
    // Discover CSS background hero images early, ahead of below-fold catalog images.
    html=html.replace(/\s*<link data-hero-preload[^>]*>/g,'');
    const hero=html.match(/--hero-image:\s*url\('([^']+)'\)/);
    if(hero) html=html.replace('</head>',`<link data-hero-preload rel="preload" as="image" fetchpriority="high" href="${hero[1]}" />\n</head>`);
    html=html.replace(/<img\b[^>]*loading="lazy"[^>]*>/g,tag=>tag.includes('fetchpriority=')?tag:tag.replace('<img','<img fetchpriority="low"'));
    html=html.replace(/referrerpolicy="no-referrer-when-downgrade"/g,'referrerpolicy="strict-origin-when-cross-origin"');
    // Build a single complete entity graph; do not create conflicting runtime graphs.
    html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(_,json)=>{
      const schema=JSON.parse(json),graph=schema['@graph'];if(!graph)return _;
      const org=graph.find(n=>n['@type']==='Organization');
      Object.assign(org,{'@type':['Organization','LocalBusiness'],foundingDate:'1978',address:{'@type':'PostalAddress',streetAddress:'Ing. Guillermo Marconi 1962',addressLocality:'El Palomar',addressRegion:'Buenos Aires',addressCountry:'AR'},telephone:'+54 9 11 3878-9057',openingHoursSpecification:[['08:30','12:00'],['13:30','17:00']].map(([opens,closes])=>({'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens,closes}))});
      const page=graph.find(n=>n['@type']==='WebPage');page.description=decode(page.description);page.name=decode(page.name);page.about={'@id':root+'#organization'};
      const parts=file.replace(/\/index\.html$/,'').split('/');
      if(file!=='index.html')graph.push({'@type':'BreadcrumbList','@id':page.url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:root},...parts.map((part,i)=>({'@type':'ListItem',position:i+2,name:labels[part]||part.replaceAll('-',' '),item:new URL(parts.slice(0,i+1).join('/')+'/',root).href}))]});
      const faqs=[...html.split('<footer')[0].matchAll(/<details\b[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(m=>({'@type':'Question',name:plain(m[1]),acceptedAnswer:{'@type':'Answer',text:plain(m[2])}}));
      if(faqs.length)graph.push({'@type':'FAQPage','@id':page.url+'#faq',mainEntity:faqs});
      return '<script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>';
    });
    html=html.replace(/<script\b(?=[^>]*\bsrc=)(?![^>]*\bdefer\b)/g, '<script defer');
    // Hash every local stylesheet/script: no stale files after a deployment.
    html=html.replace(/((?:src|href)=")([^"?]+\.(?:css|js))(?:\?[^" ]*)?"/g,(m,a,ref)=>{
      if(/^(?:https?:|\/\/)/.test(ref))return m;
      const local=path.resolve(path.dirname(file),ref);return fs.existsSync(local)?a+ref+'?v='+digest(local)+'"':m;
    });
    fs.writeFileSync(file,html);
  }
  fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\n\nSitemap: '+root+'sitemap.xml\n');
  const lines=catalog.products.map(p=>`- [${p.name}](${root}productos/${p.line}/${p.slug}/): ${p.heroSummary}`);
  let llms=fs.readFileSync('llms.txt','utf8').split('\n## Fichas de productos')[0].trimEnd();
  llms+='\n\n## Fichas de productos\n'+lines.join('\n')+'\n\n## Datos verificados del catálogo\n- [Catálogo en texto]('+root+'llms-full.txt): medidas, variantes y códigos confirmados; no incluye precios.\n';
  fs.writeFileSync('llms.txt',llms);
  fs.writeFileSync('llms-full.txt','# Mosaicos MC — catálogo de consulta\n\nFuente: '+root+'\nFabricación desde 1978. Compra mínima: 10 m² por modelo antes del desperdicio. Presupuestos por WhatsApp, sin pagos online. Horarios: lunes a viernes, 8:30 a 12 y 13:30 a 17 hs.\nLos códigos no informados se consultan. No inferir códigos, precios, disponibilidad ni aplicaciones no especificadas.\n\n'+catalog.products.map(p=>`## ${p.name}\n${root}productos/${p.line}/${p.slug}/\n${p.heroSummary}\n${p.specs.map(([k,v])=>'- '+k+': '+v).join('\n')}\nVariantes: ${p.variants.map(v=>v.name+(v.code?' ('+v.code+')':' — consultar código')).join('; ')}.\n`).join('\n'));
}
