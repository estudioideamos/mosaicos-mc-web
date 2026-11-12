const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector('[data-contact-status]');
  const button = contactForm.querySelector('button[type="submit"]');
  let sessionPromise = null;
  let sending = false;
  const prepare = () => {
    if (!sessionPromise) {
      sessionPromise = fetch('/api/contact.php', {credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(10000)})
        .then(async response => {
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error(result.message || 'No pudimos preparar el formulario.');
          return {...result, readyAt:Date.now() + Number(result.wait || 0) * 1000};
        }).catch(error => {sessionPromise=null;throw error;});
    }
    return sessionPromise;
  };
  if (location.hostname.endsWith('.github.io')) {
    contactForm.innerHTML = '<span class="kicker">Contanos tu idea</span><h2>Dejanos tu consulta</h2><p>Enviá tu mensaje desde nuestra página de contacto.</p><a class="button button--dark" href="https://mosaicosmc.com/contacto/">Ir al formulario de contacto</a>';
  } else {
    contactForm.addEventListener('focusin', () => {prepare().catch(()=>{});}, {once:true});
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !contactForm.reportValidity()) return;
      const data = Object.fromEntries(new FormData(contactForm));
      if (String(data.website_confirmation || '').trim()) return;
      sending=true;button.disabled=true;button.textContent='Enviando…';status.textContent='';status.classList.remove('contact-success');
      try {
        const session = await prepare();
        const wait = Math.max(0, session.readyAt-Date.now());
        if (wait) await new Promise(resolve=>setTimeout(resolve,wait));
        const response = await fetch('/api/contact.php', {
          method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({...data,token:session.token}),signal:AbortSignal.timeout(25000)
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.message || 'No pudimos enviar la consulta.');
        status.classList.add('contact-success');
        status.innerHTML='<span class="contact-success__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 4 4 8-8"/></svg></span><span class="contact-success__content"><span class="contact-success__eyebrow">Mensaje enviado</span><strong class="contact-success__title">Gracias por escribirnos.</strong><span class="contact-success__text">Tu consulta ya está en manos de nuestro equipo. Te responderemos por email.</span></span>';
        contactForm.reset();sessionPromise=null;
        status.focus({preventScroll:true});
        status.scrollIntoView({behavior:'instant',block:'nearest'});
        window.dataLayer=window.dataLayer||[];
        window.dataLayer.push({event:'form_submit',form_id:'contacto'});
      } catch (error) {
        sessionPromise=null;
        status.textContent=error.name==='TimeoutError' ? 'El servidor está tardando en responder. Revisá antes de reenviar para evitar una consulta duplicada.' : (error instanceof SyntaxError ? 'El servidor no pudo confirmar el envío. Contactanos por email o WhatsApp antes de reenviar la consulta.' : (error instanceof TypeError ? 'No pudimos conectar con el servidor. Intentá nuevamente más tarde o contactanos por email o WhatsApp.' : (error.message || 'No pudimos enviar la consulta. Intentá nuevamente.')));
      } finally {sending=false;button.disabled=false;button.textContent='Enviar consulta';}
    });
  }
}
if(contactForm && 'ResizeObserver' in window){
 const updateContactSticky=()=>contactForm.style.setProperty('--contact-sticky-top',Math.min(104,window.innerHeight-contactForm.offsetHeight-24)+'px');
 new ResizeObserver(updateContactSticky).observe(contactForm);
 window.addEventListener('resize',updateContactSticky,{passive:true});updateContactSticky();
}
