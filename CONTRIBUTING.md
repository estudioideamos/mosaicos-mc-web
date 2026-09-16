# Cambios en la web

1. Crear una rama desde main actualizado.
2. Editar contenido y conservar los enlaces relativos, incluidos los niveles de productos.
3. Ejecutar: node scripts/check-site.mjs
4. Probar la web con un servidor HTTP, en escritorio y móvil.
5. Abrir un pull request. La validación automática debe pasar antes de integrar.
6. Al integrar en main, GitHub Actions valida, prepara y publica en Pages.

No agregar dependencias sin necesidad. No publicar información privada. No reemplazar manuales o certificaciones por documentos inventados.

Para probar: python -m http.server 8000 --bind 127.0.0.1
Para preparar una copia pública: node scripts/build-site.mjs
Usar un directorio limpio, sin _site previo.

Las incidencias de seguridad se reportan por el canal privado explicado en SECURITY.md.
