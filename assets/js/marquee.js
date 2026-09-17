document.querySelectorAll(".mc-marquee").forEach((marquee) => {
  const button = marquee.querySelector(".mc-marquee__pause");
  button?.addEventListener("click", () => {
    const paused = marquee.classList.toggle("is-paused");
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", paused ? "Reproducir franja animada" : "Pausar franja animada");
    button.querySelector("span").textContent = paused ? "▷" : "Ⅱ";
  });
});
