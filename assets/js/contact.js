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
      sending=true;button.disabled=true;button.textContent='Enviando…';status.textContent='';
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
        status.textContent=result.message;contactForm.reset();sessionPromise=null;
        window.dataLayer=window.dataLayer||[];
        window.dataLayer.push({event:'form_submit',form_id:'contacto'});
      } catch (error) {
        sessionPromise=null;
        status.textContent=error.name==='TimeoutError' ? 'El servidor está tardando en responder. Revisá antes de reenviar para evitar una consulta duplicada.' : (error instanceof TypeError || error instanceof SyntaxError ? 'No pudimos conectar con el servidor. Revisá tu conexión e intentá nuevamente.' : (error.message || 'No pudimos enviar la consulta. Intentá nuevamente.'));
      } finally {sending=false;button.disabled=false;button.textContent='Enviar consulta';}
    });
  }
}
if(contactForm && 'ResizeObserver' in window){
 const updateContactSticky=()=>contactForm.style.setProperty('--contact-sticky-top',Math.min(104,window.innerHeight-contactForm.offsetHeight-24)+'px');
 new ResizeObserver(updateContactSticky).observe(contactForm);
 window.addEventListener('resize',updateContactSticky,{passive:true});updateContactSticky();
}
