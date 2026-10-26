# Memoria Técnica del Proyecto: TecnoFix Servicio Técnico

---

## 1. Información General del Proyecto

- **Nombre del Proyecto:** Sitio Web y Sistema de Reservas para TecnoFix Servicio Técnico
- **Estudiantes / Desarrolladores:**
  - Miguel Angel Choquehuanca Mamani
  - Claudia Fernandez Condori
- **Cliente:** TecnoFix Servicio Técnico
- **Ubicación:** Provincia Aroma, Localidad Colquencha (a media cuadra de la plaza principal 15 de agosto)
- **Contacto:** Teléfono 680 097 91
- **Fecha:** Octubre de 2026

---

## 2. Resumen Ejecutivo y Objetivos

### 2.1. Problema que Resuelve
TecnoFix es un taller especializado en reparación, mantenimiento y soporte técnico de computadoras de escritorio y laptops. Antes de este desarrollo, los clientes de la localidad de Colquencha y alrededores no contaban con un canal digital centralizado para consultar los servicios disponibles, las tarifas referenciales y los días de atención técnica.

### 2.2. Solución Implementada
Se diseñó e implementó una aplicación web interactiva, responsiva y accesible que permite:
1. Conocer la identidad, especialidades y ubicación física del taller.
2. Explorar el catálogo dinámico de servicios, repuestos y accesorios en tiempo real.
3. Filtrar y buscar productos al instante por nombre y categoría.
4. Consultar una tabla estructurada de precios y horarios de disponibilidad.
5. Realizar solicitudes de servicio en línea mediante un formulario validado con retroalimentación animada.

---

## 3. Estructura y Arquitectura del Proyecto

El proyecto está organizado siguiendo una estructura modular y limpia, separando estructura (HTML), presentación (CSS) y lógica por capas (JavaScript y jQuery):

```text
proyecto/
│
├── index.html              # Estructura semántica, accesible y puntos de anclaje
├── estilos.css             # Sistema de diseño, variables CSS, Flexbox, Grid y media queries
│
├── datos.js                # Catálogo de datos, modelos POO y programación funcional
├── app.js                  # Inicialización y verificación de entorno
├── funciones.js            # Funciones auxiliares, closures y lógica de cálculo
├── render.js               # Renderizado dinámico y manipulación del árbol DOM
├── eventos.js              # Interactividad, animaciones y validación con jQuery
├── jquery-panel.js         # Menú desplegable, acordeón accesible y avisos escalonados (Día 11)
├── jquery-comparado.js     # Comparativa práctica de sintaxis Vanilla JS vs jQuery
│
├── taller.jpg              # Fotografía del taller de servicio técnico
├── ubicacion.jpg           # Mapa de localización física en Colquencha
├── README.md               # Resumen del repositorio y guía rápida
└── MEMORIA.md              # Documentación técnica completa (esta memoria)
```

---

## 4. Tecnologías Empleadas

| Tecnología | Versión / Tipo | Propósito |
| :--- | :--- | :--- |
| **HTML5** | Estándar W3C | Estructura semántica, accesibilidad (ARIA/roles) y SEO |
| **CSS3** | Vanilla CSS | Diseño responsive (*mobile-first*), Grid, Flexbox y Custom Properties |
| **JavaScript** | ECMAScript 6+ | Paradigma funcional, Programación Orientada a Objetos y modularidad |
| **jQuery** | 3.7.1 (CDN Oficial) | Manipulación ágil del DOM, delegación de eventos y animaciones |

---

## 5. Diseño y Maquetación (HTML5 y CSS3)

### 5.1. Semántica y Accesibilidad (HTML5)
- **Estructura jerárquica:** Uso estricto de una sola etiqueta `<h1>` en el `<header>`, encabezados `<h2>` para secciones principales y `<h3>` para elementos dependientes.
- **Etiquetas semánticas:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<aside>`, `<footer>` y `<address>`.
- **Formularios accesibles:** Agrupación de controles con `<fieldset>` y `<legend>`, vinculación explícita mediante atributos `id` y `for` en todas las etiquetas `<label>`, y atributos de validación nativa (`required`, `min`, `max`, `pattern`).

### 5.2. Sistema de Diseño (CSS3)
- **Variables CSS (`:root`):**
  - Azul noche (`--color-principal: #0b1f4d`): Transmite formalidad y tecnología en encabezados y tablas.
  - Azul eléctrico (`--color-acento: #1f5bff`) y Celeste (`--color-acento-2: #00b4ff`): Elementos interactivos y estados activos.
  - Fondo claro (`--color-fondo: #eef3ff`): Confort visual y alto contraste con el texto (`#1b2540`).
- **Enfoque Mobile-First y Maquetación Híbrida:**
  - **Flexbox:** En la barra de navegación (`nav ul`) con `flex-wrap` para adaptarse a pantallas estrechas, y en la botonera de filtros.
  - **CSS Grid:** En la cuadrícula de tarjetas de productos (`#lista-productos`) y en la distribución del layout de pantalla completa (`@media (min-width: 60rem)`).
  - **Tipografía Nativa:** Pila de fuentes `system-ui` para rendimiento inmediato sin descargas externas.

---

## 6. Lógica y Desarrollo Modular en JavaScript

La lógica del cliente se dividió en módulos temáticos para facilitar su mantenimiento y evaluación:

### 6.1. `app.js` (Fundamentos e Inicialización)
- Uso de `const` y `let`.
- Verificación de tipos (`typeof`, `null`, `undefined`).
- Template literals y operadores de identidad estricta (`===`).
- Actualización dinámica del subtítulo en cabecera para informar la cantidad de equipos en taller.

### 6.2. `funciones.js` (Lógica Funcional y Closures)
- Prácticas de coerción y valores *truthy/falsy*.
- Estructuras condicionales y operadores ternarios.
- Closures (`crearContador`) para encapsular variables privadas.
- Funciones de orden superior como valores reutilizables (`aplicarATodos`).

### 6.3. `datos.js` (Modelos y Métodos de Arreglos)
- Modelado de catálogo con arreglos de objetos enriquecidos con propiedades multimedia (`imagen`), categorías y stock.
- Métodos funcionales: `.filter()`, `.map()`, `.find()`, `.some()`, `.every()`, `.reduce()` y `.sort()`.
- Programación Orientada a Objetos: Clase base `Producto` y clase derivada `ProductoConDescuento` con herencia (`extends`) y polimorfismo.

### 6.4. `render.js` (Construcción del DOM)
- Función modular `render(lista)` para poblar el contenedor `#lista-productos`.
- Generación de tarjetas visuales enriquecidas con imágenes optimizadas (`loading="lazy"`), etiquetas de categoría flotantes, tratamiento visual para artículos agotados y fallback de imagen con `onerror`.
- Poblado automático de opciones dentro del elemento `<select id="servicio">` del formulario a partir del catálogo de datos.

---

## 7. Implementación de jQuery en el Proyecto

Se integró **jQuery 3.7.1** en [eventos.js](file:///d:/Crocodile_Clips_v3.5_portable/Crocodile_Clips_v3.5_portable/Crocodile%20Clips%203.5%20portable/proyecto/eventos.js) para gestionar de forma eficiente la interacción y dotar a la interfaz de transiciones fluidas:

### 7.1. Búsqueda Reactiva en Tiempo Real
Mediante el método `.on("input")`, el buscador filtra el catálogo en vivo sin necesidad de recargar la página:
```javascript
$("#buscador").on("input", function () {
  textoBuscado = $(this).val();
  actualizar();
});
```

### 7.2. Delegación de Eventos en Botones de Filtro
Uso de delegación para conmutar la clase activa y filtrar los artículos:
```javascript
$("#filtros").on("click", "button", function () {
  const $boton = $(this);
  categoriaActiva = $boton.data("categoria");

  $("#filtros button").removeClass("activo");
  $boton.addClass("activo");

  actualizar();
});
```

### 7.3. Micro-animaciones en Tarjetas
Al filtrar o buscar, las tarjetas se redibujan y aparecen suavemente utilizando el efecto `.fadeIn()`:
```javascript
$("#lista-productos .tarjeta").hide().fadeIn(200);
```

### 7.4. Gestión y Feedback del Formulario de Solicitud
Captura del envío con `event.preventDefault()`, validación de fecha mínima y presentación del mensaje de confirmación con la animación `.slideDown()`:
```javascript
$("#resultado")
  .hide()
  .html(`🎉 <strong>¡Gracias ${datos.nombre}!</strong> Tu solicitud para <em>${datos.servicio}</em> fue registrada.`)
  .slideDown(350);
```

### 7.5. Navegación con Scroll Suave (*Smooth Scroll*)
Intercepción de clics en los enlaces del menú para un desplazamiento animado hacia cada sección:
```javascript
$("header nav a").on("click", function (event) {
  const destinoId = $(this).attr("href");
  if (destinoId && destinoId.startsWith("#")) {
    const $destino = $(destinoId);
    if ($destino.length) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: $destino.offset().top - 20 }, 500);
    }
  }
});
```

### 7.6. Componentes Avanzados de jQuery (Día 11: `jquery-panel.js`)
Se agregaron tres patrones indispensables de interfaz de usuario moderna:
1. **Menú Desplegable Accesible:** Control conmutador `#menu-toggle` que despliega u oculta `#menu-movil` mediante `.slideToggle(200)` y sincroniza en tiempo real el atributo de accesibilidad `aria-expanded`.
2. **Acordeón Interactivo con Delegación y `.stop()`:** Gestión de preguntas frecuentes en `#acordeon` mediante delegación `.on("click", ".titulo")`. Previene el encolado acumulativo de animaciones con `.stop(true, true)` y repliega automáticamente los demás paneles con `.not($cuerpo).slideUp(200)`.
3. **Avisos Escalonados:** Despliegue secuencial de novedades en `#avisos li` mediante `.each()`, aplicando un desfase de inicio con `.delay(indice * 120)` antes de ejecutar `.fadeIn(250)`.
4. **Función Encadenable `resaltar()`:** Implementación de funciones personalizadas que retornan la selección de jQuery para permitir *method chaining*, aplicando un destello visual al encabezado del panel informativo `#panel h2`.

---

## 8. Seguridad y Validación de Datos

1. **Restricciones HTML5 nativas:** Validación de correo (`type="email"`), cantidad numérica (`type="number"` con `min="1"` y `max="100"`) y aceptación de términos requerida.
2. **Validación de fechas en tiempo de ejecución:** Verificación en JavaScript para evitar el ingreso de fechas anteriores al día actual.
3. **Expresiones Regulares (`RegExp`):**
   - Teléfono: `/^[0-9]{7,8}$/` (números válidos de 7 a 8 dígitos).
   - Correo electrónico: `/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i`.
   - Cédula de Identidad (CI): `/^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/`.

---

## 9. Dificultades Encontradas y Soluciones

1. **Adaptabilidad del menú en pantallas móviles:**
   - *Problema:* Los botones de navegación se desbordaban horizontalmente en dispositivos de 360px a 400px.
   - *Solución:* Se implementó `flex-wrap: wrap` con `gap: 0.5rem` y estilos base *mobile-first*.
2. **Coordinación entre renderizado dinámico y eventos:**
   - *Problema:* Al filtrar o buscar, era indispensable que el contador de resultados, el catálogo visible y el select del formulario estuvieran sincronizados con el arreglo de datos.
   - *Solución:* Se centralizó la lógica en una función `actualizar()` que procesa los filtros encadenados (`.filter()`) y refresca la vista limpiamente.
3. **Integración armónica de jQuery con JavaScript existente:**
   - *Problema:* Evitar duplicidad o interferencia entre selectores nativos (`document.querySelector`) y los métodos de jQuery.
   - *Solución:* Se unificó toda la capa de interacción y eventos del usuario dentro de [eventos.js](file:///d:/Crocodile_Clips_v3.5_portable/Crocodile_Clips_v3.5_portable/Crocodile%20Clips%203.5%20portable/proyecto/eventos.js) bajo el contenedor `$(function() { ... })`.

---

## 10. Conclusiones

- El proyecto **TecnoFix** cumple de manera integral con los requerimientos técnicos y funcionales planteados, ofreciendo una experiencia rápida, intuitiva y profesional.
- La combinación de **HTML5 semántico**, **CSS3 moderno** y **jQuery** permite obtener un sitio web liviano, dinámico y con transiciones agradables sin necesidad de sobrecargar el proyecto con dependencias pesadas.
- La arquitectura modular de archivos facilita futuras ampliaciones, tales como la conexión a un backend con base de datos o pasarelas de pago.
