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
  const exteriorPulidaOverride = [
    {
      slug: "64-panes",
      name: "64 Panes",
      kicker: "línea exterior pulida",
      cardSummary:
        "Placa exterior de reticula fina, pensada para veredas, accesos y espacios de alto tránsito con una lectura muy marcada.",
      heroSummary:
        "Una de las piezas más representativas de Exterior pulida, con trama de 64 panes y lenguaje técnico.",
      image:
        "@/assets/img/generated/product-64-panes.png",
      detailImage:
        "@/assets/img/generated/product-64-panes.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Ideal para veredas, entradas y sectores exteriores donde se busca una textura modular bien definida.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen los códigos P64PG200, P64PN201, P64PR202 y P64PBL204.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos cargar después las fotos y códigos definitivos de cada variante dentro de esta misma ficha.",
        },
      ],
    },
    {
      slug: "16-panes",
      name: "16 Panes",
      kicker: "línea exterior pulida",
      cardSummary:
        "Versión de lectura más amplia y despojada, con 16 panes grandes y una presencia visual más serena.",
      heroSummary:
        "Placa de 16 panes para exterior pulido, pensada para quienes buscan una grilla más abierta.",
      image:
        "@/assets/img/generated/product-16-panes.png",
      detailImage:
        "@/assets/img/generated/product-16-panes.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Muy buena opción para galerías, expansiones y superficies exteriores de dibujo más calmo.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen los códigos P16PBL204, P16PG200 y P16PN201.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos sumar luego colores, terminaciónes y fotos aplicadas de cada opción real.",
        },
      ],
    },
    {
      slug: "8-barras",
      name: "8 Barras",
      kicker: "línea exterior pulida",
      cardSummary:
        "Pieza ranurada de lenguaje lineal, ideal para sumar ritmo y una expresión más técnica en superficies exteriores.",
      heroSummary:
        "Producto lineal de Exterior pulida con lectura de barras, muy útil para paños de gran carácter.",
      image:
        "@/assets/img/generated/product-8-barras.png",
      detailImage:
        "@/assets/img/generated/product-8-barras.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Funciona bien en galerías, veredas y sectores donde interesa reforzar un dibujo lineal.",
        },
        {
          title: "Variantes visibles",
          text: "En la referencia figuran los códigos P8BGC y P8BNC, además del modelo gris plomo blanco negro.",
        },
        {
          title: "Consulta comercial",
          text: "Después podemos cargar el detalle exacto de colores y fotos por variante dentro de esta misma página.",
        },
      ],
    },
    {
      slug: "ondas",
      name: "Ondas",
      kicker: "línea exterior pulida",
      cardSummary:
        "Modelo decorativo de trazo ondulado para sumar movimiento sin perder la robustez de la línea exterior.",
      heroSummary:
        "Una pieza expresiva con dibujo de ondas, pensada para proyectos donde la textura es protagonista.",
      image:
        "@/assets/img/generated/product-ondas.png",
      detailImage:
        "@/assets/img/generated/product-ondas.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Colores disponibles",
          text: "Según la referencia: gris claro, gris plomo, blanco negro y rojo.",
        },
        {
          title: "Modelos visibles",
          text: "En la captura se muestran Ondas gris plomo y Ondas gris claro.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos agregar luego una ficha por color si querés desglosar esta pieza en más detalle.",
        },
      ],
    },
    {
      slug: "espiga",
      name: "Espiga",
      kicker: "línea exterior pulida",
      cardSummary:
        "Trama geométrica en espiga para proyectos exteriores con un lenguaje más gráfico y decorativo.",
      heroSummary:
        "Modelo de dibujo espigado para quienes buscan una placa exterior pulida con personalidad propia.",
      image:
        "@/assets/img/generated/product-espiga.png",
      detailImage:
        "@/assets/img/generated/product-espiga.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Ideal para zonas protagonistas donde se busca una trama visible y un dibujo más distintivo.",
        },
        {
          title: "Modelos visibles",
          text: "En la referencia aparecen Espiga gris claro y gris plomo negro.",
        },
        {
          title: "Consulta comercial",
          text: "Podemos completar más adelante con variantes, códigos y fotos aplicadas de obra real.",
        },
      ],
    },
    {
      slug: "1-pan",
      name: "1 Pan",
      kicker: "línea exterior pulida",
      cardSummary:
        "La opción más limpia de la línea, con un solo plano protagonista y una expresión exterior muy sobria.",
      heroSummary:
        "Pieza de lectura lisa y despojada para superficies exteriores que necesitan simpleza y continuidad.",
      image:
        "@/assets/img/generated/product-1-pan.png",
      detailImage:
        "@/assets/img/generated/product-1-pan.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Exterior"],
      specs: [
        ["Peso unitario", "12 Kg aprox. por unidad."],
        ["Peso por m²", "75 Kg aprox."],
        ["Medida", "40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Muy buena base para patios, expansiones y superficies exteriores donde interesa una lectura más limpia.",
        },
        {
          title: "Variantes visibles",
          text: "En la captura se ven Blanco gris claro y Gris claro, además de fotos aplicadas del producto.",
        },
        {
          title: "Consulta comercial",
          text: "Si querés, después armamos una galería propia con las fotos de aplicación reales de esta pieza.",
        },
      ],
    },
  ];
  const mosaicosOverride = [
    {
      slug: "bicapa",
      name: "Bicapa",
      kicker: "línea mosaicos",
      cardSummary:
        "Mosaico bicapa con terminación semi pulida, pensado para terminarse en obra mediante pulidor de pisos.",
      heroSummary:
        "El sistema bicapa aporta dureza y durabilidad, y se completa con pulido final en obra para lograr la terminación deseada.",
      image:
        "@/assets/img/generated/product-bicapa.png",
      detailImage:
        "@/assets/img/generated/product-bicapa.png",
      meta: ["40 x 40 x 3,3 cm", "12 kg aprox.", "75 kg/m²", "6,25 un/m²"],
      specs: [
        ["Terminación", "Semi pulida; normalmente se termina pulido en obra."],
        ["Medida", "40 x 40 x 3,3 cm."],
        ["Peso y rendimiento", "12 kg aprox. por unidad, 75 kg por m² y 6,25 unidades por m²."],
      ],
      notes: [
        {
          title: "Descripcion",
          text: "Es un mosaico ideal para lograr superficies de alta resistencia y buena terminación con lenguaje clásico.",
        },
        {
          title: "Variante visible",
          text: "En la referencia se muestra la variante Gris claro junto a fotos de pieza y aplicación.",
        },
        {
          title: "Consulta comercial",
          text: "Después podemos sumar aca más colores, códigos y fotos reales de obra de esta familia.",
        },
      ],
    },
    {
      slug: "mosaico-compacto",
      name: "Mosaico compacto",
      kicker: "línea mosaicos",
      cardSummary:
        "Revestimiento de terminación pulida terminada, que no necesita ser pulido en obra una vez colocado.",
      heroSummary:
        "Una línea de mosaicos de terminación ya pulida, con gran variedad de colores y dos formatos base según la referencia.",
      image:
        "@/assets/img/generated/product-mosaico-compacto.png",
      detailImage:
        "@/assets/img/generated/product-mosaico-compacto.png",
      meta: ["30 x 30 x 1,8 cm", "43 kg/m²", "11,11 un/m²", "40 x 40 x 2,2 cm"],
      specs: [
        ["Formato 30 x 30", "30 x 30 x 1,8 cm, 43 kg por m² y 11,11 unidades por m²."],
        ["Formato 40 x 40", "40 x 40 x 2,2 cm, 51 kg por m² y 6,25 unidades por m²."],
        ["Terminación", "Pulida terminada; no necesita pulido en obra."],
      ],
      notes: [
        {
          title: "Colores visibles",
          text: "Beige Medano, Blanco con Rosa, Blanco Natural, Blanco Torino, Chiampo Rosa, Gris Bardiglio, Gris Chiampo, Gris Claro, Gris Glaciar, Gris Plomo, Negro Alpes, Rojo Dragon, Rosa Firenze, Sahara y Terra.",
        },
        {
          title: "Galería de referencia",
          text: "La página original muestra muestras de color, una pieza rotulada y dos fotos aplicadas de la línea.",
        },
        {
          title: "Consulta comercial",
          text: "Si querés, la proxima pasada la hacemos con cada color cargado como variante separada dentro de esta misma ficha.",
        },
      ],
    },
  ];
  const atermicosOverride = [
    {
      slug: "para-decks-y-piletas",
      name: "Para decks y piletas",
      kicker: "linea at&eacute;rmicos",
      cardSummary:
        "Sistema at&eacute;rmico concebido para bordes de piscina, decks y sol&aacute;riums, con una presencia serena y un lenguaje t&eacute;cnico alineado a proyectos de alto nivel.",
      heroSummary:
        "Una pieza desarrollada para acompa&ntilde;ar piscinas y expansiones exteriores con confort de uso, imagen limpia y resoluciones consistentes en cada encuentro.",
      image:
        "@/assets/img/generated/product-para-decks-y-piletas.png",
      detailImage:
        "@/assets/img/generated/product-para-decks-y-piletas.png",
      meta: ["50 x 50 x 3 cm", "14 kg aprox.", "4 un/m2", "2 un/ml"],
      specs: [
        ["Medida", "50 x 50 x 3 cm."],
        ["Peso unitario", "14 kg aprox."],
        ["Rendimiento", "4 unidades por m2 y 2 unidades por metro lineal."],
      ],
      notes: [
        {
          title: "Resoluciones disponibles",
          text: "La familia contempla borde con bisel, borde con nariz y piezas para sol&aacute;rium, para resolver la escena completa con continuidad visual.",
        },
        {
          title: "Aplicacion sugerida",
          text: "Ideal para piletas, decks y expansiones donde se busca una superficie amable al paso, visualmente refinada y lista para convivir con el agua.",
        },
        {
          title: "Asesoramiento comercial",
          text: "Podemos ayudarte a definir el mix entre pa&ntilde;os, remates y bordes seg&uacute;n el dise&ntilde;o de la piscina y el recorrido exterior del proyecto.",
        },
      ],
    },
  ];
  const rusticosOverride = [
    {
      slug: "simil-adoquin-rustico",
      name: "Símil adoquín rústico",
      kicker: "línea rústicos",
      cardSummary:
        "Placa calcárea de lectura símil adoquín para interiores y exteriores con una expresión mineral sobria y consistente.",
      heroSummary:
        "Una pieza rustica pensada para proyectos que buscan textura, carácter y una terminación cercana a la piedra natural.",
      image:
        "@/assets/img/generated/product-simil-adoquin-rustico.png",
      detailImage:
        "@/assets/img/generated/product-simil-adoquin-rustico.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Rustico"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m²", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m² en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen una versión gris, una negra y una terracota, además de una foto de pieza en perspectiva.",
        },
        {
          title: "Aplicación",
          text: "Funciona muy bien en patios, galerías, expansiones y sectores donde se busca una textura tipo adoquín con lectura controlada.",
        },
        {
          title: "Terminación sugerida",
          text: "Como en el resto de la línea rustica, se recomienda el encerado luego de la colocación para reforzar el acabado final.",
        },
      ],
    },
    {
      slug: "loseta-lisa-biselada",
      name: "Loseta lisa biselada",
      kicker: "línea rústicos",
      cardSummary:
        "Pieza de lenguaje más limpio dentro de Rusticos, con borde biselado y una lectura versátil para distintos criterios de colocación.",
      heroSummary:
        "Una loseta sobria y técnica que conserva el espíritu mineral de la línea mientras suma una imagen más serena y contemporánea.",
      image:
        "@/assets/img/generated/product-loseta-lisa-biselada.png",
      detailImage:
        "@/assets/img/generated/product-loseta-lisa-biselada.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Biselada"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m²", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m² en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso visible en referencia",
          text: "La página original muestra la pieza lisa, una aplicación en piso y una opción de colocación sobre apoyos o tacos plasticos.",
        },
        {
          title: "Aplicación",
          text: "Es una muy buena opción para terrazas, expansiones y superficies que necesitan una lectura más despejada sin salir de la familia rustica.",
        },
        {
          title: "Terminación sugerida",
          text: "El encerado posterior ayuda a consolidar una terminación más brillante y una presencia visual mejor definida.",
        },
      ],
    },
    {
      slug: "accesibilidad",
      name: "Accesibilidad",
      kicker: "línea rústicos",
      cardSummary:
        "Solucion táctil y de guíado dentro de la línea rustica, pensada para recorridos accesibles con lenguaje técnico y alta legibilidad.",
      heroSummary:
        "Una familia funcional para resolver circulaciones accesibles mediante losetas guía y piezas táctiles de clara lectura.",
      image:
        "@/assets/img/generated/product-accesibilidad.png",
      detailImage:
        "@/assets/img/generated/product-accesibilidad.png",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m²", "Accesibilidad"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m²", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m² en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Piezas visibles",
          text: "La referencia muestra dos resoluciónes concretas: loseta 6 barras guía y loseta táctil.",
        },
        {
          title: "Aplicación",
          text: "Pensado para recorridos peatonales, accesos y sectores donde hace falta reforzar guíado y advertencia táctil dentro del proyecto.",
        },
        {
          title: "Asesoramiento",
          text: "Podemos ayudarte a definir despiece, ubicación y combinación con otras piezas de la línea según el recorrido previsto.",
        },
      ],
    },
  ];
  const bloquesOverride = [
    {
      slug: "adoquin-gris",
      name: "Adoqu&iacute;n Holanda",
      kicker: "linea bloques de hormig&oacute;n",
      cardSummary:
        "Bloque intertrabado de alta prestacion para veredas, patios y circulaciones exigentes, con una lectura urbana limpia y muy buena respuesta al uso.",
      heroSummary:
        "Una soluci&oacute;n robusta para exteriores de alto tr&aacute;nsito, pensada para aportar resistencia, orden visual y continuidad en grandes pa&ntilde;os.",
      image:
        "@/assets/img/generated/product-adoquin-holanda.png",
      detailImage:
        "@/assets/img/generated/product-adoquin-holanda.png",
      meta: ["10 x 20 x 6 cm", "123 kg/m2", "50 un/m2", "Exterior"],
      specs: [
        ["Medida", "10 x 20 x 6 cm."],
        ["Peso por m2", "123 kg aprox."],
        ["Unidades por m2", "50 piezas."],
      ],
      notes: [
        {
          title: "Variantes visibles",
          text: "Disponible en distintas lecturas cromaticas para acompa&ntilde;ar desde patios residenciales hasta circulaciones de perfil mas urbano.",
        },
        {
          title: "Uso sugerido",
          text: "Ideal para accesos, veredas, patios, calles internas y superficies exteriores donde importan la resistencia, la estabilidad y el mantenimiento simple.",
        },
        {
          title: "Asesoramiento comercial",
          text: "Te ayudamos a definir color, cantidad de piezas y tipo de traba segun el uso previsto y la escala real del pa&ntilde;o.",
        },
      ],
    },
    {
      slug: "trama-urbana",
      name: "Bloque de C&eacute;sped",
      kicker: "linea bloques de hormig&oacute;n",
      cardSummary:
        "Pieza drenante para pisos verdes, cocheras y sectores exteriores que necesitan soporte firme, permeabilidad y una imagen tecnica bien resuelta.",
      heroSummary:
        "Una solucion funcional para combinar hormigon y cesped en superficies exteriores con transito controlado, drenaje eficiente y una presencia prolija.",
      image:
        "@/assets/img/generated/product-bloque-cesped.png",
      detailImage:
        "@/assets/img/generated/product-bloque-cesped.png",
      meta: ["40 x 30 x 8 cm", "105 kg/m2", "8 un/m2", "Exterior"],
      specs: [
        ["Medida", "40 x 30 x 8 cm."],
        ["Peso por m2", "105 kg aprox."],
        ["Unidades por m2", "8 piezas."],
      ],
      notes: [
        {
          title: "Uso sugerido",
          text: "Muy util para cocheras, estacionamientos, senderos y superficies exteriores donde el drenaje y el apoyo firme tienen que convivir en una sola pieza.",
        },
        {
          title: "Lectura de proyecto",
          text: "Permite resolver sectores transitables con una presencia mas verde, ordenada y compatible con paisajismo y accesos vehiculares livianos.",
        },
        {
          title: "Asesoramiento comercial",
          text: "Podemos calcular cantidad, base e implantacion segun el tipo de suelo, el drenaje del lote y la intensidad de uso prevista.",
        },
      ],
    },
  ];
  const lines = catalog.lines;
  const exteriorPulidaLine = lines.find((line) => line.slug === "exterior-pulida");
  const mosaicosLine = lines.find((line) => line.slug === "mosaicos");
  const atermicosLine = lines.find((line) => line.slug === "atermicos");
  const rusticosLine = lines.find((line) => line.slug === "rusticos");
  const bloquesLine = lines.find((line) => line.slug === "bloques-de-hormigon");

  if (exteriorPulidaLine) {
    exteriorPulidaLine.products = exteriorPulidaOverride;
  }

  if (mosaicosLine) {
    mosaicosLine.products = mosaicosOverride;
  }

  if (atermicosLine) {
    atermicosLine.products = atermicosOverride;
  }

  if (rusticosLine) {
    rusticosLine.products = rusticosOverride;
  }

  if (bloquesLine) {
    bloquesLine.products = bloquesOverride;
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
                  <span class="product-meta__item" style="--meta-icon:4;">${line.products.length} productos</span>
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
              <a class="product-card__media" href="${productHref(line.slug, product.slug)}" aria-label="Ver detalle ${product.name}">
                <img src="${resolveAsset(product.image)}" alt="${product.name}" />
              </a>
              <div class="product-card__body">
                <span class="kicker">${product.kicker}</span>
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
      general: `Hola Mosaicos MC, me interesa ${product.name} de la línea ${line.name}. Quisiera recibir asesoramiento para mi proyecto.`,
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
          "La separación entre piezas, las juntas y los encuentros deben definirse según soporte, modulado y exposición. Podemos orientarte en ese criterio junto con la colocación recomendada para evitar improvisaciones en obra.",
      },
      {
        question: "Tiene ficha técnica o respaldo comercial para especificarlo?",
        answer:
          "Si. Podemos enviarte la ficha comercial o técnica disponible, revisar cantidades, aplicaciónes y ayudarte a validar si esta pieza es la indicada para tu proyecto.",
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
        text: `Acceso rapido a la coleccion ${line.name} para revisar el lenguaje de la línea y sus productos disponibles.`,
        meta: ["Línea completa", "Online"],
        href: lineHref(line.slug),
        cta: "Ver coleccion",
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
        text: `Te ayudamos a validar base, terminación y criterio de colocación según el uso previsto para ${product.name}.`,
        meta: ["Soporte", "Obra"],
        href: getInquiryHref(line, product, "colocación"),
        cta: "Consultar",
        external: true,
      },
    ];

  const buildTestimonials = (line, product) =>
    product.testimonials || [
      {
        quote: "Excelente atención y calidad. Precios acorde a la mercaderia.",
        author: "Sebastian Almeida",
        role: "Resena 5 estrellas en Google",
      },
      {
        quote: "La verdad que quede muy satisfecho.",
        author: "ricardo",
        role: "Resena 5 estrellas en Google",
      },
      {
        quote: "Muy buena relación precio calidad.",
        author: "Carlos Mariano Capisto",
        role: "Resena 5 estrellas en Google",
      },
    ];

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

  const getSpecIconType = (label) => {
    const normalized = normalizeText(label);

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
          <p>Respuestas claras para especificar mejor la pieza, anticipar su aplicación y resolver consultas habituales.</p>
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
                      <span class="kicker">${related.kicker}</span>
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

  const renderProductCta = (line, product) => `
    <div class="cta-strip product-cta reveal is-visible">
      <span class="eyebrow eyebrow--dark">asesoramiento</span>
      <h3>Te ayudamos a especificar ${product.name}</h3>
      <p>Si estas definiendo cantidades, aplicación o terminación, armamos una recomendacion alineada con tu proyecto y con la línea ${line.name}.</p>
      <div class="cta-strip__actions">
        <a class="button button--dark" href="${contactHref}">Contactarme</a>
        <a class="button button--sand" href="${getInquiryHref(line, product, "general")}" target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
      </div>
    </div>
  `;

  const renderTestimonials = (line, product) => {
    const testimonials = buildTestimonials(line, product);

    return `
      <div class="product-detail-block">
        <div class="section-title reveal is-visible">
          <span class="eyebrow eyebrow--dark">testimonios</span>
          <h2>Reseñas destacadas</h2>
          <p>Mensajes reales de clientes que destacan atención, calidad y relación precio-calidad.</p>
        </div>
        <div class="testimonial-grid">
          ${testimonials
            .map(
              (testimonial) => `
                <article class="testimonial-card reveal is-visible">
                  <div class="testimonial-card__rating" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <blockquote>${testimonial.quote}</blockquote>
                  <div class="testimonial-card__author">${testimonial.author}</div>
                  <div class="testimonial-card__role">${testimonial.role}</div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderCatalogPage = () => {
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${resolveHeroAsset("@/assets/img/generated/catalog-products-hero.png")}');">
        <div class="page-hero__inner reveal is-visible">
          <span class="eyebrow">catálogo</span>
          <h1>Líneas de producto</h1>
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
          <h1>${line.name}</h1>
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
          <p>Selecciona una pieza para ver su ficha, aplicaciónes y recomendaciones de uso.</p>
        </div>
        ${renderProductCards(line)}
      </section>
    `;
  };

  const initRelatedCarousels = () => {
    const carousels = shell.querySelectorAll("[data-related-carousel]");

    carousels.forEach((carousel) => {
      const viewport = carousel.querySelector(".related-carousel__viewport");
      const track = carousel.querySelector(".related-carousel__track");
      const cards = Array.from(carousel.querySelectorAll(".product-card"));
      const prevButton = carousel.querySelector("[data-related-prev]");
      const nextButton = carousel.querySelector("[data-related-next]");

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
    const productDetailImage = resolveAsset(product.detailImage);
    const productHeroImage = resolveHeroAsset(product.detailImage);

    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${productHeroImage}');">
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
            <img src="${productDetailImage}" alt="${product.name}" />
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
                  <span class="spec-card__icon" data-icon="${getSpecIconType(spec[0])}" aria-hidden="true"></span>
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
                  <span class="detail-note__icon" data-icon="${getNoteIconType(note.title)}" aria-hidden="true"></span>
                  <h3>${note.title}</h3>
                  <p>${note.text}</p>
                </article>
              `
            )
            .join("")}
        </div>

        ${renderFaqs(line, product)}

        ${renderDownloads(line, product)}

        ${renderRelatedProducts(line, relatedProducts)}

        ${renderProductCta(line, product)}

        ${renderTestimonials(line, product)}
      </section>
    `;

    initRelatedCarousels();
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
})();
