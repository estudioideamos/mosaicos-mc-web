# Mosaicos MC

Web estática de Mosaicos MC, desarrollada con HTML, CSS y JavaScript, sin dependencias de aplicación.

[Ver la web](https://estudioideamos.github.io/mosaicos-mc-web/) · [Preguntas frecuentes](https://estudioideamos.github.io/mosaicos-mc-web/preguntas-frecuentes/) · [Estado de publicación](https://github.com/estudioideamos/mosaicos-mc-web/actions/workflows/website.yml)

## Contenido

Inicio, nosotros, catálogo de productos, obras, descargas, contacto y preguntas frecuentes. Las preguntas frecuentes incluyen productos, fabricación, pedidos, colocación y logística.

## Estructura

- assets/: estilos, JavaScript, imágenes, video y documentos.
- productos/: catálogo y fichas de producto.
- nosotros/, obras/, descargas/, contacto/: páginas institucionales.
- preguntas-frecuentes/: preguntas agrupadas y asesoramiento.
- scripts/: verificación y preparación de archivos públicos.
- .github/: publicación, análisis de seguridad y actualizaciones automáticas.

## Desarrollo y validación

Requiere Node.js para las verificaciones; no requiere instalar paquetes.

    node scripts/check-site.mjs
    python -m http.server 8000 --bind 127.0.0.1

Abrir http://127.0.0.1:8000/. Revisar escritorio y móvil. Las rutas absolutas heredadas de imágenes de portada usan /mosaicos-mc-web/; para verificar esas portadas localmente, servir desde un directorio que contenga el proyecto con ese nombre.

## Publicación

El workflow **Website** valida títulos, configuración móvil, enlaces locales y sintaxis JavaScript. Prepara _site con los archivos públicos, excluyendo documentación, herramientas y configuración interna. Publica en GitHub Pages únicamente desde main, después de una validación correcta.

Los pull requests se validan sin permisos de publicación. Las acciones están fijadas a versiones concretas mediante SHA. Dependabot propone sus actualizaciones semanalmente.

## Seguridad y mantenimiento

Consultar [SECURITY.md](SECURITY.md) para reportes privados y [CONTRIBUTING.md](CONTRIBUTING.md) para el proceso de cambios.

GitHub Pages usa HTTPS. CodeQL revisa JavaScript en cada cambio y semanalmente. La rama principal debe recibir cambios mediante pull requests con las verificaciones aprobadas.

## Contenido pendiente de producción

El formulario prepara la consulta para revisarla y enviarla por WhatsApp, sin guardar datos ni afirmar que el mensaje fue enviado. El material del cliente de septiembre de 2026 ya está integrado: fotos optimizadas, selector de ambientes, catálogo PDF, ficha técnica de compactos y documento original de mortero/colocación. Los códigos faltantes se muestran como consulta; ver docs/material-cliente-2026.md para la trazabilidad y las confirmaciones pendientes. Los PDFs de prueba se conservan en el repositorio como referencia histórica, pero se excluyen de la publicación.

## Créditos

Diseño y desarrollo por [Estudio Ideamos](https://ideamos.com.ar/).
