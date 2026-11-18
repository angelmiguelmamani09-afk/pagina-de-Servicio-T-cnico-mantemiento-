# TecnoFix — Rediseño híbrido premium

## Qué se actualizó
- `index.html`: metadatos SEO, título de página y nombre accesible del control del menú. Se conservaron los identificadores y la estructura funcional.
- `estilos.css`: se mantiene como hoja base original.
- `premium-layer.css`: nueva capa visual híbrida premium, cargada después de la hoja base.
- `respaldo-original/`: copias originales de `index.html` y `estilos.css` para restauración.

## Qué se preservó
Los archivos JavaScript originales y jQuery no se modificaron: `datos.js`, `render.js`, `eventos.js`, `jquery-panel.js`, `preferencias.js`, `tablero.js` y `jquery-3.7.1.min.js`.
También se conservaron las imágenes, SVG, datos y demostraciones incluidas en el ZIP de entrada.

## Cómo ejecutar
1. Extrae el ZIP completo.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Inicia `index.html` con Live Server (recomendado) o sirve la carpeta mediante un servidor local.
4. Prueba el catálogo, filtros, tablero, modo oscuro, formulario y WhatsApp.

La geolocalización normalmente requiere `localhost` o HTTPS y permiso del navegador.

## Pruebas realizadas durante la preparación
- Los archivos JavaScript preservados pasaron `node --check`.
- `index.html` pasó el análisis básico de estructura HTML.
- Se verificó que los principales archivos JavaScript y jQuery son idénticos a los del ZIP original.

## Importante
No se pudo completar una prueba visual automatizada en navegador en este entorno. Por eso no se declara que todos los flujos interactivos hayan sido verificados visualmente. Antes de publicar, realiza las pruebas funcionales en un navegador real y confirma que precios, garantías, horarios, promociones y avisos estén actualizados.
