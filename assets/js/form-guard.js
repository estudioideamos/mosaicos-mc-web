// This is a local usability/automation guard, not server-side bot protection.
(() => {
  const selector = '[data-contact-form],[data-quote-lead-form],[data-quote-form]';
  const sent = new WeakMap();
  const prepare = form => {
    if (form.querySelector('[data-form-trap]')) return;
    const trap = document.createElement('div');
    trap.className = 'form-trap';
    trap.setAttribute('aria-hidden', 'true');
    const input = document.createElement('input');
    input.name = 'website_confirmation'; input.type = 'text'; input.tabIndex = -1;
    input.autocomplete = 'off'; input.dataset.formTrap = ''; input.setAttribute('aria-label', 'Dejar vacío');
    trap.append(input); form.append(trap);
  };
  document.querySelectorAll(selector).forEach(prepare);
  document.addEventListener('focusin', event => {
    const form = event.target.closest(selector); if (form) prepare(form);
  });
  document.addEventListener('submit', event => {
    const form = event.target; if (!form.matches(selector)) return;
    prepare(form);
    const block = message => {
      event.preventDefault(); event.stopImmediatePropagation();
      let status = form.querySelector('[data-form-guard-status]');
      if (!status) { status = document.createElement('p'); status.dataset.formGuardStatus = ''; status.setAttribute('role', 'status'); form.append(status); }
      status.textContent = message;
    };
    if (form.querySelector('[data-form-trap]').value) { block('No pudimos preparar la consulta. Volvé a intentarlo.'); return; }
    // Enforce field limits even if a browser extension changed the value.
    for (const field of form.querySelectorAll('input[maxlength],textarea[maxlength]')) {
      if (field.value.length > field.maxLength) { block('Revisá la extensión de los datos ingresados.'); return; }
    }
    if (!form.checkValidity()) return;
    const payload = JSON.stringify([...new FormData(form)]);
    const previous = sent.get(form);
    if (previous && previous.payload === payload && Date.now() - previous.time < 8000) {
      block(form.matches('[data-contact-form]') ? 'Tu consulta se está procesando. Esperá unos segundos antes de reenviarla.' : 'La consulta ya se abrió en WhatsApp. Revisala allí antes de volver a enviarla.'); return;
    }
    sent.set(form, {payload, time: Date.now()});
    const status = form.querySelector('[data-form-guard-status]'); if (status) status.textContent = '';
  }, true);
})();
