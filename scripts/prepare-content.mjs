import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root='https://estudioideamos.github.io/mosaicos-mc-web/';
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>f.endsWith('.html')&&!f.startsWith('_site/'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const urls=[];
for(const file of files){
 let html=fs.readFileSync(file,'utf8');
 if(/http-equiv=["']refresh/i.test(html))continue;
 const url=new URL(file.replace(/index\.html$/,''),root).href;
 let product;
 if(html.includes('data-product-shell')){
  const dataset=Object.fromEntries([...html.matchAll(/data-(page-type|line-slug|product-slug|base-prefix)="([^"]*)"/g)].map(m=>[m[1].replace(/-([a-z])/g,(_,x)=>x.toUpperCase()),m[2]]));
  const shell={innerHTML:''};
  const window={__STATIC_BUILD__:true,location:{href:url}};
  const context=vm.createContext({window,URL,document:{body:{dataset},querySelector:()=>shell}});
  for(const f of ['products-data.js','client-catalog.js','quote-materials.js'])vm.runInContext(fs.readFileSync('assets/js/'+f,'utf8'),context);
  vm.runInContext(fs.readFileSync('assets/js/site.js','utf8').split('window.addEventListener')[0],context);
  vm.runInContext(fs.readFileSync('assets/js/products-pages.js','utf8'),context);
  if(!shell.innerHTML.includes('<h1>'))throw Error('Missing rendered title: '+file);
  html=html.replace(/<main data-product-shell>[\s\S]*?<\/main>/,'<main data-product-shell>'+shell.innerHTML+'</main>');
  product=window.clientCatalog.products.find(p=>p.line===dataset.lineSlug&&p.slug===dataset.productSlug);
  if(product)html=html.replace(/(<meta name="description" content=")[^"]*/,(_,a)=>a+esc(product.heroSummary));
 }
 const title=html.match(/<title>(.*?)<\/title>/s)[1];
 const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'Mosaicos y baldosas desde 1978. Conocé las líneas de productos de Mosaicos MC.';
 const graph=[{'@type':'Organization','@id':root+'#organization',name:'Mosaicos MC',url:root,logo:root+'assets/img/logo-negro.png',sameAs:['https://www.instagram.com/mosaicosmcsrl/']},{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'es-AR',isPartOf:{'@id':root+'#website'}},{'@type':'WebSite','@id':root+'#website',url:root,name:'Mosaicos MC',inLanguage:'es-AR',publisher:{'@id':root+'#organization'}}];
 if(product)graph.push({'@type':'Product',name:product.name,description:product.heroSummary,image:new URL(product.image.replace('@/',''),root).href,url,brand:{'@type':'Brand',name:'Mosaicos MC'},category:product.line,additionalProperty:product.specs.map(([name,value])=>({'@type':'PropertyValue',name,value}))});
 const metadata=`<!-- seo:start -->
<meta http-equiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'; upgrade-insecure-requests" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_AR" />
<meta property="og:site_name" content="Mosaicos MC" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${root}assets/img/social/mosaicos-mc-share.jpg" />
<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Mosaicos MC. Espacios que dejan huella. Mosaicos y baldosas desde 1978." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${root}assets/img/social/mosaicos-mc-share.jpg" />
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>
<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
<!-- seo:end -->`;
 html=html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->\s*/,'').replace('</head>',metadata+'\n</head>');
 const prefix=path.relative(path.dirname(file),'.').replaceAll('\\','/');
 const assetRoot=prefix ? prefix+'/' : '';
 html=html.replace(/\s*<!-- smooth-scroll:start -->[\s\S]*?<!-- smooth-scroll:end -->/,'');
 html=html.replace('</body>',`<!-- smooth-scroll:start -->
<script defer src="${assetRoot}assets/vendor/lenis/lenis.min.js?v=1.3.26"></script>
<script defer src="${assetRoot}assets/js/smooth-scroll.js?v=20260921-2"></script>
<!-- smooth-scroll:end -->\n</body>`);
 html=html.replace(/\s*<link rel="stylesheet" href="[^"]*assets\/css\/smooth-scroll.css[^"]*"\s*\/>/g,'');
 html=html.replace('</head>',`<link rel="stylesheet" href="${assetRoot}assets/css/smooth-scroll.css?v=20260921-2" />\n</head>`);
 html=html.replace(/site.css\?v=[^"']+/g,'site.css?v=20260917-performance').replace(/mobile-menu.js\?v=[^"']+/g,'mobile-menu.js?v=20260917-security').replace(/site.js\?v=[^"']+/g,'site.js?v=20260921-scroll-engine').replace(/products-pages.js\?v=[^"']+/g,'products-pages.js?v=20260917-performance');
 html=html.replace(/\s*<link rel="stylesheet" href="[^"]*assets\/css\/client-2026.css[^"]*"\s*\/>/g,'');
 html=html.replace('</head>',`<link rel="stylesheet" href="${assetRoot}assets/css/client-2026.css?v=20260922-1" />\n</head>`);
 html=html.replace(/(assets\/(?:js|css)\/[\w-]+\.(?:js|css))\?v=[^"']+/g,(match,asset)=>asset.includes('smooth-scroll')?match:/(?:client-2026|home-cinema)\.css$/.test(asset)?asset+'?v=20260924-header':asset+'?v='+(/(?:client-2026.css|client-catalog.js|products-pages.js|quote-materials.js|factory-film.js)$/.test(asset)?'20260924-additions':'20260922-client'));
 html=html.replace(/back-to-top.js\?v=[^"']+/g,'back-to-top.js?v=20260921-scroll-engine');
 fs.writeFileSync(file,html.replace(/[ \t]+$/gm,''));urls.push(url);
}
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`Prepared ${urls.length} static pages with canonical metadata and structured data.`);
