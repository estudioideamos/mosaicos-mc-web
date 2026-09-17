(function () {
  const catalog = window.productCatalog;
  const shell = document.querySelector("[data-product-shell]");

  if (!catalog || !shell) {
    return;
  }

  const body = document.body;
  const pageType = body.dataset.pageType;
  const basePrefix = body.dataset.basePrefix || "../";
  const productsRoot = `${basePrefix}productos/`;
  const contactHref = `${basePrefix}contacto/`;
  const downloadsHref = `${basePrefix}descargas/`;
  const whatsappNumber = "5491138789057";
  const quoteCartStorageKey = "mosaicosMcQuoteCart";
  const quoteLeadStorageKey = "mosaicosMcQuoteLead";

  const lineHref = (lineSlug) => `${productsRoot}${lineSlug}/`;
  const productHref = (lineSlug, productSlug) => `${productsRoot}${lineSlug}/${productSlug}/`;
  const resolveAsset = (src) => {
    if (!src) {
      return src;
    }

    if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) {
      return src;
    }

    if (src.startsWith("@/")) {
      return `${basePrefix}${src.slice(2)}`;
    }

    return `${basePrefix}${src.replace(/^\.?\//, "")}`;
  };
  const resolveHeroAsset = (src) => {
    const resolved = resolveAsset(src);
    try {
      return new URL(resolved, window.location.href).href;
    } catch (_error) {
      return resolved;
    }
  };
  const lines = catalog.lines;
  // Category imagery always shows an environment, independently of product samples.
  const categoryImages = {
    "exterior-pulida": "@/assets/img/generated/exterior-espacio-2026.webp",
    "mosaicos": "@/assets/img/generated/mosaicos-espacio-2026.webp",
  };
  lines.forEach((line) => {
    line.heroImage = categoryImages[line.slug] || line.heroImage;
  });
  // Client-supplied catalog supersedes legacy display data.
  if (window.clientCatalog) {
    lines.forEach(line => {
      const received = window.clientCatalog.products.filter(p => p.line === line.slug);
      if (!received.length) return;
      line.products = received;
      received.forEach(product => {
        product.downloads = [{kicker:"catálogo",title:"Catálogo Mosaicos MC",text:"Productos, formatos, fotografías y códigos disponibles.",meta:["PDF","Edición 2026"],href:basePrefix+"assets/docs/catalogo-mosaicos-mc-2026.pdf",cta:"Descargar catálogo",external:true}];
        if (["mosaico-compacto","mosaico-compacto-30"].includes(product.slug)) product.downloads.push({kicker:"ficha técnica",title:"Mosaicos compactos",text:"Formatos, códigos, espesores y rendimiento.",meta:["PDF","OC300 / OD300"],href:basePrefix+"assets/docs/ficha-tecnica-compactos.pdf",cta:"Descargar ficha",external:true});
        product.downloads.push({kicker:"colocación",title:"Mortero MC y colocación",text:"Documento técnico provisto por Mosaicos MC. Confirmá su aplicación a tu modelo.",meta:["PDF","Documento original"],href:basePrefix+"assets/docs/mortero-mc-colocacion.pdf",cta:"Ver documento",external:true});
      });
    });
  }
  const findLine = (lineSlug) => lines.find((line) => line.slug === lineSlug);
  const findProduct = (line, productSlug) => line?.products.find((product) => product.slug === productSlug);

  const renderLineNav = (activeLineSlug) =>
    `<div class="product-line-nav reveal is-visible">${lines
      .map(
        (line) => `
          <a class="product-line-nav__link" href="${lineHref(line.slug)}"${
            line.slug === activeLineSlug ? ' aria-current="page"' : ""
          }>${line.name}</a>
        `
      )
      .join("")}</div>`;

    const renderLineCards = () =>
      `<div class="line-grid">${lines
        .map((line) => {
          const lineImage = resolveAsset(line.heroImage);
          return `
            <article class="line-card reveal is-visible">
              <a class="line-card__media" href="${lineHref(line.slug)}" aria-label="Ver coleccion ${line.name}">
                <img src="${lineImage}" alt="${line.name}" />
              </a>
              <div class="line-card__body">
                <span class="kicker">línea de producto</span>
                <h3><a class="line-card__title-link" href="${lineHref(line.slug)}">${line.name}</a></h3>
                <p>${line.description}</p>
                <div class="product-meta">
                  ${line.badges
                    .map((badge, index) => `<span class="product-meta__item" style="--meta-icon:${index};">${badge}</span>`)
                    .join("")}
                </div>
                <a class="link-arrow" href="${lineHref(line.slug)}">Ver colecci&oacute;n</a>
              </div>
            </article>
          `;
        })
        .join("")}</div>`;

    const renderProductCards = (line) =>
      `<div class="product-grid">${line.products
        .map(
          (product) => `
            <article class="product-card reveal is-visible">
              <a class="product-card__media" href="${productHref(line.slug, product.slug)}" aria-label="Ver detalle ${product.name}">
                <img src="${resolveAsset(product.image)}" alt="${product.name}" />
              </a>
              <div class="product-card__body">
                <span class="kicker">${line.name}</span>
                <h3><a class="product-card__title-link" href="${productHref(line.slug, product.slug)}">${product.name}</a></h3>
                <p>${product.cardSummary}</p>
                <div class="product-meta">
                  ${product.meta
                    .map((item, index) => `<span class="product-meta__item" style="--meta-icon:${index};">${item}</span>`)
                    .join("")}
                </div>
                <a class="link-arrow" href="${productHref(line.slug, product.slug)}">Ver detalle</a>
              </div>
            </article>
          `
        )
        .join("")}</div>`;

  const getLineApplications = (line) => {
    switch (line.slug) {
      case "exterior-pulida":
        return "veredas, accesos, galerías y expansiones exteriores con circulación intensa";
      case "mosaicos":
        return "interiores, locales, halls y proyectos donde importa la resistencia junto a una terminación cuidada";
      case "atermicos":
        return "bordes de pileta, decks, soláriums y expansiones donde el confort térmico es determinante";
      case "rusticos":
        return "interiores y exteriores con lenguaje mineral, textura protagonista y lectura más artesanal";
      case "bloques-de-hormigon":
        return "veredas, circulaciones, accesos vehiculares y superficies urbanas de alta exigencia";
      default:
        return "proyectos residenciales y comerciales que buscan durabilidad y una presencia material bien resuelta";
    }
  };

  const getInstallationGuidance = (line) => {
    switch (line.slug) {
      case "exterior-pulida":
        return "Requiere una base firme, nivelacion correcta y juntas bien controladas para sostener una lectura pareja en veredas y expansiones exteriores.";
      case "mosaicos":
        return "Conviene definir el sistema de colocación según el soporte, contemplando nivelacion, juntas y terminación final de acuerdo con el tipo de mosaico.";
      case "atermicos":
        return "La colocación debe contemplar pendiente, drenaje y definicion de bordes para resolver correctamente solárium, nariz y encuentros con la pileta.";
      case "rusticos":
        return "Se recomienda revisar juntas, absorción y terminación superficial para conservar el carácter rústico sin perder estabilidad de uso.";
      case "bloques-de-hormigon":
        return "La base y la compactacion son claves para asegurar estabilidad, resistencia al uso y una modulacion consistente en obra.";
      default:
        return "Nuestro equipo puede orientarte en colocación, juntas, base de apoyo y terminación según el uso previsto.";
    }
  };

  const getMaintenanceGuidance = (line) => {
    switch (line.slug) {
      case "exterior-pulida":
        return "Con limpieza periódica y el tratamiento final adecuado, mantiene una presencia uniforme y muy buena respuesta al uso exterior.";
      case "mosaicos":
        return "El mantenimiento depende de la terminación elegida, pero en general se recomienda limpieza regular y cuidado de la superficie para preservar color y lectura.";
      case "atermicos":
        return "Con limpieza frecuente y control de bordes, conserva confort de uso, imagen limpia y buen desempeño en zonas humedas.";
      case "rusticos":
        return "Su textura agradece una limpieza constante y un criterio de proteccion acorde al nivel de exposición y al uso del ambiente.";
      case "bloques-de-hormigon":
        return "Una rutina simple de limpieza y control de juntas ayuda a sostener su rendimiento y su expresión material en el tiempo.";
      default:
        return "Te recomendamos definir el esquema de mantenimiento junto con la especificacion de uso para asegurar mayor durabilidad.";
    }
  };

  const getInquiryHref = (line, product, topic) => {
    const messages = {
      general: `Hola Mosaicos MC, me interesa ${product.name} de la línea ${line.name}. Quisiera asesoramiento para definir la mejor opción para mi proyecto.`,
      ficha: `Hola Mosaicos MC, quiero recibir la ficha técnica de ${product.name} de la línea ${line.name}.`,
      colocación: `Hola Mosaicos MC, quisiera consultar la colocación y aplicación recomendada para ${product.name} de la línea ${line.name}.`,
    };

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messages[topic] || messages.general)}`;
  };

  const buildFaqs = (line, product) =>
    product.faqs || [
      {
        question: `Sirve ${product.name} para el uso previsto en este tipo de proyecto?`,
        answer: `${product.heroSummary} Dentro de la línea ${line.name}, se recomienda especialmente para ${getLineApplications(line)}.`,
      },
      {
        question: "Cuantas unidades necesito por metro cuadrado?",
        answer: `${product.name} trabaja con ${product.meta.slice(0, 3).join(", ")}. Para cotizar con más precisión, conviene contemplar cortes, encuentros y un margen adicional según el tipo de obra.`,
      },
      {
        question: "Como se coloca: con pegamento o con sistema tradicional?",
        answer: getInstallationGuidance(line),
      },
      {
        question: "Cuando se define la junta y que hay que prever en obra?",
        answer:
          "La separación entre piezas, las juntas y los encuentros deben definirse según soporte, modulación y nivel de exposición. Te orientamos en ese criterio para que la colocación se resuelva con mayor precisión desde el inicio.",
      },
      {
        question: "Tiene ficha técnica o respaldo comercial para especificarlo?",
        answer:
          "Sí. Te enviamos la ficha comercial o técnica disponible, revisamos cantidades y confirmamos contigo si esta pieza es la indicada para tu proyecto.",
      },
      {
        question: "Como se mantiene una vez colocado?",
        answer:
          getMaintenanceGuidance(line),
      },
    ];

  const buildDownloads = (line, product) =>
    product.downloads || [
      {
        kicker: "biblioteca",
        title: "Catálogo de la línea",
        text: `Accede rápidamente a la colección ${line.name} para revisar la línea completa y sus productos disponibles.`,
        meta: ["Línea completa", "Online"],
        href: lineHref(line.slug),
        cta: "Ver colección",
      },
      {
        kicker: "ficha técnica",
        title: "Ficha del producto",
        text: `Solicita la ficha comercial y técnica de ${product.name} con medidas, rendimiento y recomendaciones de aplicación.`,
        meta: ["PDF a pedido", "Asistencia comercial"],
        href: getInquiryHref(line, product, "ficha"),
        cta: "Solicitar PDF",
        external: true,
      },
      {
        kicker: "colocación",
        title: "Guía de aplicación",
        text: `Recibe una recomendación clara sobre base, terminación y criterio de colocación para especificar ${product.name} con mayor seguridad.`,
        meta: ["Soporte", "Obra"],
        href: getInquiryHref(line, product, "colocación"),
        cta: "Consultar",
        external: true,
      },
    ];

  const buildTestimonials = (line, product) =>
    product.testimonials || [
      {
        quote:
          "Excelente atenci&oacute;n y calidad. El producto lleg&oacute; impecable y el asesoramiento fue muy claro durante todo el proceso.",
        author: "Sebastian Almeida",
        role: "Empresa constructora",
        avatar: "@/assets/img/testimonials/sebastian-almeida.svg",
      },
      {
        quote:
          "Qued&eacute; muy satisfecho con la compra. Se nota la calidad del material y la atenci&oacute;n fue r&aacute;pida, cordial y profesional.",
        author: "Ricardo Ferreyra",
        role: "Cliente particular",
        avatar: "@/assets/img/testimonials/ricardo-ferreyra.svg",
      },
      {
        quote:
          "Muy buena relaci&oacute;n precio-calidad. Encontramos una soluci&oacute;n s&oacute;lida para la obra y cumplieron muy bien con lo prometido.",
        author: "Carlos Mariano Capisto",
        role: "Estudio de arquitectura",
        avatar: "@/assets/img/testimonials/carlos-capisto.svg",
      },
      {
        quote:
          "Excelente atenci&oacute;n desde la consulta inicial hasta la entrega. El resultado final qued&oacute; prolijo, sobrio y muy bien terminado.",
        author: "Mariana Sosa",
        role: "Desarrolladora inmobiliaria",
        avatar: "@/assets/img/testimonials/mariana-sosa.svg",
      },
      {
        quote:
          "Producto de muy buen nivel y equipo comercial muy resolutivo. Respondieron r&aacute;pido y nos ayudaron a definir la pieza correcta.",
        author: "Federico Alvarez",
        role: "Paisajismo y exteriores",
        avatar: "@/assets/img/testimonials/federico-alvarez.svg",
      },
    ];

  const parseNumericValue = (value) => {
    const normalized = String(value || "").replace(/\s+/g, "").replace(",", ".");
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  };

  const formatNumber = (value, digits = 2) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }).format(value);

  const getUnitsPerSquareMeter = (product) => {
    const sources = [
      ...(product.meta || []),
      ...((product.specs || []).flatMap((spec) => spec)),
    ];

    for (const source of sources) {
      const normalized = normalizeText(source);
      const match =
        normalized.match(/(\d+(?:[.,]\d+)?)\s*un\/m2/) ||
        normalized.match(/(\d+(?:[.,]\d+)?)\s*unidades?\s*por\s*m2/);

      if (match) {
        return Number(match[1].replace(",", "."));
      }
    }

    return 0;
  };

  const readStoredJson = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_error) {
      return fallback;
    }
  };

  const writeStoredJson = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // Ignore storage issues so the quote flow still works.
    }
  };

  const readQuoteCart = () => {
    const items = readStoredJson(quoteCartStorageKey, []);
    return Array.isArray(items) ? items.map(window.mcNormalizeQuoteItem) : [];
  };

  const writeQuoteCart = (items) => {
    writeStoredJson(quoteCartStorageKey, Array.isArray(items) ? items : []);
    document.dispatchEvent(
      new CustomEvent("mosaicosmc:cart-updated", {
        bubbles: true,
        detail: { count: Array.isArray(items) ? items.length : 0 },
      })
    );
  };

  const readQuoteLead = () => {
    const lead = readStoredJson(quoteLeadStorageKey, {});
    return lead && typeof lead === "object" ? lead : {};
  };

  const writeQuoteLead = (lead) => {
    writeStoredJson(quoteLeadStorageKey, lead && typeof lead === "object" ? lead : {});
  };

  const formatSquareMeters = (value) => `${formatNumber(value, 2)} m2`;
  const formatUnits = (value) => `${formatNumber(value, 0)} un`;
  const getCartItemId = (line, product, variantName = "") =>
    `${line.slug}:${product.slug}:${normalizeText(variantName || "base")}`;
  const getSuggestedExtras = (_product, area) => window.mcQuoteMaterials(area);

  const renderSuggestedExtrasMarkup = (items, noteText) => `
    <div class="quote-extras">
      <div class="quote-extras__header">
        <strong>Adicionales</strong>
        <span>Sugeridos para esta consulta</span>
      </div>
      <div class="quote-extras__list">
        ${items
          .map(
            (item) => `
              <div class="quote-extras__item">
                <span>${item.name}</span>
                <strong>${item.quantity}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      <p class="quote-extras__note">${noteText}</p>
    </div>
  `;

  const renderNoExtrasMarkup = (noteText) => `
    <div class="quote-extras quote-extras--muted">
      <div class="quote-extras__header">
        <strong>Sin adicionales</strong>
      </div>
      <p class="quote-extras__note">${noteText}</p>
    </div>
  `;

  const buildQuoteCartItem = (line, product, payload) => ({
    id: getCartItemId(line, product, payload.variantName),
    lineSlug: line.slug,
    productSlug: product.slug,
    lineName: line.name,
    productName: product.name,
    variantName: payload.variantName || "",
    image: resolveAsset(payload.variantImage || product.image || product.detailImage || line.heroImage),
    area: payload.area,
    waste: payload.waste,
    totalArea: payload.totalArea,
    units: payload.units,
    unitsPerM2: payload.unitsPerM2,
    includeExtras: payload.includeExtras,
    extras: payload.includeExtras ? getSuggestedExtras(product, payload.area) : [],
  });

  const renderLegacyQuoteBuilder = (line, product) => {
    const unitsPerM2 = getUnitsPerSquareMeter(product);
    const defaultWaste = 10;

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">presupuesto rapido</span>
          <h2>Solicitar presupuesto</h2>
          <p>Carga los m² del proyecto, define un margen de desperdicio y envianos el pedido directo por WhatsApp con una lectura comercial clara.</p>
        </div>
        <div class="quote-builder reveal is-visible" id="quote-builder">
          <form class="contact-form quote-builder__form" data-quote-form>
            <div class="form-grid">
              <div class="form-field">
                <label for="quote-area">Cantidad requerida (m²)</label>
                <input id="quote-area" name="area" type="number" min="0" step="0.01" placeholder="Ej. 25" data-quote-area required />
              </div>
              <div class="form-field">
                <label for="quote-waste">Desperdicio (%)</label>
                <input id="quote-waste" name="waste" type="number" min="0" step="1" value="${defaultWaste}" data-quote-waste required />
              </div>
              <div class="form-field">
                <label for="quote-name">Nombre</label>
                <input id="quote-name" name="name" type="text" placeholder="Tu nombre" data-quote-name required />
              </div>
              <div class="form-field">
                <label for="quote-phone">Telefono</label>
                <input id="quote-phone" name="phone" type="tel" placeholder="+54 9 11..." data-quote-phone required />
              </div>
              <div class="form-field">
                <label for="quote-email">Email</label>
                <input id="quote-email" name="email" type="email" placeholder="tu@email.com" data-quote-email />
              </div>
              <div class="form-field">
                <label for="quote-location">Localidad</label>
                <input id="quote-location" name="location" type="text" placeholder="Ciudad / Zona" data-quote-location />
              </div>
              <div class="form-field form-field--full">
                <label class="quote-builder__toggle">
                  <input type="checkbox" data-quote-extras checked />
                  <span>Incluir adicionales sugeridos y asesoramiento complementario</span>
                </label>
              </div>
              <div class="form-field form-field--full">
                <label for="quote-notes">Comentarios del proyecto</label>
                <textarea id="quote-notes" name="notes" rows="4" placeholder="Contanos si es vereda, pileta, interior, obra nueva, reposicion, etc." data-quote-notes></textarea>
              </div>
            </div>
            <div class="hero__actions product-detail__actions quote-builder__actions">
              <button class="button button--dark" type="submit">Enviar por WhatsApp</button>
              <a class="button button--sand" href="${contactHref}">Prefiero email</a>
            </div>
          </form>
          <aside class="quote-builder__summary" data-quote-summary>
            <span class="quote-builder__eyebrow">resumen estimado</span>
            <h3>${product.name}</h3>
            <p>Preparamos una vista rápida del pedido para que el equipo comercial reciba contexto útil desde el primer mensaje.</p>
            <div class="quote-builder__metrics">
              <div class="quote-builder__metric">
                <span>M² cargados</span>
                <strong data-quote-area-output>0</strong>
              </div>
              <div class="quote-builder__metric">
                <span>M² con desperdicio</span>
                <strong data-quote-total-output>0</strong>
              </div>
              <div class="quote-builder__metric">
                <span>Rendimiento</span>
                <strong>${unitsPerM2 ? `${formatNumber(unitsPerM2, 2)} un/m²` : "A definir"}</strong>
              </div>
              <div class="quote-builder__metric">
                <span>Cantidad estimada</span>
                <strong data-quote-units-output>${unitsPerM2 ? "0 un" : "Consultar"}</strong>
              </div>
            </div>
            <div class="quote-builder__foot">
              <span data-quote-extras-output>Incluye adicionales sugeridos</span>
              <span>Respuesta comercial por WhatsApp</span>
            </div>
          </aside>
        </div>
      </div>
    `;
  };

  const renderQuoteBuilder = (line, product) => {
    const unitsPerM2 = getUnitsPerSquareMeter(product);
    const defaultWaste = 10;
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    const variantOptions = hasVariants
      ? product.variants
          .map(
            (variant, index) => `
              <option value="${String(index)}">${variant.name}</option>
            `
          )
          .join("")
      : "";

    return `
        <div class="quote-inline quote-inline--embedded reveal is-visible" id="quote-builder">
          <div class="quote-inline__card">
            <div class="form-grid quote-inline__grid">
              ${
                hasVariants
                  ? `
                    <div class="form-field form-field--full">
                      <label for="quote-variant">Color / variante</label>
                      <select id="quote-variant" name="variant" data-quote-variant>
                        ${variantOptions}
                      </select>
                    </div>
                  `
                  : ""
              }
              <div class="form-field">
                <label for="quote-area">Cantidad requerida (m&sup2;)</label>
                <input id="quote-area" name="area" type="number" min="0" step="0.01" placeholder="Ej. 25" data-quote-area required />
              </div>
              <div class="form-field">
                <label for="quote-waste">Desperdicio (%)</label>
                <input id="quote-waste" name="waste" type="number" min="0" step="1" value="${defaultWaste}" data-quote-waste required />
              </div>
              <div class="form-field form-field--full">
                <label class="quote-inline__toggle">
                  <input type="checkbox" data-quote-extras checked />
                  <span>Incluir adicionales sugeridos y asesoramiento complementario</span>
                </label>
              </div>
            </div>
            <div class="quote-inline__summary">
              <div class="quote-inline__summary-pill">
                <span>Resumen</span>
                <strong data-quote-total-output>0 m&sup2;</strong>
              </div>
              <div class="quote-inline__summary-meta">
                <span data-quote-area-output>0 m&sup2; cargados</span>
                <span data-quote-units-output>${unitsPerM2 ? "0 un" : "Consultar"}</span>
              </div>
            </div>
            <div class="hero__actions product-detail__actions quote-inline__actions">
              <button class="button button--dark" type="button" data-add-to-cart>Agregar al carrito</button>
              <button class="button button--sand" type="button" data-open-cart disabled>Ver carrito</button>
            </div>
            <div class="quote-inline__note" data-quote-extras-output></div>
          </div>
        </div>
        <div class="quote-drawer" data-quote-drawer hidden>
          <button class="quote-drawer__backdrop" type="button" data-quote-close aria-label="Cerrar panel"></button>
          <aside class="quote-drawer__panel" aria-live="polite" aria-label="Panel de presupuesto">
            <div class="quote-drawer__view" data-quote-view="cart">
              <header class="quote-drawer__header">
                <div>
                  <span class="eyebrow eyebrow--dark">carrito</span>
                  <h3>Tu selección <span data-quote-count>(0)</span></h3><p class="quote-drawer__intro">El primer paso de tu próximo espacio.</p>
                </div>
                <button class="quote-drawer__close" type="button" data-quote-close aria-label="Cerrar panel">&times;</button>
              </header>
              <div class="quote-drawer__body">
                <div class="quote-drawer__empty" data-quote-empty>
                  ${window.mcEmptyQuoteMarkup(productsRoot)}
                </div>
                <div class="quote-drawer__cart-list" data-quote-cart-list></div>
              </div>
              <footer class="quote-drawer__footer">
                <p>Tu proyecto, bien acompañado. Completá tus datos y te preparamos un presupuesto.</p>
                <div class="quote-drawer__footer-actions">
                  <button class="button button--sand" type="button" data-quote-clear disabled>Vaciar carrito</button>
                  <button class="button button--dark" type="button" data-quote-to-form disabled>Continuar con mis datos</button>
                </div>
              </footer>
            </div>
            <div class="quote-drawer__view" data-quote-view="form" hidden>
              <header class="quote-drawer__header">
                <div>
                  <span class="eyebrow eyebrow--dark">presupuesto</span>
                  <h3>Completa tus datos</h3>
                </div>
                <button class="quote-drawer__close" type="button" data-quote-close aria-label="Cerrar panel">&times;</button>
              </header>
              <form class="quote-drawer__form" data-quote-lead-form>
                <div class="quote-drawer__resume" data-quote-form-summary></div>
                <div class="form-grid">
                  <div class="form-field form-field--full">
                    <label for="quote-name">Nombre completo</label>
                    <input id="quote-name" name="name" type="text" placeholder="Tu nombre y apellido" data-quote-name required />
                  </div>
                  <div class="form-field">
                    <label for="quote-phone">Tel&eacute;fono</label>
                    <input id="quote-phone" name="phone" type="tel" placeholder="+54 9 11..." data-quote-phone required />
                  </div>
                  <div class="form-field">
                    <label for="quote-email">Email</label>
                    <input id="quote-email" name="email" type="email" placeholder="tu@email.com" data-quote-email />
                  </div>
                  <div class="form-field">
                    <label for="quote-location">Localidad</label>
                    <input id="quote-location" name="location" type="text" placeholder="Ciudad / Zona" data-quote-location />
                  </div>
                  <div class="form-field">
                    <label for="quote-timing">Cu&aacute;ndo lo necesitas</label>
                    <select id="quote-timing" name="timing" data-quote-timing>
                      <option value="Lo antes posible">Lo antes posible</option>
                      <option value="En 15 a 30 d&iacute;as">En 15 a 30 d&iacute;as</option>
                      <option value="En m&aacute;s de 30 d&iacute;as">En m&aacute;s de 30 d&iacute;as</option>
                      <option value="Estoy evaluando opciones">Estoy evaluando opciones</option>
                    </select>
                  </div>
                  <div class="form-field form-field--full">
                    <label for="quote-notes">Comentarios del proyecto</label>
                    <textarea id="quote-notes" name="notes" rows="4" placeholder="Contanos si es vereda, pileta, interior, obra nueva o reposici&oacute;n." data-quote-notes></textarea>
                  </div>
                </div>
                <div class="quote-drawer__footer-actions">
                  <button class="button button--sand" type="button" data-quote-back>Volver al carrito</button>
                  <button class="button button--dark" type="submit">Enviar por WhatsApp</button>
                </div>
              </form>
            </div>
          </aside>
        </div>
    `;
  };

  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/²/g, "2")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const getMetaIconType = (value) => {
    const normalized = normalizeText(value);

    if (normalized.includes("cm") || (/\d/.test(normalized) && /\d+\s*x\s*\d+/.test(normalized))) {
      return "dimension";
    }

    if (normalized.includes("kg")) {
      return "weight";
    }

    if (normalized.includes("m2") || normalized.includes("un/")) {
      return "grid";
    }

    if (
      normalized.includes("pulido") ||
      normalized.includes("rustico") ||
      normalized.includes("atermico") ||
      normalized.includes("hormigon") ||
      normalized.includes("bicapa") ||
      normalized.includes("borde")
    ) {
      return "finish";
    }

    if (normalized.includes("interior") || normalized.includes("exterior")) {
      return "setting";
    }

    return "application";
  };

  const renderSpecIcon = (label) => {
    const name = normalizeText(label);
    const drawing = name.includes("peso")
      ? '<g class="spec-icon__motion"><path d="M22 22h20l8 30H14z"/><circle cx="32" cy="16" r="6"/><path d="M25 37h14M28 43h8"/></g>'
      : name.includes("medida")
        ? '<rect x="21" y="20" width="28" height="28" rx="2"/><g class="spec-icon__motion"><path d="M21 11h28m-24-4-4 4 4 4m20-8 4 4-4 4M11 20v28m-4-24 4-4 4 4m-8 20 4 4 4-4"/></g><path d="M30 20v5m10-5v5M21 30h5m-5 10h5"/>'
        : '<rect x="9" y="15" width="46" height="34" rx="5"/><path d="M17 24v16m5-16v16m7-16v16m6-16v16m4-16v16m8-16v16"/><path class="spec-icon__motion" d="M14 54h36"/>';
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + drawing + '</svg>';
  };

  const getSpecIconType = (label) => {
    const normalized = normalizeText(label);

    if (normalized.includes("formato")) {
      return "format";
    }

    if (normalized.includes("rendimiento")) {
      return "performance";
    }

    if (normalized.includes("terminaci")) {
      return "finish";
    }

    if (normalized.includes("medida")) {
      return "dimension";
    }

    if (normalized.includes("peso")) {
      return "weight";
    }

    if (
      normalized.includes("unidades") ||
      normalized.includes("cantidad") ||
      normalized.includes("m2")
    ) {
      return "grid";
    }

    if (normalized.includes("uso")) {
      return "application";
    }

    if (normalized.includes("terminación")) {
      return "finish";
    }

    if (normalized.includes("colocación")) {
      return "layout";
    }

    return "info";
  };

  const getNoteIconType = (title) => {
    const normalized = normalizeText(title);

    if (normalized.includes("aplic")) {
      return "application";
    }

    if (normalized.includes("uso")) {
      return "application";
    }

    if (normalized.includes("variante")) {
      return "finish";
    }

    if (normalized.includes("mantenimiento")) {
      return "care";
    }

    if (normalized.includes("consulta") || normalized.includes("asesoría")) {
      return "chat";
    }

    if (normalized.includes("terminación")) {
      return "finish";
    }

    if (normalized.includes("colocación")) {
      return "layout";
    }

    return "info";
  };

  const renderFaqs = (line, product) => {
    const faqs = buildFaqs(line, product);

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">preguntas frecuentes</span>
          <h2>Preguntas frecuentes</h2>
          <p>Respondemos las consultas clave para ayudarte a elegir, especificar y cotizar la pieza con mayor seguridad.</p>
        </div>
        <div class="faq-list">
          ${faqs
            .map(
              (faq, index) => `
                <details class="faq-item reveal is-visible"${index === 0 ? " open" : ""}>
                  <summary>
                    <span>${faq.question}</span>
                    <span class="faq-item__icon" aria-hidden="true"></span>
                  </summary>
                  <p>${faq.answer}</p>
                </details>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderProductVariants = (product) => {
    if (!product.variants || !product.variants.length) {
      return "";
    }

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">cat&aacute;logo real</span>
          <h2>Versiones disponibles</h2>
          <p>Revisa la pieza en formato de cat&aacute;logo para comparar modelos, colores y terminaciones con una lectura clara y profesional.</p>
        </div>
        <div class="variant-grid">
          ${product.variants
            .map(
              (variant) => `
                <article class="variant-card reveal is-visible">
                  <div class="variant-card__media">
                    <img src="${resolveAsset(variant.image)}" alt="${variant.name}" loading="lazy" />
                  </div>
                  <div class="variant-card__body">
                    <span class="variant-card__eyebrow">variante</span>
                    <h3>${variant.name}</h3>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderDownloads = (line, product) => {
    const downloads = buildDownloads(line, product);

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">descargables</span>
          <h2>Descargables</h2>
          <p>Recursos útiles para acompañar el proceso comercial y técnico de esta pieza.</p>
        </div>
        <div class="download-grid product-download-grid">
          ${downloads
            .map(
              (resource) => `
                <article class="download-card product-download-card reveal is-visible">
                  <span class="download-card__eyebrow">${resource.kicker}</span>
                  <h3>${resource.title}</h3>
                  <p>${resource.text}</p>
                  <div class="download-card__meta">
                    ${resource.meta.map((item) => `<span>${item}</span>`).join("")}
                  </div>
                  <a class="button button--sand" href="${resource.href}"${
                    resource.external ? ' target="_blank" rel="noreferrer"' : ""
                  }>${resource.cta}</a>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderRelatedProducts = (line, products) =>
    products.length
      ? `
        <div class="product-detail-block">
          <div class="section-title reveal is-visible">
            <span class="eyebrow eyebrow--dark">selección</span>
            <h2>Productos relacionados</h2>
            <p>Otras piezas de la misma familia para comparar formatos, lenguaje y aplicaciónes.</p>
          </div>
          <div class="related-carousel" data-related-carousel>
            <div class="related-carousel__viewport">
              <div class="related-carousel__track">
                ${products
              .map(
                (related) => `
                  <article class="product-card reveal is-visible">
                    <a class="product-card__media" href="${productHref(line.slug, related.slug)}" aria-label="Ver detalle ${related.name}">
                      <img src="${resolveAsset(related.image)}" alt="${related.name}" />
                    </a>
                    <div class="product-card__body">
                      <span class="kicker">${line.name}</span>
                      <h3><a class="product-card__title-link" href="${productHref(line.slug, related.slug)}">${related.name}</a></h3>
                      <p>${related.cardSummary}</p>
                      <div class="product-meta">
                        ${related.meta
                          .map((item) => `<span class="product-meta__item" data-icon="${getMetaIconType(item)}">${item}</span>`)
                          .join("")}
                      </div>
                      <a class="link-arrow" href="${productHref(line.slug, related.slug)}">Ver detalle</a>
                    </div>
                  </article>
                `
              )
              .join("")}
              </div>
            </div>
            <div class="related-carousel__controls">
              <button class="related-carousel__button" type="button" data-related-prev aria-label="Anterior">‹</button>
              <button class="related-carousel__button" type="button" data-related-next aria-label="Siguiente">›</button>
            </div>
          </div>
        </div>
      `
      : "";

  const renderProductCta = (line, product) => {
    const ctaImage = resolveHeroAsset(product.environmentImage || line.heroImage);

    return `
      <section class="mc-advice" style="--cta-image: url('${ctaImage}');" aria-labelledby="mc-advice-title">
        <div class="mc-advice__inner">
          <div class="mc-advice__intro">
            <span class="mc-advice__eyebrow"><span aria-hidden="true"></span> Asesoramiento personalizado</span>
            <h2 id="mc-advice-title">Tu proyecto.<br>La mejor <em>base.</em></h2>
            <p>Encontrá la terminación ideal para tu obra. Te acompañamos a elegir <strong>${product.name}</strong> con el formato y la aplicación que necesitás.</p>
            <div class="mc-advice__actions">
              <a class="mc-advice__primary" href="${contactHref}">Hablemos de tu proyecto <span aria-hidden="true">↗</span></a>
              <a class="mc-advice__secondary" href="${getInquiryHref(line, product, "general")}" target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div class="mc-advice__signature" aria-hidden="true"><span>MATERIALES CON IDENTIDAD</span><strong>Mosaicos MC</strong><span>DESDE 1978</span></div>
          <div class="mc-advice__benefits">
            <div><span class="mc-advice__number">01</span><div><h3>Elegí con confianza</h3><p>Formato, terminación y aplicación según el uso de tu espacio.</p></div></div>
            <div><span class="mc-advice__number">02</span><div><h3>Conversemos sobre tu obra</h3><p>Asesoramiento directo de nuestro equipo, de la idea al presupuesto.</p></div></div>
          </div>
        </div>
      </section>
    `;
  };

  const renderTestimonials = (line, product) => {
    const testimonials = buildTestimonials(line, product);

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">testimonios</span>
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Reseñas reales que destacan la calidad del producto, la atención y el acompañamiento comercial.</p>
        </div>
        <div class="related-carousel testimonial-carousel" data-related-carousel>
          <div class="related-carousel__viewport">
            <div class="related-carousel__track">
              ${testimonials
                .map(
                  (testimonial) => `
                    <article class="testimonial-card reveal is-visible">
                      <div class="testimonial-card__rating" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                      <blockquote>${testimonial.quote}</blockquote>
                      <div class="testimonial-card__author-row">
                        <img class="testimonial-card__avatar" src="${resolveAsset(
                          testimonial.avatar || "@/assets/img/testimonials/ricardo-ferreyra.svg"
                        )}" alt="${testimonial.author}" loading="lazy" />
                        <div class="testimonial-card__author-copy">
                          <div class="testimonial-card__author">${testimonial.author}</div>
                          <div class="testimonial-card__role">${testimonial.role}</div>
                        </div>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="related-carousel__controls">
            <button class="related-carousel__button" type="button" data-related-prev aria-label="Anterior">&lsaquo;</button>
            <button class="related-carousel__button" type="button" data-related-next aria-label="Siguiente">&rsaquo;</button>
          </div>
        </div>
      </div>
    `;
  };

  const initLegacyQuoteBuilder = (line, product) => {
    const form = shell.querySelector("[data-quote-form]");

    if (!form) {
      return;
    }

    const areaInput = form.querySelector("[data-quote-area]");
    const wasteInput = form.querySelector("[data-quote-waste]");
    const nameInput = form.querySelector("[data-quote-name]");
    const phoneInput = form.querySelector("[data-quote-phone]");
    const emailInput = form.querySelector("[data-quote-email]");
    const locationInput = form.querySelector("[data-quote-location]");
    const extrasInput = form.querySelector("[data-quote-extras]");
    const notesInput = form.querySelector("[data-quote-notes]");
    const areaOutput = shell.querySelector("[data-quote-area-output]");
    const totalOutput = shell.querySelector("[data-quote-total-output]");
    const unitsOutput = shell.querySelector("[data-quote-units-output]");
    const extrasOutput = shell.querySelector("[data-quote-extras-output]");
    const unitsPerM2 = getUnitsPerSquareMeter(product);

    const compute = () => {
      const area = parseNumericValue(areaInput.value);
      const waste = parseNumericValue(wasteInput.value);
      const totalArea = area > 0 ? area * (1 + waste / 100) : 0;
      const units = unitsPerM2 > 0 ? Math.ceil(totalArea * unitsPerM2) : 0;

      if (areaOutput) {
        areaOutput.textContent = `${formatNumber(area, 2)} m²`;
      }

      if (totalOutput) {
        totalOutput.textContent = `${formatNumber(totalArea, 2)} m²`;
      }

      if (unitsOutput) {
        unitsOutput.textContent = unitsPerM2 > 0 ? `${formatNumber(units, 0)} un` : "Consultar";
      }

      if (extrasOutput) {
        extrasOutput.textContent = extrasInput.checked
          ? "Incluye adicionales sugeridos"
          : "Sin adicionales";
      }

      return { area, waste, totalArea, units };
    };

    [areaInput, wasteInput, extrasInput].forEach((field) => {
      field?.addEventListener("input", compute);
      field?.addEventListener("change", compute);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const { area, waste, totalArea, units } = compute();

      if (!area || !nameInput.value.trim() || !phoneInput.value.trim()) {
        form.reportValidity();
        return;
      }

      const lines = [
        "Hola Mosaicos MC, quiero solicitar presupuesto.",
        "",
        `Producto: ${product.name}`,
        `Linea: ${line.name}`,
        `M² requeridos: ${formatNumber(area, 2)} m²`,
        `Desperdicio: ${formatNumber(waste, 0)}%`,
        `M² calculados: ${formatNumber(totalArea, 2)} m²`,
      ];

      if (unitsPerM2 > 0) {
        lines.push(`Rendimiento estimado: ${formatNumber(unitsPerM2, 2)} un/m²`);
        lines.push(`Cantidad estimada: ${formatNumber(units, 0)} unidades`);
      }

      lines.push(`Incluir adicionales: ${extrasInput.checked ? "Si" : "No"}`);
      lines.push("");
      lines.push(`Nombre: ${nameInput.value.trim()}`);
      lines.push(`Telefono: ${phoneInput.value.trim()}`);

      if (emailInput.value.trim()) {
        lines.push(`Email: ${emailInput.value.trim()}`);
      }

      if (locationInput.value.trim()) {
        lines.push(`Localidad: ${locationInput.value.trim()}`);
      }

      if (notesInput.value.trim()) {
        lines.push(`Comentarios: ${notesInput.value.trim()}`);
      }

      const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(href, "_blank", "noopener");
    });

    compute();
  };

  const initQuoteBuilder = (line, product) => {
    const areaInput = shell.querySelector("[data-quote-area]");
    const wasteInput = shell.querySelector("[data-quote-waste]");
    const extrasInput = shell.querySelector("[data-quote-extras]");
    const variantInput = shell.querySelector("[data-quote-variant]");
    const addToCartButton = shell.querySelector("[data-add-to-cart]");
    const openCartButton = shell.querySelector("[data-open-cart]");
    const drawer = shell.querySelector("[data-quote-drawer]");
    const cartView = drawer?.querySelector('[data-quote-view="cart"]');
    const formView = drawer?.querySelector('[data-quote-view="form"]');
    const cartList = drawer?.querySelector("[data-quote-cart-list]");
    const emptyState = drawer?.querySelector("[data-quote-empty]");
    const countOutput = drawer?.querySelector("[data-quote-count]");
    const clearButton = drawer?.querySelector("[data-quote-clear]");
    const toFormButton = drawer?.querySelector("[data-quote-to-form]");
    const closeButtons = drawer ? Array.from(drawer.querySelectorAll("[data-quote-close]")) : [];
    const backButton = drawer?.querySelector("[data-quote-back]");
    const leadForm = drawer?.querySelector("[data-quote-lead-form]");
    const nameInput = drawer?.querySelector("[data-quote-name]");
    const phoneInput = drawer?.querySelector("[data-quote-phone]");
    const emailInput = drawer?.querySelector("[data-quote-email]");
    const locationInput = drawer?.querySelector("[data-quote-location]");
    const timingInput = drawer?.querySelector("[data-quote-timing]");
    const notesInput = drawer?.querySelector("[data-quote-notes]");
    const formSummary = drawer?.querySelector("[data-quote-form-summary]");
    const areaOutput = shell.querySelector("[data-quote-area-output]");
    const totalOutput = shell.querySelector("[data-quote-total-output]");
    const unitsOutput = shell.querySelector("[data-quote-units-output]");
    const extrasOutput = shell.querySelector("[data-quote-extras-output]");
    const galleryThumbs = Array.from(shell.querySelectorAll("[data-gallery-thumb]"));
    const unitsPerM2 = getUnitsPerSquareMeter(product);
    const getSelectedVariant = () => {
      const variants = Array.isArray(product.variants) ? product.variants : [];
      if (!variants.length) {
        return null;
      }

      const selectedIndex = Number.parseInt(variantInput?.value ?? "0", 10);
      return variants[selectedIndex] || variants[0] || null;
    };

    if (
      !areaInput ||
      !wasteInput ||
      !extrasInput ||
      !addToCartButton ||
      !openCartButton ||
      !drawer ||
      !cartView ||
      !formView ||
      !leadForm
    ) {
      return;
    }

    if (drawer.parentElement !== document.body) {
      document.body.appendChild(drawer);
    }

    const compute = () => {
      const area = parseNumericValue(areaInput.value);
      const waste = parseNumericValue(wasteInput.value);
      const totalArea = area > 0 ? area * (1 + waste / 100) : 0;
      const units = unitsPerM2 > 0 ? Math.ceil(totalArea * unitsPerM2) : 0;

      if (areaOutput) {
        areaOutput.textContent = `${formatSquareMeters(area)} cargados`;
      }

      if (totalOutput) {
        totalOutput.textContent = formatSquareMeters(totalArea);
      }

      if (unitsOutput) {
        unitsOutput.textContent = unitsPerM2 > 0 ? formatUnits(units) : "Consultar";
      }

      if (extrasOutput) {
        extrasOutput.innerHTML = extrasInput.checked
          ? renderSuggestedExtrasMarkup(
              getSuggestedExtras(product, area),
              "Calculados sobre los m² requeridos, sin desperdicio de baldosas. Los precios se envían al solicitar el presupuesto."
            )
          : renderNoExtrasMarkup("Los precios se envian al solicitar el presupuesto.");
      }

      const selectedVariant = getSelectedVariant();

      return {
        area,
        waste,
        totalArea,
        units,
        unitsPerM2,
        includeExtras: extrasInput.checked,
        variantName: selectedVariant?.name || "",
        variantImage: selectedVariant?.image || "",
      };
    };

    const syncVariantGallery = () => {
      if (!galleryThumbs.length) {
        return;
      }

      const selectedVariant = getSelectedVariant();
      const targetImage = selectedVariant?.image ? resolveAsset(selectedVariant.image) : "";
      const targetLabel = selectedVariant?.name || "";
      const matchingThumb =
        galleryThumbs.find((thumb) => targetImage && thumb.dataset.galleryImage === targetImage) ||
        galleryThumbs.find((thumb) => targetLabel && thumb.dataset.galleryLabel === targetLabel) ||
        galleryThumbs[0];

      matchingThumb?.click();
    };

    const openDrawer = (view) => {
      drawer.hidden = false;
      window.requestAnimationFrame(() => drawer.classList.add("is-open"));
      document.body.classList.add("drawer-open");
      if (view === "form") {
        cartView.hidden = true;
        formView.hidden = false;
      } else {
        cartView.hidden = false;
        formView.hidden = true;
      }
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

    const syncLeadForm = () => {
      const lead = readQuoteLead();
      if (nameInput) nameInput.value = lead.name || "";
      if (phoneInput) phoneInput.value = lead.phone || "";
      if (emailInput) emailInput.value = lead.email || "";
      if (locationInput) locationInput.value = lead.location || "";
      if (timingInput && lead.timing) timingInput.value = lead.timing;
      if (notesInput) notesInput.value = lead.notes || "";
    };

    const renderCartItems = () => {
      const cartItems = readQuoteCart();

      openCartButton.disabled = cartItems.length === 0;
      openCartButton.textContent = cartItems.length ? `Ver carrito (${cartItems.length})` : "Ver carrito";

      if (countOutput) {
        countOutput.textContent = `(${cartItems.length})`;
      }

      if (clearButton) {
        clearButton.disabled = cartItems.length === 0;
      }

      if (toFormButton) {
        toFormButton.disabled = cartItems.length === 0;
      }

      if (emptyState) {
        emptyState.hidden = cartItems.length > 0;
        const footer = drawer.querySelector(".quote-drawer__footer");
        if (footer) footer.hidden = cartItems.length === 0;
      }

      if (cartList) {
        cartList.innerHTML = cartItems
          .map(
            (item) => {
              const extras = item.includeExtras
                ? Array.isArray(item.extras) && item.extras.length
                  ? item.extras
                  : getSuggestedExtras(product, item.area)
                : [];

              return `
              <article class="quote-drawer__item" data-quote-item="${item.id}">
                <div class="quote-drawer__item-media">
                  <img src="${item.image}" alt="${item.productName}" loading="lazy" />
                </div>
                <div class="quote-drawer__item-copy">
                  <div class="quote-drawer__item-top">
                    <div>
                      <span class="quote-drawer__item-kicker">${item.lineName}</span>
                      <h4>${item.productName}</h4>
                      ${item.variantName ? `<p class="quote-drawer__item-variant">Variante: ${item.variantName}</p>` : ""}
                    </div>
                    <button class="quote-drawer__item-remove" type="button" data-quote-remove="${item.id}" aria-label="Quitar producto">&times;</button>
                  </div>
                  <div class="quote-drawer__item-metrics">
                    <span>${formatSquareMeters(item.area)} requeridos</span>
                    <span>${formatSquareMeters(item.totalArea)} con desperdicio</span>
                    <span>${item.unitsPerM2 > 0 ? formatUnits(item.units) : "Cantidad a cotizar"}</span>
                  </div>
                  ${
                    item.includeExtras
                      ? renderSuggestedExtrasMarkup(extras, "Incluidos como sugerencia comercial.")
                      : renderNoExtrasMarkup("Sin adicionales sugeridos para este item.")
                  }
                </div>
              </article>
            `;
            }
          )
          .join("");
      }

      if (formSummary) {
        if (!cartItems.length) {
          formSummary.innerHTML = `
            <strong>Sin productos cargados</strong>
            <span>Agrega al menos una pieza antes de solicitar el presupuesto.</span>
          `;
        } else {
          const totalArea = cartItems.reduce((sum, item) => sum + (item.totalArea || 0), 0);
          formSummary.innerHTML = `
            <strong>${cartItems.length} producto${cartItems.length === 1 ? "" : "s"} en el pedido</strong>
            <span>${formatSquareMeters(totalArea)} totales para cotizar.</span>
          `;
        }
      }
    };

    [areaInput, wasteInput, extrasInput, variantInput].forEach((field) => {
      field?.addEventListener("input", compute);
      field?.addEventListener("change", compute);
    });

    // A thumbnail and the quote selector must represent the same variant.
    // Update the value directly: dispatching change here would click it again.
    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        if (!variantInput) return;
        const variants = product.variants || [];
        const index = variants.findIndex(
          (variant) => resolveAsset(variant.image) === thumb.dataset.galleryImage
        );
        if (index < 0) return; // General product views do not select a variant.
        variantInput.value = String(index);
        compute();
      });
    });

    variantInput?.addEventListener("change", syncVariantGallery);
    variantInput?.addEventListener("input", syncVariantGallery);

    addToCartButton.addEventListener("click", () => {
      const snapshot = compute();

      if (!snapshot.area) {
        areaInput.reportValidity();
        areaInput.focus();
        return;
      }

      const cartItems = readQuoteCart();
      const nextItem = buildQuoteCartItem(line, product, snapshot);
      const existingIndex = cartItems.findIndex((item) => item.id === nextItem.id);

      if (existingIndex >= 0) {
        cartItems[existingIndex] = nextItem;
      } else {
        cartItems.push(nextItem);
      }

      writeQuoteCart(cartItems);
      renderCartItems();
      openDrawer("cart");
    });

    openCartButton.addEventListener("click", () => {
      renderCartItems();
      openDrawer("cart");
    });

    document.addEventListener("mosaicosmc:open-quote-cart", (event) => {
      event.preventDefault();
      renderCartItems();
      openDrawer("cart");
    });

    toFormButton?.addEventListener("click", () => {
      syncLeadForm();
      renderCartItems();
      openDrawer("form");
    });

    backButton?.addEventListener("click", () => {
      openDrawer("cart");
    });

    clearButton?.addEventListener("click", () => {
      writeQuoteCart([]);
      renderCartItems();
    });

    cartList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quote-remove]");

      if (!button) {
        return;
      }

      const itemId = button.getAttribute("data-quote-remove");
      const nextItems = readQuoteCart().filter((item) => item.id !== itemId);
      writeQuoteCart(nextItems);
      renderCartItems();
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    leadForm.addEventListener("input", () => {
      writeQuoteLead({
        name: nameInput?.value.trim() || "",
        phone: phoneInput?.value.trim() || "",
        email: emailInput?.value.trim() || "",
        location: locationInput?.value.trim() || "",
        timing: timingInput?.value || "",
        notes: notesInput?.value.trim() || "",
      });
    });

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const cartItems = readQuoteCart();

      if (!cartItems.length || !nameInput.value.trim() || !phoneInput.value.trim()) {
        leadForm.reportValidity();
        return;
      }

      const lines = [
        "Hola Mosaicos MC, quiero solicitar un presupuesto.",
        "",
        "Detalle del pedido:",
      ];

      cartItems.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.productName} | ${item.lineName}`);
        if (item.variantName) {
          lines.push(`   - Variante: ${item.variantName}`);
        }
        lines.push(`   - Requerido: ${formatSquareMeters(item.area)}`);
        lines.push(`   - Desperdicio: ${formatNumber(item.waste, 0)}%`);
        lines.push(`   - Calculado: ${formatSquareMeters(item.totalArea)}`);
        lines.push(
          `   - Cantidad estimada: ${item.unitsPerM2 > 0 ? formatUnits(item.units) : "A cotizar"}`
        );
        lines.push(`   - Adicionales: ${item.includeExtras ? "Si" : "No"}`);

        if (item.includeExtras) {
          const extras = Array.isArray(item.extras) && item.extras.length ? item.extras : getSuggestedExtras(product, item.area);
          extras.forEach((extra) => {
            lines.push(`     * ${extra.name}: ${extra.quantity}`);
          });
        }
      });

      lines.push("");
      lines.push("Datos de contacto:");
      lines.push(`Nombre: ${nameInput.value.trim()}`);
      lines.push(`Telefono: ${phoneInput.value.trim()}`);

      if (emailInput.value.trim()) {
        lines.push(`Email: ${emailInput.value.trim()}`);
      }

      if (locationInput.value.trim()) {
        lines.push(`Localidad: ${locationInput.value.trim()}`);
      }

      if (timingInput.value.trim()) {
        lines.push(`Necesidad: ${timingInput.value.trim()}`);
      }

      if (notesInput.value.trim()) {
        lines.push(`Comentarios: ${notesInput.value.trim()}`);
      }

      const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(href, "_blank", "noopener");
    });

    syncLeadForm();
    renderCartItems();
    compute();
    syncVariantGallery();
  };

  const editorialTitle = (name) => {
    const words = name.trim().split(/\s+/);
    const accent = words.pop();
    return `${words.join(' ')}${words.length ? ' ' : ''}<em>${accent}</em>`;
  };

  const renderCatalogPage = () => {
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${resolveHeroAsset("@/assets/img/generated/catalog-products-hero.png")}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">catálogo</span>
          <h1>Líneas de <em>producto</em></h1>
          <p>Estas son las familias principales de Mosaicos MC. Cada línea abre su propia página con productos y cada pieza lleva a su detalle individual.</p>
        </div>
      </section>

      <section class="section">
        ${renderLineNav("")}
        ${renderLineCards()}
      </section>
    `;
  };

  const renderLinePage = (line) => {
    const lineImage = resolveAsset(line.heroImage);
    const lineHeroImage = resolveHeroAsset(line.heroImage);
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${lineHeroImage}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">línea de producto</span>
          <h1>${editorialTitle(line.name)}</h1>
          <p>${line.description}</p>
        </div>
      </section>

      <section class="section">
        ${renderLineNav(line.slug)}
        <div class="line-intro">
          <article class="split-card split-card--copy reveal is-visible">
            <span class="eyebrow eyebrow--dark">sobre la línea</span>
            <h3>${line.overviewTitle}</h3>
            <p>${line.overviewText}</p>
            <div class="product-meta">
              ${line.badges
                .map((badge, index) => `<span class="product-meta__item" style="--meta-icon:${index};">${badge}</span>`)
                .join("")}
            </div>
          </article>
          <article class="split-card split-card--image reveal is-visible">
            <img src="${lineImage}" alt="${line.name}" />
          </article>
        </div>

        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">productos</span>
          <h2>${line.name}</h2>
          <p>Explora cada producto para ver medidas, variantes, aplicaciones y respaldo comercial.</p>
        </div>
        ${renderProductCards(line)}
      </section>
    `;
  };

  const getProductGalleryImages = (product) => {
    const seen = new Set();
    const items = [];

    const pushItem = (image, label) => {
      if (!image) return;
      const resolved = resolveAsset(image);
      if (seen.has(resolved)) {
        const existing = items.find((item) => item.image === resolved);
        if (label) existing.label = label;
        return;
      }
      seen.add(resolved);
      items.push({
        image: resolved,
        label: label || product.name,
      });
    };

    pushItem(product.detailImage || product.image, product.name);

    (product.variants || []).forEach((variant, index) => {
      pushItem(variant.image, variant.name || `${product.name} ${index + 1}`);
    });

    return items;
  };

  const renderProductGallery = (product) => {
    const galleryImages = getProductGalleryImages(product);
    const primaryImage = galleryImages[0];

    if (!primaryImage) {
      return `
        <button class="product-gallery__frame image-zoom-card" type="button" data-zoomable-image data-zoom-alt="${product.name}">
          <img src="${resolveAsset(product.detailImage || product.image)}" alt="${product.name}" data-gallery-main />
          <span class="image-zoom-trigger" aria-hidden="true">
            <span class="image-zoom-trigger__icon"></span>
            <span class="image-zoom-trigger__text">Ampliar foto</span>
          </span>
        </button>
      `;
    }

    return `
      <div class="product-gallery" data-product-gallery data-product-name="${product.name}">
        <div class="product-gallery__viewer">
          <button class="product-gallery__frame image-zoom-card" type="button" data-zoomable-image data-zoom-alt="${primaryImage.label}">
            <img src="${primaryImage.image}" alt="${primaryImage.label}" data-gallery-main />
            <span class="image-zoom-trigger" aria-hidden="true">
              <span class="image-zoom-trigger__icon"></span>
              <span class="image-zoom-trigger__text">Ampliar foto</span>
            </span>
          </button>
          <div class="product-gallery__caption">
            <strong data-gallery-caption>${primaryImage.label}</strong>
            <span>${galleryImages.length} vista${galleryImages.length === 1 ? "" : "s"} disponible${galleryImages.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        ${
          galleryImages.length > 1
            ? `
              <div class="product-gallery__thumbs" aria-label="Galería de producto">
                ${galleryImages
                  .map(
                    (item, index) => `
                      <button
                        class="product-gallery__thumb${index === 0 ? " is-active" : ""}"
                        type="button"
                        data-gallery-thumb
                        data-gallery-image="${item.image}"
                        data-gallery-label="${item.label}"
                        aria-label="${item.label}"
                        aria-pressed="${index === 0 ? "true" : "false"}"
                      >
                        <img src="${item.image}" alt="${item.label}" loading="lazy" />
                      </button>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
    `;
  };

  const initProductGalleries = () => {
    const galleries = shell.querySelectorAll("[data-product-gallery]");

    galleries.forEach((gallery) => {
      const productName = gallery.dataset.productName || "Producto";
      const mainImage = gallery.querySelector("[data-gallery-main]");
      const caption = gallery.querySelector("[data-gallery-caption]");
      const zoomCard = gallery.querySelector("[data-zoomable-image]");
      const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));

      if (!mainImage || !thumbs.length) {
        return;
      }

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const nextImage = thumb.dataset.galleryImage;
          const nextLabel = thumb.dataset.galleryLabel || "";

          if (nextImage) {
            mainImage.src = nextImage;
            mainImage.alt = nextLabel || productName;
          }

          if (caption) {
            caption.textContent = nextLabel || productName;
          }

          if (zoomCard) {
            zoomCard.setAttribute("data-zoom-alt", nextLabel || productName);
            zoomCard.setAttribute("aria-label", `${nextLabel || productName}. Abrir imagen ampliada`);
          }

          thumbs.forEach((item) => {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
          });

          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");
        });
      });
    });
  };

  const initRelatedCarousels = () => {
    const carousels = shell.querySelectorAll("[data-related-carousel]");

    carousels.forEach((carousel) => {
      const viewport = carousel.querySelector(".related-carousel__viewport");
      const track = carousel.querySelector(".related-carousel__track");
      const prevButton = carousel.querySelector("[data-related-prev]");
      const nextButton = carousel.querySelector("[data-related-next]");

      if (track) {
        const originalCards = Array.from(track.children).filter((card) => card.nodeType === 1);

        // If there are too few cards to move on desktop, clone them so autoplay is still visible.
        if (originalCards.length > 1 && originalCards.length <= 3) {
          while (track.children.length <= 3) {
            originalCards.forEach((card) => {
              track.appendChild(card.cloneNode(true));
            });
          }
        }
      }

      const cards = Array.from(track?.children || []).filter((card) => card.nodeType === 1);

      if (!viewport || !track || cards.length <= 1) {
        if (prevButton) prevButton.disabled = true;
        if (nextButton) nextButton.disabled = true;
        return;
      }

      let currentIndex = 0;
      let intervalId = null;

      const getPerView = () => {
        if (window.innerWidth <= 820) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
      };

      const update = () => {
        const perView = getPerView();
        const maxIndex = Math.max(0, cards.length - perView);
        currentIndex = Math.min(currentIndex, maxIndex);
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 22;
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
        if (prevButton) prevButton.disabled = maxIndex === 0;
        if (nextButton) nextButton.disabled = maxIndex === 0;
      };

      const next = () => {
        const perView = getPerView();
        const maxIndex = Math.max(0, cards.length - perView);
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        update();
      };

      const previous = () => {
        const perView = getPerView();
        const maxIndex = Math.max(0, cards.length - perView);
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        update();
      };

      const stopAuto = () => {
        if (intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };

      const startAuto = () => {
        stopAuto();
        intervalId = window.setInterval(next, 4200);
      };

      prevButton?.addEventListener("click", () => {
        previous();
        startAuto();
      });

      nextButton?.addEventListener("click", () => {
        next();
        startAuto();
      });

      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", startAuto);
      window.addEventListener("resize", update);

      update();
      startAuto();
    });
  };

  const renderProductPage = (line, product) => {
    const relatedProducts = line.products.filter((item) => item.slug !== product.slug);
    const productDetailImage = resolveAsset(product.detailImage || product.image);
    const productHeroImage = resolveHeroAsset(product.environmentImage || product.heroImage || product.detailImage || product.image);
    const formatSuffix = product.name.match(/\s+(\d+\s*[×x]\s*\d+(?:\s*cm)?)$/i);
    const heroName = formatSuffix ? product.name.slice(0, formatSuffix.index) : product.name;
    const heroFormat = formatSuffix ? '<span class="product-hero-format">Formato ' + formatSuffix[1] + ' cm</span>' : '';


    shell.innerHTML = `
      <section class="page-hero page-hero--product" style="--hero-image: url('${productHeroImage}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">${line.name}</span>
          <h1>${editorialTitle(heroName)}</h1>
          ${heroFormat}
          <p>${product.heroSummary}</p>
          <span class="page-hero__caption">${product.environmentCaption || "Ambiente ilustrativo"}</span>
        </div>
      </section>

      <section class="section">
        ${renderLineNav(line.slug)}
        <div class="product-detail-grid">
          <article class="split-card split-card--image split-card--catalog-image product-gallery-card reveal is-visible">
            ${renderProductGallery(product)}
          </article>
          <article class="split-card split-card--copy reveal is-visible">
            <span class="eyebrow eyebrow--dark">detalle de producto</span>
            <h3>${product.name}</h3>
            <p>${product.cardSummary}</p>
            <div class="product-meta">
              ${product.meta
                .map((item) => `<span class="product-meta__item" data-icon="${getMetaIconType(item)}">${item}</span>`)
                .join("")}
            </div>
            <div class="hero__actions product-detail__actions">
              <a class="button button--dark" href="#quote-builder">Pedir presupuesto</a>
              <a class="button button--sand" href="${downloadsHref}">Ver descargas</a>
            </div>
            ${renderQuoteBuilder(line, product)}
          </article>
        </div>

        <div class="spec-grid">
          ${product.specs
            .map(
              (spec) => `
                <article class="spec-card reveal is-visible">
                  <span class="spec-card__icon" data-icon="${getSpecIconType(spec[0])}" aria-hidden="true">${renderSpecIcon(spec[0])}</span>
                  <span class="spec-card__label">${spec[0]}</span>
                  <p>${spec[1]}</p>
                </article>
              `
            )
            .join("")}
        </div>

        ${renderProductVariants(product)}

        ${renderFaqs(line, product)}

        ${renderDownloads(line, product)}

        ${renderRelatedProducts(line, relatedProducts)}



        ${product.testimonials?.length ? renderTestimonials(line, product) : ""}
      </section>
      ${renderProductCta(line, product)}
    `;

    initProductGalleries();
    initRelatedCarousels();
    initQuoteBuilder(line, product);
    window.mosaicosMcInitImageZoom?.();
  };

  if (pageType === "catalog") {
    renderCatalogPage();
    return;
  }

  const line = findLine(body.dataset.lineSlug || "");

  if (!line) {
    shell.innerHTML = `
      <section class="section">
        <div class="split-card split-card--copy reveal is-visible">
          <span class="eyebrow eyebrow--dark">productos</span>
          <h3>No encontramos esta línea.</h3>
          <p>Volvamos al catálogo principal para seguir navegando por las familias disponibles.</p>
          <a class="button button--dark" href="${productsRoot}">Ir a productos</a>
        </div>
      </section>
    `;
    return;
  }

  if (pageType === "line") {
    renderLinePage(line);
    return;
  }

  if (pageType === "product") {
    const product = findProduct(line, body.dataset.productSlug || "");

    if (!product) {
      shell.innerHTML = `
        <section class="section">
          <div class="split-card split-card--copy reveal is-visible">
            <span class="eyebrow eyebrow--dark">${line.name}</span>
            <h3>No encontramos este producto.</h3>
            <p>Te dejo el acceso a la línea completa para que sigas explorando las piezas disponibles.</p>
            <a class="button button--dark" href="${lineHref(line.slug)}">Ver ${line.name}</a>
          </div>
        </section>
      `;
      return;
    }

    renderProductPage(line, product);
  }
  const stickyGallery = document.querySelector('.product-gallery-card');
  if (stickyGallery && 'ResizeObserver' in window) {
    const updateStickyGallery = () => stickyGallery.style.setProperty('--gallery-sticky-top', Math.min(104, innerHeight - stickyGallery.offsetHeight - 20) + 'px');
    new ResizeObserver(updateStickyGallery).observe(stickyGallery);
    window.addEventListener('resize', updateStickyGallery, {passive:true});
    updateStickyGallery();
  }
  if ('IntersectionObserver' in window) {
    const iconObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('spec-icon--visible'); iconObserver.unobserve(entry.target); }
    }), { threshold: .4 });
    document.querySelectorAll('.spec-card__icon').forEach(icon => iconObserver.observe(icon));
  }
})();
