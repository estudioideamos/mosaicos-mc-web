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

  const lineHref = (lineSlug) => `${productsRoot}${lineSlug}/`;
  const productHref = (lineSlug, productSlug) => `${productsRoot}${lineSlug}/${productSlug}/`;
  const exteriorPulidaOverride = [
    {
      slug: "64-panes",
      name: "64 Panes",
      kicker: "linea exterior pulida",
      cardSummary:
        "Placa exterior de reticula fina, pensada para veredas, accesos y espacios de alto transito con una lectura muy marcada.",
      heroSummary:
        "Una de las piezas mas representativas de Exterior pulida, con trama de 64 panes y lenguaje bien tecnico.",
      image:
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Ideal para veredas, entradas y sectores exteriores donde se busca una textura modular bien definida.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen los codigos P64PG200, P64PN201, P64PR202 y P64PBL204.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos cargar despues las fotos y codigos definitivos de cada variante dentro de esta misma ficha.",
        },
      ],
    },
    {
      slug: "16-panes",
      name: "16 Panes",
      kicker: "linea exterior pulida",
      cardSummary:
        "Version de lectura mas amplia y despojada, con 16 panes grandes y una presencia visual mas serena.",
      heroSummary:
        "Placa de 16 panes para exterior pulido, pensada para quienes buscan una grilla mas abierta.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Muy buena opcion para galerias, expansiones y superficies exteriores de dibujo mas calmo.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen los codigos P16PBL204, P16PG200 y P16PN201.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos sumar luego colores, terminaciones y fotos aplicadas de cada opcion real.",
        },
      ],
    },
    {
      slug: "8-barras",
      name: "8 Barras",
      kicker: "linea exterior pulida",
      cardSummary:
        "Pieza ranurada de lenguaje lineal, ideal para sumar ritmo y una expresion mas tecnica en superficies exteriores.",
      heroSummary:
        "Producto lineal de Exterior pulida con lectura de barras, muy util para panos de gran caracter.",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Funciona bien en galerias, veredas y sectores donde interesa reforzar un dibujo lineal.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia figuran los codigos P8BGC y P8BNC, ademas del modelo gris plomo blanco negro.",
        },
        {
          title: "Consulta comercial",
          text: "Despues podemos cargar el detalle exacto de colores y fotos por variante dentro de esta misma pagina.",
        },
      ],
    },
    {
      slug: "ondas",
      name: "Ondas",
      kicker: "linea exterior pulida",
      cardSummary:
        "Modelo decorativo de trazo ondulado para sumar movimiento sin perder la robustez de la linea exterior.",
      heroSummary:
        "Una pieza expresiva con dibujo de ondas, pensada para proyectos donde la textura es protagonista.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Colores disponibles",
          text: "Segun la referencia: gris claro, gris plomo, blanco negro y rojo.",
        },
        {
          title: "Modelos visibles",
          text: "En la captura se muestran Ondas gris plomo y Ondas gris claro.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos agregar luego una ficha por color si queres desglosar esta pieza en mas detalle.",
        },
      ],
    },
    {
      slug: "espiga",
      name: "Espiga",
      kicker: "linea exterior pulida",
      cardSummary:
        "Trama geometrica en espiga para proyectos exteriores con un lenguaje mas grafico y decorativo.",
      heroSummary:
        "Modelo de dibujo espigado para quienes buscan una placa exterior pulida con personalidad propia.",
      image:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Ideal para zonas protagonistas donde se busca una trama visible y un dibujo mas distintivo.",
        },
        {
          title: "Modelos visibles",
          text: "En la referencia aparecen Espiga gris claro y Gris plomo negro.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos completar mas adelante con variantes, codigos y fotos aplicadas de obra real.",
        },
      ],
    },
    {
      slug: "1-pan",
      name: "1 Pan",
      kicker: "linea exterior pulida",
      cardSummary:
        "La opcion mas limpia de la linea, con un solo plano protagonista y una expresion exterior muy sobria.",
      heroSummary:
        "Pieza de lectura lisa y despojada para superficies exteriores que necesitan simpleza y continuidad.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m2", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Muy buena base para patios, expansiones y superficies exteriores donde interesa una lectura mas limpia.",
        },
        {
          title: "Variantes visibles",
          text: "En la captura se ven Blanco gris claro y Gris claro, ademas de fotos aplicadas del producto.",
        },
        {
          title: "Consulta comercial",
          text: "Si queres, despues armamos una galeria propia con las fotos de aplicacion reales de esta pieza.",
        },
      ],
    },
  ];
  const lines = catalog.lines;
  const exteriorPulidaLine = lines.find((line) => line.slug === "exterior-pulida");

  if (exteriorPulidaLine) {
    exteriorPulidaLine.products = exteriorPulidaOverride;
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
        const featured = line.products[0];
        return `
          <article class="line-card reveal is-visible">
            <img src="${line.heroImage}" alt="${line.name}" />
            <div class="line-card__body">
              <span class="kicker">linea de producto</span>
              <h3>${line.name}</h3>
              <p>${line.description}</p>
              <div class="product-meta">
                ${line.badges.map((badge) => `<span>${badge}</span>`).join("")}
                <span>${line.products.length} productos</span>
              </div>
              <a class="link-arrow" href="${lineHref(line.slug)}">Ver Coleccion</a>
              ${
                featured
                  ? `<a class="line-card__secondary" href="${productHref(line.slug, featured.slug)}">Producto destacado: ${featured.name}</a>`
                  : ""
              }
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
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-card__body">
              <span class="kicker">${product.kicker}</span>
              <h3>${product.name}</h3>
              <p>${product.cardSummary}</p>
              <div class="product-meta">
                ${product.meta.map((item) => `<span>${item}</span>`).join("")}
              </div>
              <a class="link-arrow" href="${productHref(line.slug, product.slug)}">Ver detalle</a>
            </div>
          </article>
        `
      )
      .join("")}</div>`;

  const renderCatalogPage = () => {
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">catalogo</span>
          <h1>Lineas de producto</h1>
          <p>Estas son las familias principales de Mosaicos MC. Cada linea abre su propia pagina con productos y cada pieza lleva a su detalle individual.</p>
        </div>
      </section>

      <section class="section">
        ${renderLineNav("")}
        ${renderLineCards()}
      </section>
    `;
  };

  const renderLinePage = (line) => {
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${line.heroImage}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">linea de producto</span>
          <h1>${line.name}</h1>
          <p>${line.description}</p>
        </div>
      </section>

      <section class="section">
        ${renderLineNav(line.slug)}
        <div class="line-intro">
          <article class="split-card split-card--copy reveal is-visible">
            <span class="eyebrow eyebrow--dark">sobre la linea</span>
            <h3>${line.overviewTitle}</h3>
            <p>${line.overviewText}</p>
            <div class="product-meta">
              ${line.badges.map((badge) => `<span>${badge}</span>`).join("")}
            </div>
          </article>
          <article class="split-card split-card--image reveal is-visible">
            <img src="${line.heroImage}" alt="${line.name}" />
          </article>
        </div>

        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">productos</span>
          <h2>${line.name}</h2>
          <p>Selecciona una pieza para ver su ficha, aplicaciones y recomendaciones de uso.</p>
        </div>
        ${renderProductCards(line)}
      </section>
    `;
  };

  const renderProductPage = (line, product) => {
    const relatedProducts = line.products.filter((item) => item.slug !== product.slug);

    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${product.detailImage}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">${line.name}</span>
          <h1>${product.name}</h1>
          <p>${product.heroSummary}</p>
        </div>
      </section>

      <section class="section">
        ${renderLineNav(line.slug)}
        <div class="product-detail-grid">
          <article class="split-card split-card--image reveal is-visible">
            <img src="${product.detailImage}" alt="${product.name}" />
          </article>
          <article class="split-card split-card--copy reveal is-visible">
            <span class="eyebrow eyebrow--dark">detalle de producto</span>
            <h3>${product.name}</h3>
            <p>${product.cardSummary}</p>
            <div class="product-meta">
              ${product.meta.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <div class="hero__actions product-detail__actions">
              <a class="button button--dark" href="${contactHref}">Pedir presupuesto</a>
              <a class="button button--sand" href="${downloadsHref}">Ver descargas</a>
            </div>
          </article>
        </div>

        <div class="spec-grid">
          ${product.specs
            .map(
              (spec) => `
                <article class="spec-card reveal is-visible">
                  <span class="spec-card__label">${spec[0]}</span>
                  <p>${spec[1]}</p>
                </article>
              `
            )
            .join("")}
        </div>

        <div class="detail-notes">
          ${product.notes
            .map(
              (note) => `
                <article class="detail-note reveal is-visible">
                  <h3>${note.title}</h3>
                  <p>${note.text}</p>
                </article>
              `
            )
            .join("")}
        </div>

        ${
          relatedProducts.length
            ? `
              <div class="section-title reveal is-visible">
                <span class="eyebrow eyebrow--dark">misma linea</span>
                <h2>Otros productos de ${line.name}</h2>
                <p>Si queres seguir explorando, aca tenes otras piezas de la misma familia.</p>
              </div>
              <div class="product-grid">
                ${relatedProducts
                  .map(
                    (related) => `
                      <article class="product-card reveal is-visible">
                        <img src="${related.image}" alt="${related.name}" />
                        <div class="product-card__body">
                          <span class="kicker">${related.kicker}</span>
                          <h3>${related.name}</h3>
                          <p>${related.cardSummary}</p>
                          <div class="product-meta">
                            ${related.meta.map((item) => `<span>${item}</span>`).join("")}
                          </div>
                          <a class="link-arrow" href="${productHref(line.slug, related.slug)}">Ver detalle</a>
                        </div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </section>
    `;
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
          <h3>No encontramos esta linea.</h3>
          <p>Volvamos al catalogo principal para seguir navegando por las familias disponibles.</p>
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
            <p>Te dejo el acceso a la linea completa para que sigas explorando las piezas disponibles.</p>
            <a class="button button--dark" href="${lineHref(line.slug)}">Ver ${line.name}</a>
          </div>
        </section>
      `;
      return;
    }

    renderProductPage(line, product);
  }
})();
