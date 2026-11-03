(() => {
  const frames = document.querySelectorAll('iframe[data-map-src]');
  const load = frame => { frame.src = frame.dataset.mapSrc; delete frame.dataset.mapSrc; };
  if (!('IntersectionObserver' in window)) { frames.forEach(load); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); }
  }), {rootMargin:'200px'});
  frames.forEach(frame=>observer.observe(frame));
})();
