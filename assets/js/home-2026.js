(() => {
const gallery=document.querySelector('.mc-hero-gallery');
if(gallery){
 const slides=[...gallery.querySelectorAll('.mc-slide')];
 const pause=gallery.querySelector('[data-slide-pause]');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer,paused=motion.matches,hovered=false,focused=false;
 const load=i=>{const img=slides[i].querySelector('img');if(img.dataset.src){img.src=img.dataset.src;delete img.dataset.src;}};
 const show=i=>{
  index=(i+slides.length)%slides.length;load(index);
  const label=gallery.querySelector("[data-hero-caption]");
  if(label)label.textContent=slides[index].classList.contains("mc-slide--space")?"Espacios para inspirarte · Ambiente ilustrativo":"La materia de cerca · Mosaicos MC";
  slides.forEach((s,n)=>{s.classList.toggle('is-active',n===index);s.setAttribute('aria-hidden',String(n!==index));});
  gallery.querySelector('[data-slide-count]').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  load((index+1)%slides.length);
 };
 const sync=()=>{
  clearInterval(timer);
  pause.textContent=paused?'Reproducir':'Pausar';
  pause.setAttribute('aria-label',paused?'Reproducir presentación':'Pausar presentación');
  if(!paused&&!hovered&&!focused&&!document.hidden)timer=setInterval(()=>show(index+1),6000);
 };
 gallery.querySelector('[data-slide-prev]').addEventListener('click',()=>{show(index-1);sync();});
 gallery.querySelector('[data-slide-next]').addEventListener('click',()=>{show(index+1);sync();});
 pause.addEventListener('click',()=>{paused=!paused;sync();});
 gallery.addEventListener('mouseenter',()=>{hovered=true;sync();});
 gallery.addEventListener('mouseleave',()=>{hovered=false;sync();});
 gallery.addEventListener('focusin',()=>{focused=true;sync();});
 gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget)){focused=false;sync();}});
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener('change',()=>{paused=motion.matches;sync();});
 show(0);sync();
}
const spaces={
 vereda:{title:'Una vereda con identidad.',text:'Explorá losetas de exterior y opciones rústicas. Confirmá el modelo según circulación, terminación y condiciones de colocación.',links:[['Exterior pulida','productos/exterior-pulida/'],['Línea rústica','productos/rusticos/']]},
 living:{title:'Texturas para vivir todos los días.',text:'Los mosaicos compactos pulidos están indicados para interiores. Elegí formato y color para tu living.',links:[['Compactos de 40 × 40 · OC300','productos/mosaicos/mosaico-compacto/'],['Compactos de 30 × 30 · OD300','productos/mosaicos/mosaico-compacto-30/']]},
 cocina:{title:'Elegí tu piso de cocina con asesoramiento.',text:'Podés explorar los compactos de interior como punto de partida. Consultanos por limpieza, manchas y condiciones de humedad antes de definir la terminación.',links:[['Explorar mosaicos de interior','productos/mosaicos/']]},
 garage:{title:'Un piso pensado para tu garage.',text:'El uso vehicular requiere confirmar cargas, base y sistema de colocación. Conocé el adoquín Holanda y consultá su aptitud para tu proyecto.',links:[['Conocer adoquín Holanda','productos/bloques-de-hormigon/adoquin-gris/']]},
 'baño':{title:'Definamos la solución para tu baño.',text:'La humedad y el riesgo de deslizamiento necesitan una recomendación específica. Contanos si se trata del piso general, una ducha o un revestimiento para confirmar un producto adecuado.',links:[]},
 piscina:{title:'Disfrutá el exterior de tu piscina.',text:'Explorá atérmicos para bordes y solárium. Si necesitás revestir el interior del vaso, consultanos: esta selección no corresponde a ese uso.',links:[['Solárium y bordes atérmicos','productos/atermicos/para-decks-y-piletas/'],['Listón atérmico','productos/atermicos/liston-atermico/']]},
 quincho:{title:'Un quincho con tu estilo.',text:'Para interiores protegidos, explorá mosaicos; para sectores exteriores, opciones rústicas. Confirmá exposición y uso al elegir.',links:[['Mosaicos','productos/mosaicos/'],['Línea rústica','productos/rusticos/']]}
};
document.querySelectorAll('[data-space]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.space,space=spaces[key],result=document.querySelector('[data-space-result]');
 document.querySelectorAll('[data-space]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 result.hidden=false;
 result.querySelector('[data-space-title]').textContent=space.title;
 result.querySelector('[data-space-description]').textContent=space.text;
 const links=result.querySelector('[data-space-links]');links.replaceChildren();
 const items=[...space.links,['Consultar por mi '+key,'https://wa.me/5491138789057?text='+encodeURIComponent('Hola Mosaicos MC, necesito asesoramiento para '+key+'.')]];
 for(const [label,href] of items){const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}links.appendChild(a);}
 document.querySelector('[data-space-status]').textContent='Opciones para '+key+' disponibles debajo.';
}));
})();
(() => {
  const video = document.querySelector("[data-home-film]");
  const control = document.querySelector("[data-film-control]");
  if (!video || !control) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let manualPause = false;
  let visible = false;
  const sync = () => {
    const paused = video.paused;
    control.innerHTML = paused ? '<span>Reproducir</span><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 3.5 16 10 6 16.5Z" fill="currentColor"/></svg>' : '<span>Pausar</span><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="5" y="4" width="3" height="12" rx=".7" fill="currentColor"/><rect x="12" y="4" width="3" height="12" rx=".7" fill="currentColor"/></svg>';
    control.setAttribute("aria-label", paused ? "Reproducir video" : "Pausar video");
  };
  const play = () => video.play().catch(sync);
  const auto = () => {
    if (visible && !document.hidden && !motion.matches && !manualPause) play();
    else video.pause();
  };
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; auto(); }, {threshold:.2}).observe(video);
  control.addEventListener("click", () => {
    if (video.paused) { manualPause = false; play(); }
    else { manualPause = true; video.pause(); }
  });
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  document.addEventListener("visibilitychange", auto);
  motion.addEventListener("change", auto);
})();

(() => {
 const section=document.querySelector('.mc-social');
 if(!section)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 section.addEventListener('pointermove',event=>{
  if(motion.matches || event.pointerType!=='mouse')return;
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{const box=section.getBoundingClientRect();section.style.setProperty('--social-x',((event.clientX-box.left)/box.width*100)+'%');section.style.setProperty('--social-y',((event.clientY-box.top)/box.height*100)+'%');});
 });
})();

(() => {
 const section=document.querySelector('.mc-lines');if(!section)return;
 const preview=section.querySelector('.mc-lines__preview>img');
 const caption=section.querySelector('[data-line-caption]');
 const collectionLink=section.querySelector('[data-line-link]');
 let current=preview.getAttribute('src');
 section.querySelectorAll('.mc-line-choice').forEach(link=>{
  const show=()=>{
   section.querySelectorAll('.mc-line-choice').forEach(item=>item.classList.toggle('is-active',item===link));
   if(current===link.dataset.lineImage)return;
   current=link.dataset.lineImage;preview.src=current;
   preview.alt='Ambiente ilustrativo de la línea '+link.dataset.lineName;
   caption.textContent=link.dataset.lineName;
   collectionLink.href=link.href;
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches)preview.animate([{opacity:.5,transform:'scale(1.03)'},{opacity:1,transform:'scale(1)'}],{duration:500,easing:'ease-out'});
  };
  link.addEventListener('pointerenter',show);link.addEventListener('focus',show);
 });
})();

(() => {
 const section=document.querySelector('.mc-lines');if(!section)return;
 const nav=section.querySelector('nav');
 const cards=[...nav.querySelectorAll('.mc-line-choice')];
 const move=direction=>{
  const width=cards[0].getBoundingClientRect().width+18;
  const target=Math.max(0,Math.min(cards.length-1,Math.round(nav.scrollLeft/width)+direction));
  nav.scrollTo({left:target*width,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 };
 section.querySelector('[data-lines-prev]').addEventListener('click',()=>move(-1));
 section.querySelector('[data-lines-next]').addEventListener('click',()=>move(1));
})();
