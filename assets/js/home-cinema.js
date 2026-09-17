(() => {
 const root=document.querySelector('.mc-cinema');if(!root)return;
 const slides=[...root.querySelectorAll('.mc-cinema__slide')],pause=root.querySelector('[data-cinema-pause]'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,paused=motion.matches,timer,visible=true;
 const playing=()=>!paused&&visible&&!document.hidden;
 const sync=()=>{
  clearTimeout(timer);
  pause.setAttribute('aria-label',paused?'Reproducir presentación':'Pausar presentación');
  pause.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true">'+(paused?'<path d="m6 3 11 7-11 7Z"/>':'<rect x="5" y="4" width="3" height="12"/><rect x="12" y="4" width="3" height="12"/>')+'</svg>';
  root.style.setProperty('--cinema-play-state',playing()?'running':'paused');
  if(!playing())return;
  timer=setTimeout(()=>show(index+1),7000);
 };
 const show=i=>{
  index=(i+slides.length)%slides.length;
  slides.forEach((slide,n)=>{slide.classList.toggle('is-active',n===index);slide.inert=n!==index;slide.setAttribute('aria-hidden',String(n!==index));});
  root.querySelector('[data-cinema-count]').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  sync();
 };
 root.querySelector('[data-cinema-prev]').addEventListener('click',()=>show(index-1));
 root.querySelector('[data-cinema-next]').addEventListener('click',()=>show(index+1));
 pause.addEventListener('click',()=>{paused=!paused;sync();});
 root.addEventListener('focusin',e=>{if(e.target.closest('.mc-cinema__slide')){paused=true;sync();}});
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener('change',()=>{paused=motion.matches;sync();});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15}).observe(root);
 const whatsapp=document.querySelector('.whatsapp-float');
 const updateFloatingContact=onHero=>{
  document.body.classList.toggle('mc-hero-in-view',onHero);
  if(whatsapp)whatsapp.inert=onHero;
 };
 const bounds=root.getBoundingClientRect();
 updateFloatingContact(bounds.bottom>0&&bounds.top<innerHeight);
 new IntersectionObserver(([entry])=>updateFloatingContact(entry.isIntersecting),{threshold:0}).observe(root);
 sync();
})();
