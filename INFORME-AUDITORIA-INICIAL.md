# Auditoría inicial del ZIP recibido

## Archivos encontrados
- `index.html`, `estilos.css`, `premium-layer.css`
- `datos.js`, `datos.json`, `render.js`, `eventos.js`
- `tablero.js`, `preferencias.js`, `jquery-panel.js`
- imágenes y capturas
- demos/ejercicios separados: `app.js`, `funciones.js`, `remoto.js`, `remoto-demo.html`, `jquery-comparado.js`

## Observaciones técnicas
1. El HTML principal carga jQuery, datos.js, render.js, eventos.js, jquery-panel.js, preferencias.js y tablero.js.
2. `app.js`, `funciones.js` y `remoto.js` no están cargados en la página principal; son prácticas/demos y se conservan.
3. El catálogo actual se define en `datos.js`; `datos.json` corresponde a una demo separada, por lo que no se deben tratar como una única fuente de verdad sin una migración deliberada.
4. El tablero y las preferencias utilizan almacenamiento del navegador en el frontend actual. El tablero deberá migrarse a persistencia de servidor; las preferencias de interfaz pueden seguir locales.
5. Se conservaron los IDs existentes del HTML principal para no romper selectores.
6. Se creó `public/` como copia servida por Express. Los archivos originales en la raíz se mantienen como referencia de auditoría.

## Límites de esta entrega
No se ejecutaron pruebas en navegador ni se instaló Node/PostgreSQL. La base del servidor y el esquema Prisma son un scaffold inicial, no un sistema integral terminado. Debe validarse el esquema con Prisma y probarse la conexión real a PostgreSQL en el equipo de desarrollo.
