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
  con tres `section` (servicios, precios y solicitud); cada servicio es un
  `article`; la tabla de precios usa `caption`, `thead` y `scope="col"`;
  `figure` y `figcaption` para las fotos; `aside` para el dato curioso; y
  `footer` con `address` para la ubicación. El formulario agrupa los campos con
  `fieldset` y `legend`, y cada campo tiene su `label` conectado con `for` e `id`.
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
  cada dispositivo.

- **JavaScript (`app.js`):** demo del Día 5, enlazado con `defer` en el `head`.
  Usa `const` y `let`, tipos (`typeof`, `null` y `undefined`), template literals
  y comparación con `===`. Al cargar, cambia con `querySelector` y `textContent`
  el subtítulo del `header` para mostrar los equipos en el taller; los demás
  resultados se ven en la consola (F12).
- **JavaScript (`funciones.js`):** práctica de coerción, valores falsy,
  control de flujo (`if`, ternario, `for...of`), las tres formas de escribir una
  función, arrow functions con parámetro por defecto, funciones como valores
  (`aplicarATodos`) y closures (`crearContador`). Se enlaza con `defer` después
  de `app.js` y su resultado se ve en la consola (F12).
- **JavaScript (`datos.js`):** práctica de objetos literales, destructuring y
  spread, un arreglo de objetos con el catálogo de servicios, repuestos y
  accesorios, los métodos `forEach`, `map`, `filter`, `find`, `some`, `every`,
  `sort` y `reduce` (solos y encadenados) y clases con herencia (`Producto` y
  `ProductoConDescuento`). Se enlaza con `defer` después de `funciones.js`.
- **JavaScript (`render.js`):** práctica de manipulación dinámica del DOM. Uso de
  `querySelector` y `querySelectorAll` para selección de nodos, creación de elementos
  con `createElement`, gestión de clases (`classList.add`) y atributos personalizados
  (`dataset`). Implementa la función modular `render` para limpiar y dibujar las
  tarjetas de productos en `#lista-productos`, genera dinámicamente las opciones
  del `<select>` del formulario a partir del catálogo y muestra navegación por el
  árbol DOM (`parentElement`). Se enlaza con `defer` después de `datos.js`.
- **JavaScript (`eventos.js`):** interactividad y manejo de eventos. Implementa
  búsqueda reactiva en tiempo real mediante el evento `input`, delegación de eventos
  con `click` y `closest` en los botones de filtro por categoría (`#filtros`),
  actualización sincronizada de la vista y contador de resultados. En el formulario,
  captura el evento `submit` con `preventDefault`, realiza validación personalizada de
  fechas (`setCustomValidity` y `reportValidity`), extrae los datos con `FormData` y
  `Object.fromEntries`, y valida patrones con expresiones regulares (`RegExp`) para
  teléfono, correo y cédula con `.test()`. Se enlaza con `defer` después de `render.js`.

## Capturas
![Escritorio](capturas/captura-escritorio.png)
![Móvil 375px](capturas/captura-movil.png)

## Lo más difícil
Lo más difícil fue el inicio y el diseño. Al comenzar costó decidir cómo
organizar el CSS y elegir una paleta que se viera tecnológica; lo resolvimos
definiendo los colores y espacios como variables en `:root`, para mantener todo
consistente en el sitio. Después costó que el header y el menú se vieran bien en
móvil: los botones no cabían en pantallas pequeñas, y lo resolvimos con
`flex-wrap` y con un diseño mobile-first que se amplía con `@media`.
