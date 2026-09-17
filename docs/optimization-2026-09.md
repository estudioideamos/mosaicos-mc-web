# Optimización de septiembre de 2026

## Cambios
- 10 imágenes utilizadas por el sitio convertidas a WebP: 25.051.569 → 2.460.200 bytes (90,2% menos). Se conservan los originales; no se modifica el diseño de las piezas.
- El contenedor principal ya no espera a la carga completa de imágenes para aparecer.
- Catálogo, líneas y 20 fichas prerenderizados mediante el mismo código que utiliza la web. Texto, fotos, medidas y enlaces disponibles sin ejecutar JavaScript.
- Metadatos estáticos en 32 páginas: descripción, canonical, Open Graph, Twitter y datos estructurados WebSite/Organization/WebPage/Product. Sin precios ni reseñas inventados.
- sitemap.xml y un índice factual llms.txt. La lectura por IA depende principalmente del contenido HTML accesible; llms.txt es complementario y no garantiza inclusión.
- Portada social JPEG de 1200 × 630 con el logo real y dirección editorial del sitio.
- Actualización de las acciones de GitHub a versiones estables verificadas, fijadas por SHA. Dependabot semanal y CodeQL permanecen activos.
- Corregida la alerta CodeQL js/xss-through-dom en el menú móvil usando textContent.
- Política de contenido para bloquear objetos embebidos, restringir base URI y actualizar recursos inseguros a HTTPS.

## Mantenimiento
Ejecutar `node scripts/prepare-content.mjs` después de modificar catálogo o plantillas y antes de `node scripts/check-site.mjs`. El workflow también prepara el contenido antes de publicar. El sitio no tiene dependencias npm de ejecución.

## Límites verificables
No se puede garantizar ausencia absoluta de vulnerabilidades ni posiciones, indexación o menciones por IA. El análisis automatizado cubre los archivos del repositorio, no la infraestructura de GitHub. GitHub Pages administra encabezados HTTP y caché. Un robots.txt bajo /mosaicos-mc-web/ no controla el dominio; por eso no se presenta como control de rastreo. El sitemap puede enviarse desde una propiedad verificada de Search Console. WhatsApp y redes pueden conservar una vista previa anterior hasta renovar su caché.

Referencias oficiales: https://developers.google.com/search/docs/appearance/ai-features y https://developers.google.com/search/docs/essentials/technical
