# Revisión OWASP Top 10:2025 — 29 de septiembre de 2026

Alcance: código del sitio estático, catálogo, carrito local, consultas por WhatsApp, generación del artefacto y configuración versionada de GitHub Actions. No incluye una prueba de penetración de GitHub, WhatsApp, Google Maps ni cuentas administrativas. No equivale a una certificación ni garantiza ausencia de vulnerabilidades.

## Hallazgos corregidos

- **A05 / A08 — datos del carrito tratados como HTML.** Los nombres, variantes, identificadores y atributos provenientes de localStorage se interpolaban sin codificar en los dos renderizadores del carrito. Ahora se codifican al generar HTML. Explotarlo requería introducir datos manipulados en el almacenamiento del mismo origen; no se identificó una entrada remota directa. Las pruebas siembran datos deliberadamente manipulados y comprueban que se muestran como texto y no crean manejadores de eventos.
- **A08 / A10 — estructura de almacenamiento no validada.** Un elemento `null` podía interrumpir el carrito. Se validan objetos, campos y números finitos; se descartan elementos inválidos; se limitan registros y tamaño de lectura. Los adicionales se recalculan. Se bloquean imágenes externas guardadas en el carrito. No es una validación comercial de precios: el sitio envía una consulta que debe revisar el vendedor.
- **A10 — almacenamiento bloqueado o lleno.** Se conserva en memoria la selección de la página cuando falla la escritura. Si el navegador impide persistir, esa selección no sobrevive a una recarga o navegación. Los datos JSON dañados se recuperan como carrito vacío.
- **A02 — política de contenido insuficiente.** Las 32 páginas principales incluyen ahora CSP antes de los recursos: scripts solo del mismo origen, sin eventos inline; imágenes y videos propios; fuentes de Google y el mapa permitidos expresamente; objetos y envío nativo de formularios deshabilitados. Los formularios continúan preparando WhatsApp mediante JavaScript. Se permiten estilos inline porque el diseño actual los utiliza. Los enlaces externos conservan noopener/noreferrer.

## Cobertura de las diez categorías

| Categoría | Resultado y límite |
|---|---|
| A01 Control de acceso | Sin API, datos privados de servidor ni cuentas de clientes en el código inspeccionado. La publicación utiliza un artefacto con lista permitida; las credenciales y configuración no se publican. Permisos de cuentas GitHub fuera de alcance. |
| A02 Configuración | CSP reforzada. HTTPS y HSTS observados en la respuesta pública. Cabeceras adicionales quedan a cargo del hosting. |
| A03 Cadena de suministro | Actions fijadas por SHA, permisos por trabajo, Dependabot para Actions y CodeQL existentes. Lenis 1.3.26 se sirve localmente; la página oficial no mostraba avisos publicados al revisarla. Esto no certifica la biblioteca. |
| A04 Criptografía | HTTPS público; no se implementa criptografía ni se procesan tarjetas. El navegador guarda datos del presupuesto y contacto localmente: no es almacenamiento cifrado ni una cuenta privada. |
| A05 Inyección | Codificación contextual en ambos carritos y CSP. No hay SQL ni comandos de servidor en el sitio inspeccionado. |
| A06 Diseño inseguro | Se conserva el mínimo de 10 m² por modelo y el bloqueo de selecciones antiguas menores. La consulta de WhatsApp no es una orden validada por servidor. |
| A07 Autenticación | Sin login ni sesiones de usuarios en esta web. MFA y accesos del propietario de GitHub no comprobados. |
| A08 Integridad | Validación de datos persistidos, recursos propios y controles previos a publicación. Los datos del navegador siguen siendo editables por su propietario. |
| A09 Registro y alertas | Existen ejecuciones de validación/CodeQL. No hay servidor propio ni receptor de reportes CSP. Notificaciones y auditoría de la cuenta deben revisarse por su administrador. |
| A10 Excepciones | JSON dañado, tipos inválidos y almacenamiento bloqueado cubiertos por pruebas; recuperación del carrito sin bloquear navegación. |

## Verificación

- `node scripts/check-site.mjs`: 42 documentos HTML, enlaces locales, sintaxis, catálogo, mínimo de compra y regresiones nuevas de seguridad.
- Navegador Edge, escritorio 1366 px y móvil 390 px: Home, Productos, ficha compacta 30, Nosotros, FAQ y Contacto sin errores de ejecución ni infracciones CSP observadas.
- Ambos carritos con contenido HTML manipulado, imágenes externas, elementos nulos y JSON inválido; agregar/quitar producto normal; almacenamiento denegado.
- El build publica solo archivos permitidos. No se ejecutan solicitudes reales al cliente por WhatsApp durante las pruebas.

## Hosting / operación pendientes

GitHub Pages no configura desde estos HTML las cabeceras HTTP `frame-ancestors` (protección contra enmarcado), `X-Content-Type-Options` o `Permissions-Policy`. No agregar `frame-ancestors` a la meta CSP: ahí no tiene efecto. Si se requiere esa protección, configurar cabeceras en un hosting o proxy que las admita. Confirmar MFA, permisos mínimos y recepción de alertas en la cuenta GitHub. Al incorporar backend, pagos o usuarios será necesaria una revisión nueva.

Fuentes: [OWASP Top 10:2025](https://top10.owasp.org/2025/) y [seguridad de Lenis](https://github.com/darkroomengineering/lenis/security).
