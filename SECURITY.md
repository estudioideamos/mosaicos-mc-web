# Seguridad

La versión mantenida es la rama main.

## Reportar una vulnerabilidad

Usá **Security → Report a vulnerability** en este repositorio para enviar un reporte privado. Incluí pasos para reproducir el problema, impacto y páginas afectadas. No publiques credenciales, información personal ni detalles explotables en issues públicos.

## Controles

- Detección de secretos y protección de push en GitHub.
- GitHub Actions con permisos de lectura por defecto y acciones fijadas por SHA.
- CodeQL analiza JavaScript en cambios y semanalmente.
- Dependabot propone actualizaciones de las acciones; no se fusionan automáticamente.
- La publicación copia solamente archivos públicos a un artefacto temporal.
- No guardar contraseñas, claves API ni datos de clientes en HTML, JavaScript o Git.

GitHub Pages sirve contenido estático. Cualquier función que necesite secretos o validación de datos del cliente requiere un servicio de servidor. Estos controles reducen riesgos; no constituyen una garantía de ausencia de vulnerabilidades.
