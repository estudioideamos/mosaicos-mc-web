document.querySelectorAll('.faq-page .faq-item').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  let targetOpen = details.open;
  summary.addEventListener('click', event => {
    event.preventDefault();
    targetOpen = !targetOpen;
    const start = details.getBoundingClientRect().height;
    animation?.cancel();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      details.open = targetOpen;
      return;
    }
    details.open = true;
    const end = targetOpen ? details.scrollHeight + 2 : summary.getBoundingClientRect().height + 2;
    animation = details.animate([{height:start+'px'},{height:end+'px'}],{
      duration:260,easing:'cubic-bezier(.22,1,.36,1)'
    });
    animation.onfinish = () => { details.open = targetOpen; animation = null; };
  });
});
const categoryLinks = [...document.querySelectorAll('.faq-index a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      categoryLinks.forEach(link => {
        if (link.hash === '#'+entry.target.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
  },{rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('.faq-group,.faq-help').forEach(section=>observer.observe(section));
}
