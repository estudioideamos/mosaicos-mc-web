(() => {
  const video = document.querySelector('[data-factory-film]');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, userPaused = false, automaticPause = false;
  const play = () => { if (visible && !document.hidden && !reduced.matches && !userPaused) video.play().catch(() => {}); };
  const pause = () => { if (!video.paused) { automaticPause = true; video.pause(); } };
  video.addEventListener('pause', () => { if (automaticPause) automaticPause = false; else userPaused = true; });
  video.addEventListener('play', () => { userPaused = false; });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) play(); else pause(); }, {threshold:.2}).observe(video);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else play(); });
  reduced.addEventListener('change', () => { if (reduced.matches) pause(); else play(); });
})();
