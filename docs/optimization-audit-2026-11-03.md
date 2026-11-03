# Revisión técnica — 3 de noviembre de 2026

## Cambios implementados

- Las 32 páginas principales conservan su contenido en HTML, legible sin JavaScript. El catálogo ya no reemplaza ese HTML al iniciar; solo agrega interacción.
- Corregida la lectura de descripciones multilínea para compartir y datos estructurados. Títulos únicos, canonical, Open Graph y Twitter consistentes.
- Una única descripción estructurada del negocio con domicilio, WhatsApp y horarios confirmados; jerarquía de páginas y preguntas frecuentes basadas en contenido visible. No se inventan precios, stock, reseñas ni valoraciones.
- `llms.txt` ampliado y `llms-full.txt` generado desde los 20 productos reales, con medidas y códigos disponibles. No se presupone soporte universal para estos archivos ni mejoras de ranking por su existencia.
- Fuentes variables Inter/Montserrat alojadas localmente, con sus licencias SIL OFL; precarga de los subconjuntos latinos y sin conexiones a Google Fonts.
- Prioridad de las imágenes principales y prioridad baja en imágenes diferidas. Las diapositivas ocultas de portada cargan al activarse. El mapa se conecta solo al acercarse a su sección.
- El video automático y la presentación respetan ahorro de datos; se mantiene el respeto a movimiento reducido.
- Versionado de CSS/JS con hash de contenido para evitar cachés obsoletos.
- Lenis actualizado de 1.3.26 a 1.3.27 desde el paquete oficial. Acciones de publicación/análisis actualizadas y fijadas a SHA. Revisión semanal de versión y avisos OSV para la librería vendorizada; Dependabot continúa revisando GitHub Actions.
- CSP de scripts locales conservada y orígenes de fuentes externos eliminados. Formularios sin endpoint de recepción ni secretos en el cliente.
- Los datos personales del presupuesto se guardan solo en la sesión de la pestaña; se elimina el almacenamiento persistente anterior. El carrito sigue disponible entre visitas.
- Campo señuelo invisible y fuera del recorrido de teclado, límites de longitud y control de repeticiones para los formularios. Siempre se prepara un mensaje que el usuario revisa y envía en WhatsApp. Las pruebas interceptan la apertura, no envían mensajes.
- Comprobaciones de SEO, grafos, archivos de descubrimiento y hashes incorporadas a la validación de publicación.

## Seguridad: alcance de la revisión

El sitio no tiene CMS, login, pagos, base de datos ni procesamiento de formularios en servidor. No hay dependencias npm de aplicación. Se revisaron los scripts, manejo de datos del carrito y formularios, CSP, archivos publicados, acciones de CI y biblioteca externa.

La consulta inicial del repositorio no devolvió alertas abiertas de Dependabot; CodeQL mostró una alerta histórica ya corregida. OSV no devolvió avisos para Lenis 1.3.27. Esto describe las comprobaciones realizadas; no equivale a un pentest ni garantiza ausencia absoluta de vulnerabilidades.

## Antispam y dominio definitivo

Los controles locales frenan errores de repetición y automatizaciones simples, pero pueden ser omitidos por un bot. No bloquean mensajes enviados directamente al correo o WhatsApp públicos.

Al migrar al dominio definitivo corresponde:

1. Actualizar las URL canónicas, sitemap y archivos de descubrimiento al dominio real y redirigir las URL antiguas cuando el alojamiento lo permita; validar Search Console y enviar el sitemap.
2. Servir `robots.txt` en la **raíz del dominio**. En la demo de GitHub Pages, el archivo dentro de `/mosaicos-mc-web/` no controla el rastreo del host.
3. Configurar en el servidor HTTPS, compresión, caché y encabezados HTTP (CSP con `frame-ancestors`, `X-Content-Type-Options`, política de permisos y HSTS una vez comprobado HTTPS). GitHub Pages no permite configurar todos estos encabezados desde este repositorio. No se simulan con etiquetas meta que no los soportan.
4. Revisar SPF, DKIM, DMARC y filtrado antispam en el proveedor de correo. Estos registros autentican correo y no sustituyen los filtros de entrada. Requiere acceso a DNS y correo; no se modificaron en esta revisión.
5. Si más adelante se agrega un formulario que recibe datos en servidor: validación y límites del lado del servidor, protección contra abuso y CAPTCHA verificado en servidor cuando corresponda. Mantener acceso para buscadores legítimos; no bloquear todos los bots.

## Fuentes técnicas

- [Google: funciones de IA y sitios web](https://developers.google.com/search/docs/appearance/ai-features): contenido textual, rastreable y datos coherentes; no hay archivo especial obligatorio ni garantía de inclusión.
- [OWASP: prevención de XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).
- [Lenis 1.3.27](https://github.com/darkroomengineering/lenis/releases/tag/v1.3.27).

## Verificación

Validaciones: 42 documentos HTML y enlaces; 32 páginas principales con SEO y datos estructurados; 20 productos y sus fuentes; pruebas de datos malformados/XSS y almacenamiento bloqueado. En navegador: 32 páginas a 1366 y 390 px, 32 páginas sin JavaScript y scroll en las 32 páginas. Formularios comprobados con campos señuelo, repetición, preparación de WhatsApp y datos personales en sesión. No se enviaron mensajes.

Medición local con caché desactivada, 200 kB/s, 80 ms de latencia y CPU reducida 4×: la portada pasó de aproximadamente 1,74 MB a 0,85 MB transferidos en la ventana inicial de prueba (51% menos). Las cuatro rutas medidas finalizaron con CLS 0 y sin errores JavaScript ni peticiones iniciales a terceros; el mapa se difiere hasta su sección. El tiempo de carga varía por red y dispositivo. No se presenta una puntuación PageSpeed ni una garantía de Core Web Vitals: son mediciones de laboratorio, no datos de usuarios reales.
