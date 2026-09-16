const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('nombre') || '').trim();
    const message = String(data.get('mensaje') || '').trim();
    contactForm.elements.namedItem('nombre').setCustomValidity(name ? '' : 'Ingresá tu nombre.');
    contactForm.elements.namedItem('mensaje').setCustomValidity(message ? '' : 'Contanos qué necesitás.');
    if (!contactForm.reportValidity()) return;
    const lines = ['Hola Mosaicos MC, quisiera hacer una consulta.','Nombre: '+name];
    if (data.get('email')) lines.push('Email: '+String(data.get('email')).trim());
    if (data.get('telefono')) lines.push('Teléfono: '+String(data.get('telefono')).trim());
    lines.push('Tipo de proyecto: '+data.get('tipo'),'',message);
    const url='https://wa.me/5491138789057?text='+encodeURIComponent(lines.join('\n'));
    const status=contactForm.querySelector('[data-contact-status]');
    status.textContent='Revisá y enviá tu consulta en WhatsApp. Si no se abrió, ';
    const link=document.createElement('a');
    link.href=url; link.target='_blank'; link.rel='noopener noreferrer';
    link.textContent='continuá desde este enlace.';
    status.appendChild(link);
    window.open(url,'_blank','noopener,noreferrer');
  });
  contactForm.addEventListener('input',event=>{
    if(typeof event.target.setCustomValidity==='function') event.target.setCustomValidity('');
  });
}
