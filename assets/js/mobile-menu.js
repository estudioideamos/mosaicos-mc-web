(() => {
 const trigger=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('[data-site-nav]');
 if(!trigger||!nav)return;
 const root=new URL(document.querySelector('.brand').getAttribute('href'),location.href);
 const url=path=>new URL(path,root).href;
 const menu=document.createElement('dialog');menu.className='mc-mobile-menu';menu.id='mc-mobile-menu';menu.setAttribute('aria-label','Menú principal');
 const lines=[['Exterior pulida','exterior-pulida'],['Mosaicos','mosaicos'],['Atérmicos','atermicos'],['Rústicos','rusticos'],['Bloques de hormigón','bloques-de-hormigon']];
 menu.innerHTML=`<div class="mc-mobile-menu__header"><a href="${root.href}" aria-label="Mosaicos MC — Inicio"><img src="${url('assets/img/logo-negro.png')}" alt="Mosaicos MC" width="210" height="38"></a><button type="button" data-menu-close aria-label="Cerrar menú" autofocus><span></span><span></span></button></div><div class="mc-mobile-menu__scroll"><p class="mc-mobile-menu__intro">Materiales para <em>dejar huella.</em></p><nav aria-label="Navegación móvil" class="mc-mobile-menu__links"></nav><div class="mc-mobile-menu__bottom"><span>Tu idea merece un buen comienzo.</span><a href="${url('contacto/')}">Hablemos de tu proyecto <span aria-hidden="true">↗</span></a><div><a href="https://www.instagram.com/mosaicosmcsrl" target="_blank" rel="noopener noreferrer">Instagram ↗</a><span>Desde 1978 · El Palomar</span></div></div></div>`;
 const links=menu.querySelector('.mc-mobile-menu__links');
 [...nav.querySelectorAll('a')].forEach((source,i)=>{
  const label=source.textContent.trim(),number=String(i+1).padStart(2,'0');
  if(label==='Productos'){
   const details=document.createElement('details');details.className='mc-mobile-menu__products';
   details.innerHTML=`<summary><span class="mc-mobile-menu__number">${number}</span><span>Productos</span><span class="mc-mobile-menu__plus" aria-hidden="true"></span></summary><div class="mc-mobile-menu__sub"><a href="${url('productos/')}">Ver todas las líneas <span aria-hidden="true">↗</span></a>${lines.map(([name,slug])=>`<a href="${url('productos/'+slug+'/')}">${name}<span aria-hidden="true">↗</span></a>`).join('')}</div>`;
   links.append(details);
  }else{
   const link=document.createElement('a');link.href=source.href;link.innerHTML=`<span class="mc-mobile-menu__number">${number}</span><span data-menu-label></span><span class="mc-mobile-menu__arrow" aria-hidden="true">↗</span>`;
   link.querySelector('[data-menu-label]').textContent=label;
   if(new URL(source.href).pathname===location.pathname)link.setAttribute('aria-current','page');
   links.append(link);
  }
 });
 document.body.append(menu);trigger.setAttribute('aria-controls',menu.id);trigger.setAttribute('aria-haspopup','dialog');
 trigger.addEventListener('click',()=>{if(!matchMedia('(max-width:820px)').matches)return;menu.showModal();document.documentElement.classList.add('mc-mobile-menu-open');trigger.setAttribute('aria-expanded','true');menu.querySelector('.mc-mobile-menu__scroll').scrollTop=0;});
 menu.querySelector('[data-menu-close]').addEventListener('click',()=>menu.close());
 menu.addEventListener('close',()=>{document.documentElement.classList.remove('mc-mobile-menu-open');trigger.setAttribute('aria-expanded','false');});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
 matchMedia('(max-width:820px)').addEventListener('change',e=>{if(!e.matches&&menu.open)menu.close();});
})();
