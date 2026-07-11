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
  const mosaicosOverride = [
    {
      slug: "bicapa",
      name: "Bicapa",
      kicker: "linea mosaicos",
      cardSummary:
        "Mosaico bicapa con terminacion semi pulida, pensado para terminarse en obra mediante pulidor de pisos.",
      heroSummary:
        "El sistema bicapa aporta dureza y durabilidad, y se completa con pulido final en obra para lograr la terminacion deseada.",
      image:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/bicapa1.jpg",
      detailImage:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/bicapa3.jpg",
      meta: ["40 x 40 x 3,3 cm", "12 kg aprox.", "75 kg/m2", "6,25 un/m2"],
      specs: [
        ["Terminacion", "Semi pulida; normalmente se termina pulido en obra."],
        ["Medida", "40 x 40 x 3,3 cm."],
        ["Peso y rendimiento", "12 kg aprox. por unidad, 75 kg por m2 y 6,25 unidades por m2."],
      ],
      notes: [
        {
          title: "Descripcion",
          text: "Es un mosaico ideal para lograr superficies de alta resistencia y buena terminacion con lenguaje clasico.",
        },
        {
          title: "Variante visible",
          text: "En la referencia se muestra la variante Gris claro junto a fotos de pieza y aplicacion.",
        },
        {
          title: "Consulta comercial",
          text: "Despues podemos sumar aca mas colores, codigos y fotos reales de obra de esta familia.",
        },
      ],
    },
    {
      slug: "mosaico-compacto",
      name: "Mosaico compacto",
      kicker: "linea mosaicos",
      cardSummary:
        "Revestimiento de terminacion pulida terminada, que no necesita ser pulido en obra una vez colocado.",
      heroSummary:
        "Una linea de mosaicos de terminacion ya pulida, con gran variedad de colores y dos formatos base segun la referencia.",
      image:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/compacto1.jpg",
      detailImage:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/compacto18.jpg",
      meta: ["30 x 30 x 1,8 cm", "43 kg/m2", "11,11 un/m2", "40 x 40 x 2,2 cm"],
      specs: [
        ["Formato 30 x 30", "30 x 30 x 1,8 cm, 43 kg por m2 y 11,11 unidades por m2."],
        ["Formato 40 x 40", "40 x 40 x 2,2 cm, 51 kg por m2 y 6,25 unidades por m2."],
        ["Terminacion", "Pulida terminada; no necesita pulido en obra."],
      ],
      notes: [
        {
          title: "Colores visibles",
          text: "Beige Medano, Blanco con Rosa, Blanco Natural, Blanco Torino, Chiampo Rosa, Gris Bardiglio, Gris Chiampo, Gris Claro, Gris Glaciar, Gris Plomo, Negro Alpes, Rojo Dragon, Rosa Firenze, Sahara y Terra.",
        },
        {
          title: "Galeria de referencia",
          text: "La pagina original muestra muestras de color, una pieza rotulada y dos fotos aplicadas de la linea.",
        },
        {
          title: "Consulta comercial",
          text: "Si queres, la proxima pasada la hacemos con cada color cargado como variante separada dentro de esta misma ficha.",
        },
      ],
    },
  ];
  const atermicosOverride = [
    {
      slug: "para-decks-y-piletas",
      name: "Para decks y piletas",
      kicker: "linea atermicos",
      cardSummary:
        "Sistema atermico pensado para decks y piletas, con resoluciones de borde y solarium para acompanar el conjunto completo.",
      heroSummary:
        "Producto desarrollado para zonas de piscina y expansiones exteriores, con variantes de borde y panos de solarium.",
      image:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/ater1.jpg",
      detailImage:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/ater3.jpg",
      meta: ["50 x 50 x 3 cm", "14 kg aprox.", "4 un/m2", "2 un/ml"],
      specs: [
        ["Medida", "50 x 50 x 3 cm."],
        ["Peso unitario", "14 kg aprox."],
        ["Rendimiento", "4 unidades por m2 y 2 unidades por metro lineal."],
      ],
      notes: [
        {
          title: "Resoluciones visibles",
          text: "En la referencia aparecen tres variantes: Borde con bisel, Borde con nariz y Solarium.",
        },
        {
          title: "Aplicacion",
          text: "Pensado para piletas, decks y expansiones donde importa el confort de uso y una imagen limpia junto al agua.",
        },
        {
          title: "Consulta comercial",
          text: "Si queres, en la siguiente pasada lo desglosamos en fichas separadas para cada resolucion de borde.",
        },
      ],
    },
  ];
  const rusticosOverride = [
    {
      slug: "simil-adoquin-rustico",
      name: "Simil adoquin rustico",
      kicker: "linea rusticos",
      cardSummary:
        "Placa calcarea de lectura simil adoquin para interiores y exteriores con una expresion mineral sobria y consistente.",
      heroSummary:
        "Una pieza rustica pensada para proyectos que buscan textura, caracter y una terminacion cercana a la piedra natural.",
      image:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/adoquin1.jpg",
      detailImage:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/adoquin3.jpg",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Rustico"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m2", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m2 en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Variantes visibles",
          text: "En la referencia aparecen una version gris, una negra y una terracota, ademas de una foto de pieza en perspectiva.",
        },
        {
          title: "Aplicacion",
          text: "Funciona muy bien en patios, galerias, expansiones y sectores donde se busca una textura tipo adoquin con lectura controlada.",
        },
        {
          title: "Terminacion sugerida",
          text: "Como en el resto de la linea rustica, se recomienda el encerado luego de la colocacion para reforzar el acabado final.",
        },
      ],
    },
    {
      slug: "loseta-lisa-biselada",
      name: "Loseta lisa biselada",
      kicker: "linea rusticos",
      cardSummary:
        "Pieza de lenguaje mas limpio dentro de Rusticos, con borde biselado y una lectura versatil para distintos criterios de colocacion.",
      heroSummary:
        "Una loseta sobria y tecnica que conserva el espiritu mineral de la linea mientras suma una imagen mas serena y contemporanea.",
      image:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/lose2.jpg",
      detailImage:
        "https://mosaicosmc.com/wp-content/uploads/2023/12/lose3.jpg",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Biselada"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m2", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m2 en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Uso visible en referencia",
          text: "La pagina original muestra la pieza lisa, una aplicacion en piso y una opcion de colocacion sobre apoyos o tacos plasticos.",
        },
        {
          title: "Aplicacion",
          text: "Es una muy buena opcion para terrazas, expansiones y superficies que necesitan una lectura mas despejada sin salir de la familia rustica.",
        },
        {
          title: "Terminacion sugerida",
          text: "El encerado posterior ayuda a consolidar una terminacion mas brillante y una presencia visual mejor definida.",
        },
      ],
    },
    {
      slug: "accesibilidad",
      name: "Accesibilidad",
      kicker: "linea rusticos",
      cardSummary:
        "Solucion tactil y de guiado dentro de la linea rustica, pensada para recorridos accesibles con lenguaje tecnico y alta legibilidad.",
      heroSummary:
        "Una familia funcional para resolver circulaciones accesibles mediante losetas guia y piezas tactiles de clara lectura.",
      image:
        "https://images.unsplash.com/photo-1592595896616-c37162298647?auto=format&fit=crop&w=1200&q=80",
      detailImage:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1400&q=80",
      meta: ["40 x 40 x 3,6 cm", "12 kg aprox.", "6,25 un/m2", "Accesibilidad"],
      specs: [
        ["Peso unitario", "12 kg aprox. por unidad."],
        ["Peso por m2", "75 kg aprox."],
        ["Rendimiento y medida", "6,25 unidades por m2 en formato 40 x 40 x 3,6 cm."],
      ],
      notes: [
        {
          title: "Piezas visibles",
          text: "La referencia muestra dos resoluciones concretas: loseta 6 barras guia y loseta tactil.",
        },
        {
          title: "Aplicacion",
          text: "Pensado para recorridos peatonales, accesos y sectores donde hace falta reforzar guiado y advertencia tactil dentro del proyecto.",
        },
        {
          title: "Asesoramiento",
          text: "Podemos ayudarte a definir despiece, ubicacion y combinacion con otras piezas de la linea segun el recorrido previsto.",
        },
      ],
    },
  ];
  const lines = catalog.lines;
  const exteriorPulidaLine = lines.find((line) => line.slug === "exterior-pulida");
  const mosaicosLine = lines.find((line) => line.slug === "mosaicos");
  const atermicosLine = lines.find((line) => line.slug === "atermicos");
  const rusticosLine = lines.find((line) => line.slug === "rusticos");

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
                <span class="kicker">linea de producto</span>
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
        return "veredas, accesos, galerias y expansiones exteriores con circulacion intensa";
      case "mosaicos":
        return "interiores, locales, halls y proyectos donde importa la resistencia junto a una terminacion cuidada";
      case "atermicos":
        return "bordes de pileta, decks, solariums y expansiones donde el confort termico es determinante";
      case "rusticos":
        return "interiores y exteriores con lenguaje mineral, textura protagonista y lectura mas artesanal";
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
        return "Conviene definir el sistema de colocacion segun el soporte, contemplando nivelacion, juntas y terminacion final de acuerdo con el tipo de mosaico.";
      case "atermicos":
        return "La colocacion debe contemplar pendiente, drenaje y definicion de bordes para resolver correctamente solarium, nariz y encuentros con la pileta.";
      case "rusticos":
        return "Se recomienda revisar juntas, absorcion y terminacion superficial para conservar el caracter rustico sin perder estabilidad de uso.";
      case "bloques-de-hormigon":
        return "La base y la compactacion son claves para asegurar estabilidad, resistencia al uso y una modulacion consistente en obra.";
      default:
        return "Nuestro equipo puede orientarte en colocacion, juntas, base de apoyo y terminacion segun el uso previsto.";
    }
  };

  const getMaintenanceGuidance = (line) => {
    switch (line.slug) {
      case "exterior-pulida":
        return "Con limpieza periodica y el tratamiento final adecuado, mantiene una presencia uniforme y muy buena respuesta al uso exterior.";
      case "mosaicos":
        return "El mantenimiento depende de la terminacion elegida, pero en general se recomienda limpieza regular y cuidado de la superficie para preservar color y lectura.";
      case "atermicos":
        return "Con limpieza frecuente y control de bordes, conserva confort de uso, imagen limpia y buen desempeno en zonas humedas.";
      case "rusticos":
        return "Su textura agradece una limpieza constante y un criterio de proteccion acorde al nivel de exposicion y al uso del ambiente.";
      case "bloques-de-hormigon":
        return "Una rutina simple de limpieza y control de juntas ayuda a sostener su rendimiento y su expresion material en el tiempo.";
      default:
        return "Te recomendamos definir el esquema de mantenimiento junto con la especificacion de uso para asegurar mayor durabilidad.";
    }
  };

  const getInquiryHref = (line, product, topic) => {
    const messages = {
      general: `Hola Mosaicos MC, me interesa ${product.name} de la linea ${line.name}. Quisiera recibir asesoramiento para mi proyecto.`,
      ficha: `Hola Mosaicos MC, quiero recibir la ficha tecnica de ${product.name} de la linea ${line.name}.`,
      colocacion: `Hola Mosaicos MC, quisiera consultar la colocacion y aplicacion recomendada para ${product.name} de la linea ${line.name}.`,
    };

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messages[topic] || messages.general)}`;
  };

  const buildFaqs = (line, product) =>
    product.faqs || [
      {
        question: `Sirve ${product.name} para el uso previsto en este tipo de proyecto?`,
        answer: `${product.heroSummary} Dentro de la linea ${line.name}, se recomienda especialmente para ${getLineApplications(line)}.`,
      },
      {
        question: "Cuantas unidades necesito por metro cuadrado?",
        answer: `${product.name} trabaja con ${product.meta.slice(0, 3).join(", ")}. Para cotizar con mas precision, conviene contemplar cortes, encuentros y un margen adicional segun el tipo de obra.`,
      },
      {
        question: "Como se coloca: con pegamento o con sistema tradicional?",
        answer: getInstallationGuidance(line),
      },
      {
        question: "Cuando se define la junta y que hay que prever en obra?",
        answer:
          "La separacion entre piezas, las juntas y los encuentros deben definirse segun soporte, modulado y exposicion. Podemos orientarte en ese criterio junto con la colocacion recomendada para evitar improvisaciones en obra.",
      },
      {
        question: "Tiene ficha tecnica o respaldo comercial para especificarlo?",
        answer:
          "Si. Podemos enviarte la ficha comercial o tecnica disponible, revisar cantidades, aplicaciones y ayudarte a validar si esta pieza es la indicada para tu proyecto.",
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
        title: "Catalogo de la linea",
        text: `Acceso rapido a la coleccion ${line.name} para revisar el lenguaje de la linea y sus productos disponibles.`,
        meta: ["Linea completa", "Online"],
        href: lineHref(line.slug),
        cta: "Ver coleccion",
      },
      {
        kicker: "ficha tecnica",
        title: "Ficha del producto",
        text: `Solicita la ficha comercial y tecnica de ${product.name} con medidas, rendimiento y recomendaciones de aplicacion.`,
        meta: ["PDF a pedido", "Asistencia comercial"],
        href: getInquiryHref(line, product, "ficha"),
        cta: "Solicitar PDF",
        external: true,
      },
      {
        kicker: "colocacion",
        title: "Guia de aplicacion",
        text: `Te ayudamos a validar base, terminacion y criterio de colocacion segun el uso previsto para ${product.name}.`,
        meta: ["Soporte", "Obra"],
        href: getInquiryHref(line, product, "colocacion"),
        cta: "Consultar",
        external: true,
      },
    ];

  const buildTestimonials = (line, product) =>
    product.testimonials || [
      {
        quote: "Excelente atencion y calidad. Precios acorde a la mercaderia.",
        author: "Sebastian Almeida",
        role: "Resena 5 estrellas en Google",
      },
      {
        quote: "La verdad que quede muy satisfecho.",
        author: "ricardo",
        role: "Resena 5 estrellas en Google",
      },
      {
        quote: "Muy buena relacion precio calidad.",
        author: "Carlos Mariano Capisto",
        role: "Resena 5 estrellas en Google",
      },
    ];

  const getMetaIconType = (value) => {
    const normalized = String(value || "").toLowerCase();

    if (normalized.includes("cm") || (/\d/.test(normalized) && /\d+\s*x\s*\d+/.test(normalized))) {
      return "dimension";
    }

    if (normalized.includes("kg")) {
      return "weight";
    }

    if (normalized.includes("m2") || normalized.includes("m²") || normalized.includes("un/")) {
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
    const normalized = String(label || "").toLowerCase();

    if (normalized.includes("medida")) {
      return "dimension";
    }

    if (normalized.includes("peso")) {
      return "weight";
    }

    if (
      normalized.includes("unidades") ||
      normalized.includes("cantidad") ||
      normalized.includes("m2") ||
      normalized.includes("m²")
    ) {
      return "grid";
    }

    if (normalized.includes("uso")) {
      return "application";
    }

    if (normalized.includes("terminacion")) {
      return "finish";
    }

    if (normalized.includes("colocacion")) {
      return "layout";
    }

    return "info";
  };

  const getNoteIconType = (title) => {
    const normalized = String(title || "").toLowerCase();

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

    if (normalized.includes("consulta") || normalized.includes("asesoria")) {
      return "chat";
    }

    if (normalized.includes("terminacion")) {
      return "finish";
    }

    if (normalized.includes("colocacion")) {
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
          <h2>Todo lo importante sobre ${product.name}</h2>
          <p>Respuestas rapidas para especificar mejor la pieza, anticipar su aplicacion y resolver consultas habituales.</p>
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
          <h2>Material util para especificar ${product.name}</h2>
          <p>Sumamos recursos de consulta y acceso rapido para acompanar el proceso comercial y tecnico.</p>
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
            <span class="eyebrow eyebrow--dark">misma linea</span>
            <h2>Productos relacionados dentro de ${line.name}</h2>
            <p>Si queres comparar opciones, aca tenes otras piezas de la misma familia con un lenguaje compatible.</p>
          </div>
          <div class="product-grid">
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
                          .map((item, index) => `<span class="product-meta__item" style="--meta-icon:${index};">${item}</span>`)
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
      `
      : "";

  const renderProductCta = (line, product) => `
    <div class="cta-strip product-cta reveal is-visible">
      <span class="eyebrow eyebrow--dark">asesoramiento</span>
      <h3>Te ayudamos a especificar ${product.name}</h3>
      <p>Si estas definiendo cantidades, aplicacion o terminacion, armamos una recomendacion alineada con tu proyecto y con la linea ${line.name}.</p>
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
          <h2>Lo que valoran quienes eligen ${line.name}</h2>
          <p>Una seleccion de resenas reales de 5 estrellas que destacan atencion, calidad y relacion precio-calidad.</p>
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
      <section class="page-hero" style="--hero-image: url('${resolveAsset("@/assets/img/generated/home-brand-editorial.png")}');">
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
    const lineImage = resolveAsset(line.heroImage);
    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${lineImage}');">
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
          <p>Selecciona una pieza para ver su ficha, aplicaciones y recomendaciones de uso.</p>
        </div>
        ${renderProductCards(line)}
      </section>
    `;
  };

  const renderProductPage = (line, product) => {
    const relatedProducts = line.products.filter((item) => item.slug !== product.slug);
    const productDetailImage = resolveAsset(product.detailImage);

    shell.innerHTML = `
      <section class="page-hero" style="--hero-image: url('${productDetailImage}');">
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
