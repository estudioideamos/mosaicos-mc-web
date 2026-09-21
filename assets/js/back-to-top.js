(() => {
  const button = document.querySelector(".mc-back-top");
  if (!button) return;
  const update = () => { button.hidden = window.scrollY < 400; };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("pageshow", update);
  button.addEventListener("click", () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.mcScrollTo) window.mcScrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    document.querySelector(".brand")?.focus({ preventScroll: true });
  });
  update();
})();
