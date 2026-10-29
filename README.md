# TecnoFix – Sitio web de reservas de servicio técnico

**Estudiantes:** Miguel Angel Choquehuanca Mamani y Claudia Fernandez Condori
**Cliente:** TecnoFix Servicio Técnico (Colquencha, Provincia Aroma)
**URL publicada:** [DESPUÉS, PRÓXIMA SEMANA]

## Qué resuelve
TecnoFix es un taller de reparación y mantenimiento de computadoras y laptops.
Sus clientes no tenían una forma clara de ver los servicios, los precios y los
días de atención antes de ir al taller. Este sitio los muestra en un solo lugar
y permite reservar el servicio con un formulario (datos del cliente, tipo de
servicio, cantidad de equipos, fecha de recepción y detalle de la falla).
También indica cómo llegar al taller.

## Cómo está construido
- **Semántica:** `header` con `nav` para la identidad y el menú; un solo `main`
  con siete `section` (servicios y productos, *Arma tu pedido*, horarios y precios,
  solicitud, preguntas frecuentes y avisos, y ubicación y preferencias); cada servicio es un
  `article`; la tabla de precios usa `caption`, `thead` y `scope="col"`;
  `figure` y `figcaption` para las fotos; `aside` para el dato curioso; y
  `footer` con `address` para la ubicación. El formulario agrupa los campos con
  `fieldset` y `legend`, y cada campo tiene su `label` conectado con `for` e `id`.
  Los mensajes de estado usan `role="status"` y `aria-live="polite"`.
- **Layout:**
  - *Flexbox* en el menú (`nav ul` con `flex-wrap` para que los botones pasen a
    otra línea en móvil) y en los botones, porque son elementos en una sola línea.
  - *Grid* en las tarjetas de servicios (3 columnas desde 48rem) y en la
    página completa con áreas nombradas (cabecera, principal, lateral y pie)
    desde 60rem, porque ahí hay filas y columnas a la vez.
  - Enfoque *mobile-first*: el CSS base es para móvil y se agregan ajustes con
    `@media` en 40rem, 48rem y 60rem.
- **Diseño:** paleta azul eléctrico (azul noche `#0b1f4d`, azul `#1f5bff`,
  celeste `#00b4ff` y fondo `#eef3ff`) definida con variables CSS. Transmite
  tecnología y confianza, y el contraste permite leer bien. La tipografía es
  `system-ui`: carga rápido, no depende de fuentes externas y se ve nativa en
  cada dispositivo. Además hay **modo oscuro**: la clase `tema-oscuro` en el `body`
  redefine las mismas variables CSS.

- **JavaScript (`app.js`):** demo del Día 5 (práctica de consola; ya no se enlaza en `index.html`).
  Usa `const` y `let`, tipos (`typeof`, `null` y `undefined`), template literals
  y comparación con `===`. Al cargar, cambia con `querySelector` y `textContent`
  el subtítulo del `header` para mostrar los equipos en el taller; los demás
  resultados se ven en la consola (F12).
- **JavaScript (`funciones.js`):** práctica de coerción, valores falsy,
  control de flujo (`if`, ternario, `for...of`), las tres formas de escribir una
  función, arrow functions con parámetro por defecto, funciones como valores
  (`aplicarATodos`) y closures (`crearContador`). Es práctica de consola (F12) y ya no se enlaza en `index.html`.
- **JavaScript (`datos.js`):** práctica de objetos literales, destructuring y
  spread, un arreglo de objetos con el catálogo de servicios, repuestos y
  accesorios, los métodos `forEach`, `map`, `filter`, `find`, `some`, `every`,
  `sort` y `reduce` (solos y encadenados) y clases con herencia (`Producto` y
  `ProductoConDescuento`). Se enlaza con `defer` después de `funciones.js`.

- **LABORATORIO 2** 
- **JavaScript (`render.js`):** práctica de manipulación dinámica del DOM. Uso de
  `querySelector` y `querySelectorAll` para selección de nodos, creación de elementos
  con `createElement`, gestión de clases (`classList.add`) y atributos personalizados
  (`dataset`). Implementa la función modular `render` para dibujar tarjetas multimedia
  con fotografías reales de cada servicio/producto, etiquetas de categoría, `onerror` fallback,
  gestión de stock y agotados. Llena dinámicamente las opciones del `<select>` del formulario.
  Se enlaza con `defer` después de `datos.js`.

- **JavaScript (`eventos.js` con jQuery):** interactividad y manejo de eventos implementados
  con **jQuery**. Búsqueda reactiva en tiempo real con `$().on("input")`, delegación de eventos
  en botones de filtro (`#filtros`), actualización con animación visual (`fadeIn`) en las tarjetas
  y contador dinámico. En el formulario, captura el evento `submit` con `preventDefault`, realiza
  validación de fechas (`setCustomValidity`), extrae datos con `FormData`, muestra retroalimentación
  animada con `.slideDown()` y añade desplazamiento suave (smooth scroll) en el menú de navegación.
  Valida patrones con expresiones regulares (`RegExp`) con `.test()`. Se enlaza después de `render.js`.
- **JavaScript (`jquery-panel.js` con jQuery - Día 11):** componentes interactivos avanzados
  y efectos de jQuery. Incluye menú desplegable interactivo con `#menu-toggle` y `slideToggle(200)`
  sincronizado con `aria-expanded`; acordeón accesible en `#acordeon` con delegación (`.on("click", ".titulo")`),
  hermano adyacente (`.next(".cuerpo")`), detención de colas de animación (`.stop(true, true)`),
  exclusión con `.not()` y actualización accesible; lista de avisos con aparición escalonada
  usando `.each()`, `.delay(indice * 120)` y `.fadeIn(250)` con alternancia a `.fadeOut(200)`;
  y función personalizada encadenable `resaltar()` que retorna la selección de jQuery. Se enlaza al final con `defer`.
- **JavaScript (`remoto.js` + `datos.json` - datos remotos):** carga del catálogo desde un
  archivo externo en la sección *Catálogo remoto*. Convierte texto JSON a objeto con `JSON.parse`
  y viceversa con `JSON.stringify`; pide `datos.json` con `fetch` y `async/await`, revisa
  `respuesta.ok` y captura los fallos con `try/catch`; y repite lo mismo con `$.getJSON` de jQuery
  (`.done`, `.fail`, `.always`). Muestra los tres estados de una carga (cargando, ok y error) en
  `#estado`, y un botón provoca un error a propósito (`no-existe.json` responde 404). **Necesita un
  servidor local** (Live Server o `http://localhost:8080`): abierto con doble clic (`file://`) el
  navegador bloquea `fetch`. Esta demo (Día 10) ya no se muestra en la página: su HTML quedó guardado en
  `remoto-demo.html` con las instrucciones para volver a activarla.
- **JavaScript (`preferencias.js` - Día 13, Web Storage y Geolocation):** guarda las
  preferencias del visitante en `localStorage` bajo una sola clave (`tecnofix:preferencias`)
  con `JSON.stringify` y las lee con `JSON.parse` dentro de `try/catch`, con valores por defecto
  por si el dato está dañado. Controla el **modo oscuro** (clase `tema-oscuro`, botón con
  `aria-pressed`, y el tema inicial sale de `prefers-color-scheme`), el **orden del catálogo**
  (nombre o precio) y el botón *Olvidar preferencias*. Avisa a los demás scripts con el evento
  personalizado `preferencias:cambio`. En la sección de ubicación usa
  `navigator.geolocation` (`getCurrentPosition`/`watchPosition`) para calcular la distancia al taller
  con la fórmula de Haversine, solo después de que el cliente pulsa el botón, y explica cada
  error (permiso denegado, ubicación no disponible, tiempo agotado).
  
  **LABORATORIO 3** 
- **JavaScript (`tablero.js` - Día 14, Drag & Drop y Canvas):** sección **Arma tu pedido**.
  El cliente arrastra los servicios y repuestos de *Disponibles* a *Mi pedido* con los eventos
  `dragstart`, `dragover`, `drop` y `dragend`; en el celular usa las flechas ◀ ▶. El estado vive en
  un objeto (`tablero`) y el DOM solo lo muestra: cada cambio guarda en `localStorage`
  (`tecnofix:pedido`) y vuelve a pintar. En *Mi pedido* se cambia la cantidad (limitada por el
  stock), se escribe un detalle (por ejemplo, otra memoria RAM) y se quita lo que no se necesita.
  Los productos agotados no se pueden pedir. Cada ítem elegido también aparece como un
  **círculo con la foto del producto** (con su cantidad y subtotal) en la caja **Tu selección**.
  El total se puede enviar por **WhatsApp** (`wa.me`) o llevar al formulario de solicitud.
  Un `<canvas>` dibuja el gasto por categoría con barras animadas (`requestAnimationFrame`),
  nítidas en pantallas retina y respetando `prefers-reduced-motion`. Los precios salen de `datos.js`.

## Cómo ejecutarlo
Abrir la carpeta en VS Code y usar **Live Server** (puerto 5501, ya configurado en
`.vscode/settings.json`). Los scripts que usan `fetch` y `localStorage` funcionan mejor con un
servidor local que abriendo `index.html` con doble clic.

## Capturas
![Escritorio](capturas/captura-escritorio.png)
![Móvil 375px](capturas/captura-movil.png)
![Arma tu pedido](capturas/captura-tablero.png)

## Lo que falta
- [ ] Publicar el sitio y completar la **URL publicada** de arriba.
- [ ] Agregar la carpeta `capturas/` (hoy no está en el repositorio, por eso las imágenes no se ven):
      escritorio, móvil de 375 px y el tablero con los círculos.
- [ ] Actualizar `MEMORIA.md` con los días 12 a 14 (preferencias, geolocalización y tablero con círculos);
      hoy llega hasta el Día 11.
- [ ] Revisar la disponibilidad de **Memoria RAM 8 GB** y **Cable HDMI** (aparecen agotados en `datos.js`).
- [ ] Reemplazar las fotos de Wikimedia por imágenes propias en el repositorio, para que no dependan de internet.

## Lo más difícil
Lo más difícil fue el inicio y el diseño. Al comenzar costó decidir cómo
organizar el CSS y elegir una paleta que se viera tecnológica; lo resolvimos
definiendo los colores y espacios como variables en `:root`, para mantener todo
consistente en el sitio. Después costó que el header y el menú se vieran bien en
móvil: los botones no cabían en pantallas pequeñas, y lo resolvimos con
`flex-wrap` y con un diseño mobile-first que se amplía con `@media`.
