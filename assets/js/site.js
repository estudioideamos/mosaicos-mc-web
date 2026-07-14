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
const quoteLeadStorageKey = "mosaicosMcQuoteLead";

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

const readStoredJson = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStoredJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage write issues.
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

const initGlobalQuoteDrawer = () => {
  if (document.querySelector("[data-quote-drawer]")) {
    return;
  }

  const shell = document.querySelector(".shell");

  if (!shell) {
    return;
  }

  const rootHref = brandLink?.getAttribute("href") || "./";
  const rootUrl = new URL(rootHref, window.location.href);
  const productsUrl = new URL("productos/", rootUrl).href;

  const drawer = document.createElement("div");
  drawer.className = "quote-drawer";
  drawer.hidden = true;
  drawer.setAttribute("data-quote-drawer", "");
  drawer.innerHTML = `
    <button class="quote-drawer__backdrop" type="button" data-quote-close aria-label="Cerrar panel"></button>
    <aside class="quote-drawer__panel" aria-live="polite" aria-label="Panel de presupuesto">
      <div class="quote-drawer__view" data-quote-view="cart">
        <header class="quote-drawer__header">
          <div>
            <span class="eyebrow eyebrow--dark">presupuesto</span>
            <h3>Carrito <span data-quote-count>(0)</span></h3>
          </div>
          <button class="quote-drawer__close" type="button" data-quote-close aria-label="Cerrar panel">&times;</button>
        </header>
        <div class="quote-drawer__body">
          <div class="quote-drawer__empty" data-quote-empty>
            <h4>Tu carrito de presupuesto está vacío.</h4>
            <p>Podés abrir este panel desde cualquier página para revisar piezas agregadas o comenzar una consulta cuando lo necesites.</p>
            <div class="hero__actions">
              <a class="button button--dark" href="${productsUrl}">Ver productos</a>
            </div>
          </div>
          <div class="quote-drawer__cart-list" data-quote-cart-list></div>
        </div>
        <footer class="quote-drawer__footer">
          <p>Agrega una o varias piezas y envía la consulta completa desde este mismo panel.</p>
          <div class="quote-drawer__footer-actions">
            <button class="button button--sand" type="button" data-quote-clear disabled>Vaciar carrito</button>
            <button class="button button--dark" type="button" data-quote-to-form disabled>Continuar con mis datos</button>
          </div>
        </footer>
      </div>
      <div class="quote-drawer__view" data-quote-view="form" hidden>
        <header class="quote-drawer__header">
          <div>
            <span class="eyebrow eyebrow--dark">datos de contacto</span>
            <h3>Solicitar presupuesto</h3>
          </div>
          <button class="quote-drawer__close" type="button" data-quote-close aria-label="Cerrar panel">&times;</button>
        </header>
        <form class="quote-drawer__form" data-quote-lead-form>
          <div class="quote-drawer__resume" data-quote-form-summary></div>
          <div class="form-grid">
            <div class="form-field">
              <label for="global-quote-name">Nombre completo</label>
              <input id="global-quote-name" name="name" type="text" placeholder="Tu nombre y apellido" data-quote-name required />
            </div>
            <div class="form-field">
              <label for="global-quote-phone">Teléfono</label>
              <input id="global-quote-phone" name="phone" type="tel" placeholder="+54 9 11..." data-quote-phone required />
            </div>
            <div class="form-field">
              <label for="global-quote-email">Email</label>
              <input id="global-quote-email" name="email" type="email" placeholder="tu@email.com" data-quote-email />
            </div>
            <div class="form-field">
              <label for="global-quote-location">Localidad</label>
              <input id="global-quote-location" name="location" type="text" placeholder="Ciudad / Zona" data-quote-location />
            </div>
            <div class="form-field">
              <label for="global-quote-timing">Cuándo lo necesitas</label>
              <select id="global-quote-timing" name="timing" data-quote-timing>
                <option value="">Seleccionar</option>
                <option value="Inmediato">Inmediato</option>
                <option value="Dentro de 30 días">Dentro de 30 días</option>
                <option value="En planificación">En planificación</option>
              </select>
            </div>
            <div class="form-field form-field--full">
              <label for="global-quote-notes">Comentarios del proyecto</label>
              <textarea id="global-quote-notes" name="notes" rows="4" placeholder="Contanos si es vereda, pileta, interior, obra nueva o reposición." data-quote-notes></textarea>
            </div>
          </div>
          <div class="quote-drawer__footer-actions">
            <button class="button button--sand" type="button" data-quote-back>Volver al carrito</button>
            <button class="button button--dark" type="submit">Enviar por WhatsApp</button>
          </div>
        </form>
      </div>
    </aside>
  `;

  document.body.appendChild(drawer);

  const cartView = drawer.querySelector('[data-quote-view="cart"]');
  const formView = drawer.querySelector('[data-quote-view="form"]');
  const cartList = drawer.querySelector("[data-quote-cart-list]");
  const emptyState = drawer.querySelector("[data-quote-empty]");
  const cartFooter = drawer.querySelector(".quote-drawer__footer");
  const countOutput = drawer.querySelector("[data-quote-count]");
  const clearButton = drawer.querySelector("[data-quote-clear]");
  const toFormButton = drawer.querySelector("[data-quote-to-form]");
  const closeButtons = Array.from(drawer.querySelectorAll("[data-quote-close]"));
  const backButton = drawer.querySelector("[data-quote-back]");
  const leadForm = drawer.querySelector("[data-quote-lead-form]");
  const formSummary = drawer.querySelector("[data-quote-form-summary]");
  const nameInput = drawer.querySelector("[data-quote-name]");
  const phoneInput = drawer.querySelector("[data-quote-phone]");
  const emailInput = drawer.querySelector("[data-quote-email]");
  const locationInput = drawer.querySelector("[data-quote-location]");
  const timingInput = drawer.querySelector("[data-quote-timing]");
  const notesInput = drawer.querySelector("[data-quote-notes]");

  if (emptyState) {
    emptyState.innerHTML = `
      <h4>Tu carrito de presupuesto est&aacute; vac&iacute;o.</h4>
      <p>Guard&aacute; las piezas que m&aacute;s te interesen y arm&aacute; tu consulta en un solo lugar para recibir una respuesta comercial r&aacute;pida, clara y personalizada.</p>
      <div class="quote-drawer__empty-actions">
        <a class="button button--dark" href="${productsUrl}">Ver productos</a>
      </div>
    `;
  }

  const cartFooterNote = cartFooter?.querySelector("p");
  if (cartFooterNote) {
    cartFooterNote.innerHTML =
      "Sum&aacute; una o varias piezas y envi&aacute; tu consulta completa desde este mismo panel para avanzar m&aacute;s r&aacute;pido con tu presupuesto.";
  }

  const readCart = () => {
    const value = readStoredJson(quoteCartStorageKey, []);
    return Array.isArray(value) ? value : [];
  };

  const writeCart = (items) => {
    writeStoredJson(quoteCartStorageKey, Array.isArray(items) ? items : []);
    document.dispatchEvent(
      new CustomEvent("mosaicosmc:cart-updated", {
        detail: { items: Array.isArray(items) ? items : [] },
      })
    );
  };

  const readLead = () => {
    const value = readStoredJson(quoteLeadStorageKey, {});
    return value && typeof value === "object" ? value : {};
  };

  const writeLead = (lead) => {
    writeStoredJson(quoteLeadStorageKey, lead && typeof lead === "object" ? lead : {});
  };

  const formatNumber = (value, digits = 2) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }).format(Number.isFinite(value) ? value : 0);

  const formatArea = (value) => `${formatNumber(value, 2)} m²`;

  const renderNoExtrasMarkup = (noteText) => `
    <div class="quote-extras quote-extras--muted">
      <div class="quote-extras__header">
        <strong>Sin adicionales</strong>
      </div>
      <p class="quote-extras__note">${noteText}</p>
    </div>
  `;

  const renderExtrasMarkup = (extras, noteText) => {
    if (!extras?.length) {
      return renderNoExtrasMarkup(noteText);
    }

    return `
      <div class="quote-extras">
        <div class="quote-extras__header">
          <strong>Adicionales sugeridos</strong>
          <span>${extras.length} item${extras.length === 1 ? "" : "s"}</span>
        </div>
        <div class="quote-extras__list">
          ${extras
            .map(
              (extra) => `
                <div class="quote-extras__item">
                  <strong>${extra.name}</strong>
                  <span>${extra.quantityLabel || ""}</span>
                </div>
              `
            )
            .join("")}
        </div>
        <p class="quote-extras__note">${noteText}</p>
      </div>
    `;
  };

  const syncLeadForm = () => {
    const lead = readLead();
    nameInput.value = lead.name || "";
    phoneInput.value = lead.phone || "";
    emailInput.value = lead.email || "";
    locationInput.value = lead.location || "";
    timingInput.value = lead.timing || "";
    notesInput.value = lead.notes || "";
  };

  const openDrawer = (view = "cart") => {
    drawer.hidden = false;
    window.requestAnimationFrame(() => drawer.classList.add("is-open"));
    document.body.classList.add("drawer-open");
    cartView.hidden = view !== "cart";
    formView.hidden = view !== "form";
  };

  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    window.setTimeout(() => {
      if (!drawer.classList.contains("is-open")) {
        drawer.hidden = true;
      }
    }, 260);
  };

  const renderCartItems = () => {
    const cartItems = readCart();
    const hasItems = cartItems.length > 0;

    countOutput.textContent = `(${cartItems.length})`;
    clearButton.disabled = !hasItems;
    toFormButton.disabled = !hasItems;
    emptyState.hidden = hasItems;
    if (cartFooter) {
      cartFooter.hidden = !hasItems;
    }

    cartList.innerHTML = hasItems
      ? cartItems
          .map(
            (item) => `
              <article class="quote-drawer__item" data-quote-item="${item.id}">
                <div class="quote-drawer__item-media">
                  <img src="${item.image || ""}" alt="${item.productName || "Producto"}" />
                </div>
                <div class="quote-drawer__item-copy">
                  <div class="quote-drawer__item-top">
                    <div>
                      <span class="quote-drawer__item-kicker">${item.lineName || "Mosaicos MC"}</span>
                      <h4>${item.productName || "Producto"}</h4>
                      ${item.variantName ? `<p class="quote-drawer__item-variant">Variante: ${item.variantName}</p>` : ""}
                    </div>
                    <button class="quote-drawer__item-remove" type="button" data-quote-remove="${item.id}" aria-label="Quitar producto">&times;</button>
                  </div>
                  <div class="quote-drawer__item-metrics">
                    <span>${formatArea(Number(item.area) || 0)} requeridos</span>
                    <span>${formatArea(Number(item.totalArea) || 0)} con desperdicio</span>
                    <span>${formatNumber(Number(item.units) || 0, 0)} un</span>
                  </div>
                  ${
                    item.includeExtras
                      ? renderExtrasMarkup(item.extras, "Incluye adicionales sugeridos. Los precios se envían al solicitar el presupuesto.")
                      : renderNoExtrasMarkup("Los precios se envían al solicitar el presupuesto.")
                  }
                </div>
              </article>
            `
          )
          .join("")
      : "";

    if (!hasItems) {
      formSummary.innerHTML = `
        <strong>Sin productos cargados</strong>
        <span>Agrega piezas desde Productos para preparar tu consulta.</span>
      `;
      return;
    }

    const totalArea = cartItems.reduce((sum, item) => sum + (Number(item.totalArea) || 0), 0);
    formSummary.innerHTML = `
      <strong>${cartItems.length} producto${cartItems.length === 1 ? "" : "s"} en el pedido</strong>
      <span>${formatArea(totalArea)} totales con desperdicio incluido.</span>
    `;
  };

  closeButtons.forEach((button) => button.addEventListener("click", closeDrawer));

  clearButton.addEventListener("click", () => {
    writeCart([]);
    renderCartItems();
  });

  toFormButton.addEventListener("click", () => {
    syncLeadForm();
    renderCartItems();
    openDrawer("form");
  });

  backButton.addEventListener("click", () => {
    renderCartItems();
    openDrawer("cart");
  });

  cartList.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-quote-remove]");
    if (!removeButton) return;

    const itemId = removeButton.getAttribute("data-quote-remove");
    const nextItems = readCart().filter((item) => item.id !== itemId);
    writeCart(nextItems);
    renderCartItems();
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const cartItems = readCart();

    if (!cartItems.length || !nameInput.value.trim() || !phoneInput.value.trim()) {
      renderCartItems();
      openDrawer("cart");
      return;
    }

    const lead = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      location: locationInput.value.trim(),
      timing: timingInput.value.trim(),
      notes: notesInput.value.trim(),
    };

    writeLead(lead);

    const lines = [
      "Hola Mosaicos MC, quiero solicitar un presupuesto.",
      "",
      `Nombre: ${lead.name}`,
      `Teléfono: ${lead.phone}`,
      lead.email ? `Email: ${lead.email}` : "",
      lead.location ? `Localidad: ${lead.location}` : "",
      lead.timing ? `Necesidad: ${lead.timing}` : "",
      lead.notes ? `Comentarios: ${lead.notes}` : "",
      "",
      "Detalle del pedido:",
    ].filter(Boolean);

    cartItems.forEach((item, index) => {
      lines.push(
        "",
        `${index + 1}. ${item.productName || "Producto"} (${item.lineName || "Mosaicos MC"})`,
        `- m² requeridos: ${formatArea(Number(item.area) || 0)}`,
        `- m² con desperdicio: ${formatArea(Number(item.totalArea) || 0)}`,
        `- Cantidad estimada: ${formatNumber(Number(item.units) || 0, 0)} un`
      );

      if (item.variantName) {
        lines.splice(lines.length - 3, 0, `- Variante: ${item.variantName}`);
      }

      if (item.includeExtras && item.extras?.length) {
        lines.push("- Adicionales:");
        item.extras.forEach((extra) => {
          lines.push(`  • ${extra.name}${extra.quantityLabel ? ` - ${extra.quantityLabel}` : ""}`);
        });
      }
    });

    window.open(`https://wa.me/5491138789057?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noreferrer");
  });

  document.addEventListener("mosaicosmc:open-quote-cart", (event) => {
    event.preventDefault();
    renderCartItems();
    openDrawer("cart");
  });

  document.addEventListener("mosaicosmc:cart-updated", () => {
    renderCartItems();
  });

  window.addEventListener("storage", (event) => {
    if (event.key === quoteCartStorageKey || event.key === quoteLeadStorageKey) {
      renderCartItems();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  renderCartItems();
};

if (document.body.dataset.pageType !== "product") {
  initGlobalQuoteDrawer();
}

const initImageZoom = () => {
  const zoomCards = Array.from(document.querySelectorAll("[data-zoomable-image]")).filter(
    (card) => !card.hasAttribute("data-image-zoom-bound")
  );
  let modal = document.querySelector("[data-image-zoom-modal]");

  if (!zoomCards.length && modal) {
    return;
  }

  if (!modal && !zoomCards.length) {
    return;
  }

  if (!modal) {
    modal = document.createElement("div");
    modal.className = "image-zoom-modal";
    modal.hidden = true;
    modal.setAttribute("data-image-zoom-modal", "");
    modal.innerHTML = `
      <button class="image-zoom-modal__backdrop" type="button" data-image-zoom-close aria-label="Cerrar ampliacion"></button>
      <div class="image-zoom-modal__panel" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
        <button class="image-zoom-modal__close" type="button" data-image-zoom-close aria-label="Cerrar ampliacion">&times;</button>
        <figure class="image-zoom-modal__figure">
          <img src="" alt="" />
          <figcaption class="image-zoom-modal__caption" hidden></figcaption>
        </figure>
      </div>
    `;

    document.body.appendChild(modal);
  }

  const modalImage = modal.querySelector(".image-zoom-modal__figure img");
  const modalCaption = modal.querySelector(".image-zoom-modal__caption");
  const modalCloseButtons = Array.from(modal.querySelectorAll("[data-image-zoom-close]"));
  const modalCloseButton = modal.querySelector(".image-zoom-modal__close");

  const closeModal = () => {
    modal.classList.remove("is-open");
    document.body.classList.remove("image-zoom-open");

    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 240);

    if (modal._lastTrigger) {
      modal._lastTrigger.focus();
    }
  };

  const openModal = (card) => {
    const sourceImage = card.querySelector("img");
    const imageSource = sourceImage?.currentSrc || sourceImage?.src || "";
    const imageAlt = card.getAttribute("data-zoom-alt") || sourceImage?.alt || "";

    if (!imageSource || !modalImage) {
      return;
    }

    modal._lastTrigger = card;
    modalImage.src = imageSource;
    modalImage.alt = imageAlt;

    if (modalCaption) {
      if (imageAlt) {
        modalCaption.textContent = imageAlt;
        modalCaption.hidden = false;
      } else {
        modalCaption.textContent = "";
        modalCaption.hidden = true;
      }
    }

    modal.hidden = false;
    document.body.classList.add("image-zoom-open");

    window.requestAnimationFrame(() => {
      modal.classList.add("is-open");
      modalCloseButton?.focus();
    });
  };

  zoomCards.forEach((card) => {
    const sourceImage = card.querySelector("img");
    const imageAlt = card.getAttribute("data-zoom-alt") || sourceImage?.alt || "Imagen";
    card.setAttribute("data-image-zoom-bound", "true");
    card.setAttribute("aria-label", `${imageAlt}. Abrir imagen ampliada`);

    card.addEventListener("click", () => {
      openModal(card);
    });
  });

  if (!modal.hasAttribute("data-image-zoom-ready")) {
    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    modal.setAttribute("data-image-zoom-ready", "true");
  }
};

window.mosaicosMcInitImageZoom = initImageZoom;
initImageZoom();

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
