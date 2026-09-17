(() => {
 const root=document.querySelector('.about-editorial');if(!root)return;
 const buttons=[...root.querySelectorAll('[data-year]')];
 const show=(year)=>{buttons.forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.year===year)));root.querySelectorAll('[data-year-panel]').forEach(p=>p.hidden=p.dataset.yearPanel!==year);};
 buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.year)));show('1978');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
  root.classList.add('about-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});root.querySelectorAll('[data-about-reveal]').forEach(e=>observer.observe(e));
 }
})();
