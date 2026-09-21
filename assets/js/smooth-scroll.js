(() => {
  if (!window.Lenis) return;
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  let engine;
  const reset = () => engine?.reset();
  const modalOpen = () => document.body.classList.contains('drawer-open') ||
    document.documentElement.classList.contains('mc-mobile-menu-open') || document.querySelector('dialog[open]');
  const configure = () => {
    engine?.destroy();
    engine = undefined;
    if (!motion.matches) return;
    engine = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: .055,
      wheelMultiplier: .6,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: node => node.matches('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[data-native-scroll]'),
      virtualScroll: ({event, deltaX, deltaY}) => {
        if (modalOpen() || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
            (event.type === 'wheel' && Math.abs(deltaX) > Math.abs(deltaY))) {
          reset();
          return false;
        }
      }
    });
  };
  window.mcScrollTo = target => {
    if (engine && !modalOpen()) engine.scrollTo(target);
    else window.scrollTo({top: typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY, behavior: 'instant'});
  };
  // Navigation, dragging the scrollbar, and keyboard actions supersede wheel inertia.
  window.addEventListener('pointerdown', reset, {capture: true, passive: true});
  window.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Tab','Escape'].includes(event.key)) reset();
  }, {capture: true});
  document.addEventListener('visibilitychange', reset);
  new MutationObserver(() => { if (modalOpen()) reset(); }).observe(document.body, {attributes:true, attributeFilter:['class']});
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!engine || event.defaultPrevented || !link || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || modalOpen()) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', url.hash);
    const offset = -(document.querySelector('.site-header')?.offsetHeight || 0) - 20;
    engine.scrollTo(id === 'top' ? 0 : target, {offset: id === 'top' ? 0 : offset});
  });
  motion.addEventListener('change', configure);
  configure();
})();
