window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const syncHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const brandLink = document.querySelector(".brand");
const quoteCartStorageKey = "mosaicosMcQuoteCart";

const readHeaderCartItems = () => {
  try {
    const raw = window.localStorage.getItem(quoteCartStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const syncHeaderCartButton = (button) => {
  if (!button) return;

  const count = readHeaderCartItems().length;
  const countBadge = button.querySelector("[data-cart-count]");

  button.setAttribute("aria-label", count ? `Abrir carrito (${count})` : "Abrir carrito");

  if (countBadge) {
    countBadge.textContent = String(count);
    countBadge.hidden = count === 0;
  }
};

const createHeaderCartButton = () => {
  if (!siteHeader || siteHeader.querySelector("[data-open-header-cart]")) {
    return;
  }

  const actions = siteHeader.querySelector(".site-header__actions");
  const whatsappButton = actions?.querySelector(".site-nav__whatsapp");

  if (!actions || !whatsappButton) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "site-nav__cart";
  button.setAttribute("data-open-header-cart", "");
  button.innerHTML = `
    <span class="site-nav__cart-icon" aria-hidden="true"></span>
    <span class="site-nav__cart-text">Carrito</span>
    <span class="site-nav__cart-count" data-cart-count hidden>0</span>
  `;

  button.addEventListener("click", () => {
    const openEvent = new CustomEvent("mosaicosmc:open-quote-cart", {
      bubbles: true,
      cancelable: true,
      detail: { source: "header" },
    });

    const handled = !document.dispatchEvent(openEvent);

    if (!handled && brandLink?.href) {
      window.location.href = new URL("productos/", brandLink.href).href;
    }
  });

  whatsappButton.insertAdjacentElement("beforebegin", button);
  syncHeaderCartButton(button);

  window.addEventListener("storage", (event) => {
    if (event.key === quoteCartStorageKey) {
      syncHeaderCartButton(button);
    }
  });

  document.addEventListener("mosaicosmc:cart-updated", () => {
    syncHeaderCartButton(button);
  });
};

createHeaderCartButton();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 50}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const homeSlider = document.querySelector("[data-home-slider]");

if (homeSlider) {
  const slides = Array.from(homeSlider.querySelectorAll("[data-slide]"));
  const prevButton = homeSlider.querySelector("[data-slide-prev]");
  const nextButton = homeSlider.querySelector("[data-slide-next]");
  const dotsContainer = homeSlider.querySelector("[data-slide-dots]");
  const progressFill = homeSlider.querySelector("[data-slide-progress]");
  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let autoplayId = 0;

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "home-slider__dot";
    dot.setAttribute("aria-label", `Ir al slide ${index + 1}`);
    dot.addEventListener("click", () => {
      setSlide(index);
      restartAutoplay();
    });
    dotsContainer?.appendChild(dot);
    return dot;
  });

  const setSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
    if (progressFill) {
      progressFill.classList.remove("is-animating");
      void progressFill.offsetWidth;
      progressFill.classList.add("is-animating");
    }
  };

  const nextSlide = () => setSlide(currentIndex + 1);
  const prevSlide = () => setSlide(currentIndex - 1);

  const restartAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(nextSlide, 5500);
  };

  prevButton?.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });

  homeSlider.addEventListener("mouseenter", () => {
    window.clearInterval(autoplayId);
  });

  homeSlider.addEventListener("mouseleave", restartAutoplay);

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      prevSlide();
      restartAutoplay();
    }
    if (event.key === "ArrowRight") {
      nextSlide();
      restartAutoplay();
    }
  });

  setSlide(currentIndex);
  restartAutoplay();
}
