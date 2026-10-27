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
- **Fecha de Actualización:** 26 de Octubre de 2026 (Día 11 - jQuery Avanzado y Componentes Interactivos)
- **Repositorio:** `pagina-de-Servicio-T-cnico-mantemiento-`

---

## 2. Resumen Ejecutivo y Objetivos

### 2.1. Problema que Resuelve
TecnoFix es un taller especializado en reparación, mantenimiento y soporte técnico integral de computadoras de escritorio, laptops y periféricos en la localidad de Colquencha (Provincia Aroma). Con anterioridad al desarrollo de este proyecto, los usuarios del municipio y comunidades aledañas debían acudir presencialmente al taller para consultar tarifas, disponibilidad de técnicos y repuestos, o concertar citas de servicio sin certeza de tiempos de atención.

### 2.2. Solución Implementada
Se desarrolló una aplicación web responsiva, accesible y de alto rendimiento que centraliza:
1. **Identidad Corporativa y Localización:** Presentación del taller físico, equipamiento, especialidades y referencias geográficas exactas.
2. **Catálogo Multimedia Dinámico:** Consulta en tiempo real de servicios, repuestos y accesorios con fotografías de alta resolución, estados de disponibilidad y conteo de existencias.
3. **Buscador Reactivo y Filtro por Categorías:** Localización instantánea de artículos por nombre o clasificación (Servicios, Repuestos, Accesorios).
4. **Tarifario y Disponibilidad Semanal:** Tabla estructurada con servicios, precios en Bolivianos (Bs) y días de atención técnica.
5. **Formulario de Solicitud y Presupuesto:** Módulo interactivo de reserva con validación en tiempo de ejecución, protección contra fechas inválidas y retroalimentación animada al usuario.
6. **Panel Interactivo de Preguntas Frecuentes y Avisos (Implementado en el Día 11):** Menú de navegación desplegable, acordeón accesible con control anti-rebote de animaciones y avisos del taller con aparición escalonada.

---

## 3. Estructura y Arquitectura del Proyecto

El proyecto está diseñado bajo el principio de separación de responsabilidades en capas (*Separation of Concerns*), dividiendo la estructura (HTML5), la presentación visual (CSS3) y la lógica de programación en módulos especializados de JavaScript y jQuery:

```text
proyecto/
│
├── index.html              # Estructura semántica, accesible, formulario y puntos de anclaje
├── estilos.css             # Sistema de diseño con variables CSS, Grid, Flexbox y media queries
│
├── datos.js                # Catálogo multimedia de productos, modelos POO y programación funcional
├── app.js                  # Inicialización del entorno, tipado estricto y verificación de constantes
├── funciones.js            # Funciones puras, closures encapsulados y funciones de orden superior
├── render.js               # Renderizado dinámico del DOM, tarjetas con fallback y carga diferida
├── eventos.js              # Búsqueda reactiva, filtros, validación de formulario y smooth scroll con jQuery
├── jquery-panel.js         # Menú colapsable, acordeón accesible y avisos escalonados (Día 11)
├── jquery-comparado.js     # Script pedagógico comparativo: Vanilla JavaScript vs. jQuery 3.7.1
├── remoto.js               # Carga de datos remotos: JSON, fetch con async/await y $.getJSON con tres estados
├── datos.json              # Catálogo en formato JSON que consume remoto.js (negocio y 8 productos)
│
├── taller.jpg              # Fotografía del taller de servicio técnico equipado
├── ubicacion.jpg           # Mapa físico de localización en la plaza 15 de agosto (Colquencha)
├── capturas/               # Capturas de pantalla de la interfaz en escritorio y móvil (375px)
│   ├── captura-escritorio.png
│   └── captura-movil.png
│
├── README.md               # Guía rápida del repositorio y especificaciones de entrega
└── MEMORIA.md              # Documentación técnica y memoria de cambios del proyecto (este archivo)
```

### 3.1. Orden de Carga de Dependencias en `index.html`
Para garantizar la disponibilidad de selectores y evitar errores de referencia circular, los scripts se cargan al pie del `<body>` en estricto orden secuencial con el atributo `defer`:
1. `https://code.jquery.com/jquery-3.7.1.min.js`: Librería base de jQuery disponible globalmente como `$` y `jQuery`.
2. `app.js`: Variables de entorno y actualización inicial del encabezado.
3. `funciones.js`: Utilidades matemáticas, closures y lógica funcional.
4. `datos.js`: Arreglo de objetos `productos`, clases `Producto` y `ProductoConDescuento`.
5. `render.js`: Constructor de tarjetas del catálogo y poblador del `<select id="servicio">`.
6. `eventos.js`: Controladores de eventos de búsqueda, filtrado, validación y navegación suave.
7. `jquery-panel.js`: Componentes interactivos avanzados del panel informativo (Día 11).
8. `remoto.js`: Carga del catálogo remoto (`datos.json`) con `fetch` y jQuery. Va al final porque usa `$` y los elementos de la sección `#remoto`.

---

## 4. Tecnologías y Librerías Empleadas

| Tecnología | Versión / Tipo | Rol en el Proyecto | Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **HTML5** | Estándar W3C | Estructura semántica | Uso de elementos semánticos nativos (`main`, `section`, `article`, `figure`, `address`), jerarquía estricta de encabezados y atributos ARIA de accesibilidad. |
| **CSS3** | Vanilla CSS | Diseño y Maquetación | Enfoque *Mobile-First*, Custom Properties (`:root`), distribución híbrida (Flexbox para una dimensión, CSS Grid para dos dimensiones) y adaptabilidad responsiva con `@media`. |
| **JavaScript** | ECMAScript 6+ | Lógica de Negocio y POO | Modularidad en capas, inmutabilidad declarativa con `const`, métodos de orden superior (`map`, `filter`, `reduce`), herencia de clases (`extends`) y closures. |
| **jQuery** | 3.7.1 (Minified CDN) | Dinamismo y Efectos | Reducción del código boilerplate en manipulación del DOM, delegación eficiente de eventos (`.on()`), control de colas de animación (`.stop()`) y efectos temporizados. |

---

## 5. Diseño y Maquetación (HTML5 y CSS3)

### 5.1. Semántica y Accesibilidad (HTML5)
- **Jerarquía Única:** Una sola etiqueta `<h1>` representativa en `<header>`, niveles `<h2>` para delimitar cada sección funcional (`#productos`, `#precios`, `#solicitud`, `#panel`, `footer`) y `<h3>` en tarjetas de catálogo y preguntas.
- **Formularios con Validación Universal:** Asociación explícita de controles `<label for="...">` con `<input id="...">`, agrupación lógica con `<fieldset>` y `<legend>`, y uso de atributos semánticos (`required`, `min="1"`, `max="100"`, `pattern="[0-9]{7,8}"`, `type="date"`).
- **Atributos ARIA Dinámicos:**
  - `aria-expanded`: Conmuta entre `"true"` y `"false"` en el botón `#menu-toggle` y en los títulos del `#acordeon`.
  - `aria-controls="menu-movil"`: Vincula formalmente el disparador del menú con el panel colapsable.
  - `aria-live="polite"`: Implementado en `#avisos` para que lectores de pantalla anuncien nuevos avisos sin interrumpir al usuario.
  - `role="region"` y `aria-label`: Contextualizan la sección interactiva de preguntas frecuentes.

### 5.2. Sistema de Diseño (CSS3)
- **Tokens de Diseño en `:root`:**
  - Paleta de marca: Azul noche corporativo (`--color-principal: #0b1f4d`), Azul eléctrico de interacción (`--color-acento: #1f5bff`), Azul oscuro de hover (`--color-acento-osc: #143eb8`), Celeste tecnológico (`--color-acento-2: #00b4ff`), Fondo visualmente relajante (`--color-fondo: #eef3ff`) y Superficie blanca (`--color-superficie: #ffffff`).
  - Espaciado modular: Variables escalables (`--espacio-xs`, `--espacio-sm`, `--espacio`, `--espacio-lg`, `--espacio-xl`).
  - Bordes y sombras: `--radio: 8px` y `--sombra: 0 4px 12px rgba(11, 31, 77, 0.08)`.
- **Estrategia Responsiva Híbrida:**
  - **Flexbox:** Empleado en el menú principal (`nav ul` con `flex-wrap: wrap; gap: var(--espacio)`), en la botonera de filtros (`#filtros`) y en la distribución vertical interna de las tarjetas (`display: flex; flex-direction: column`).
  - **CSS Grid:** Cuadrícula fluida auto-ajustable en productos (`grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))`) y maquetación de pantalla completa con áreas nombradas a partir de `60rem`:
    ```css
    @media (min-width: 60rem) {
      body {
        display: grid;
        grid-template-areas:
          "cabecera cabecera"
          "principal lateral"
          "pie      pie";
        grid-template-columns: 1fr 20rem;
        gap: 0 var(--espacio-lg);
      }
    }
    ```
- **Estilos de los Nuevos Componentes (Día 11):**
  - **Acordeón (`#acordeon`):** Tarjetas con bordes redondeados, sombras tenues y efecto hover (`border-color: var(--color-acento-2)`). El botón `.titulo` utiliza un pseudo-elemento `::after` con transición de contenido entre `"+"` y `"−"` según el atributo `[aria-expanded="true"]`. El contenedor `.cuerpo` inicia oculto (`display: none;`) con fondo suave `#fafcff`.
  - **Bloque de Avisos (`.bloque-avisos`):** Tarjeta contenedor centralizada, botón de acción `#mostrar-avisos` con microinteracción de elevación (`transform: translateY(-2px); box-shadow: 0 6px 18px ...`), y elementos `li` de aviso con borde lateral distintivo de 4px (`border-left: 4px solid var(--color-acento)`).

---

## 6. Lógica y Desarrollo Modular en JavaScript (Vanilla JS)

### 6.1. `app.js` (Entorno y Tipado Estricto)
- Demostración de las diferencias entre `const` (inmutabilidad de referencia y declaración de intención) y `let` (reasignación justificada).
- Comprobación de tipos de datos en consola mediante `typeof`, evaluando las diferencias entre `null` (vacío intencional) y `undefined` (variable declarada sin asignación).
- Uso estricto del operador de identidad triple (`===`) frente al de igualdad doble con coerción implícita (`==`).
- Actualización dinámica del subtítulo en cabecera (`header p`) al momento de cargar el script.

### 6.2. `funciones.js` (Lógica Funcional, Closures y HOF)
- Análisis de valores *truthy* y *falsy* (`0`, `""`, `null`, `undefined`, `[]`).
- Comparativa de las tres formas de declaración de funciones: declarada, por expresión y funciones flecha (*arrow functions*).
- **Funciones de Orden Superior (Higher-Order Functions):** Implementación de `aplicarATodos(lista, fn)` que recibe un array y una función callback para procesar datos sin mutar el arreglo original.
- **Mecanismo de Closures:** Implementación de la función constructora `crearContador()` que encapsula la variable privada `cuenta`, permitiendo instanciar contadores independientes para `equiposRecibidos` y `equiposEntregados`.

### 6.3. `datos.js` (Modelado POO y Métodos de Arreglos)
- **Catálogo Enriquecido con Multimedia:** Definición de un arreglo de 8 objetos reales representativos de TecnoFix, integrando enlaces directos a imágenes de alta definición de Wikimedia Commons (mantenimiento de placa madre, instalador Debian, diagnóstico de laptops, memoria RAM DDR4, pasta térmica aplicada, SSD NVMe, mouse óptico y cables HDMI).
- **Métodos Funcionales Modernos:**
  - `.map()`: Extracción de listas de nombres y proyecciones de precios.
  - `.filter()`: Filtrado de productos disponibles y segmentación por categoría.
  - `.find()`: Localización del primer producto de alta gama (> Bs 300).
  - `.some()` y `.every()`: Verificación de existencias agotadas (`stock === 0`) y precios válidos (`precio > 0`).
  - `.sort()`: Ordenamiento inmutable de catálogo mediante spread operator (`[...productos].sort(...)`).
  - `.reduce()`: Cálculo del inventario total valorizado en almacén y agrupación dinámica por categorías.
- **Programación Orientada a Objetos con Herencia:**
  - Clase base `Producto` con constructor (`nombre`, `precio`, `stock`), y métodos `estaDisponible()` y `valorEnStock()`.
  - Clase extendida `ProductoConDescuento` con llamada a `super()` y método especializado `precioFinal()` calculando descuentos porcentuales.

### 6.4. `render.js` (Construcción Modular del DOM)
- Función modular `render(lista)`: Limpia el contenedor `#lista-productos` y crea dinámicamente las tarjetas mediante `document.createElement("article")`.
- **Tratamiento Multimedia y Tolerancia a Fallos:** Inclusión de imágenes con carga diferida (`loading="lazy"`), etiquetas flotantes de categoría (`.tarjeta-badge`) y fallback inteligente en caso de enlace roto (`onerror="this.onerror=null; this.src='taller.jpg';"`).
- **Población Dinámica del Formulario:** Recorrido automatizado del catálogo de productos para inyectar los elementos `<option>` dentro del `<select id="servicio">`, formateando precios y marcando artículos agotados.

### 6.5. `remoto.js` y `datos.json` (Datos Remotos con `fetch` y jQuery)
- **JSON:** `JSON.parse` convierte un texto en objeto (el precio vuelve como `number`, no como texto) y `JSON.stringify` hace el camino inverso.
- **Los tres estados:** la función `mostrarEstado(texto, tipo)` escribe el mensaje en `#estado` y cambia su clase (`cargando`, `ok`, `error`); el color y la animación los pone `estilos.css`, no el JavaScript. El elemento usa `role="status"` y `aria-live="polite"` para que el lector de pantalla anuncie el cambio.
- **`fetch` con `async/await`:** `cargarConFetch(url = "datos.json")` espera la respuesta, lanza un `Error` si `respuesta.ok` es falso (un 404 no hace fallar a `fetch` por sí solo) y todo queda dentro de `try/catch`. Si algo falla, se muestra el mensaje y se vacía la lista.
- **Botón de error a propósito:** `#cargar-roto` llama a la misma función con `no-existe.json` para ver el estado de error (`El servidor respondió 404`).
- **Lo mismo con jQuery:** `$.getJSON("datos.json")` con `.done()`, `.fail()` y `.always()`, que equivalen al `try`, al `catch` y a la limpieza final.
- **Pintado:** `pintarRemoto(productos)` reutiliza las clases `.tarjeta`, `.precio`, `.stock` y `.agotado`, así que las tarjetas remotas se ven igual que las del catálogo local.
- **`datos.json`:** objeto con `negocio` (nombre, ciudad y teléfono) y el arreglo `productos` (los mismos 8 de `datos.js`, con el campo extra `unidad`).
- **Requisito:** debe abrirse desde un servidor (Live Server o `http://localhost:8080`, configurado en `.vscode/launch.json`). Con `file://` el navegador bloquea `fetch` y `$.getJSON`.

---

## 7. Implementación de jQuery en el Proyecto

Se integró **jQuery 3.7.1** como biblioteca de interacción visual y gestión de eventos.

### 7.1. Búsqueda Reactiva en Tiempo Real (`eventos.js`)
El evento nativo de teclado se captura con `.on("input")`, disparando la actualización en vivo del DOM a medida que el usuario escribe, sin recargar la página:
```javascript
$("#buscador").on("input", function () {
  textoBuscado = $(this).val();
  actualizar();
});
```

### 7.2. Delegación de Eventos en Filtros por Categoría (`eventos.js`)
Uso del patrón de delegación para escuchar clics en los botones de filtro dentro de `#filtros`:
```javascript
$("#filtros").on("click", "button", function () {
  const $boton = $(this);
  categoriaActiva = $boton.data("categoria");

  $filtros.find("button").removeClass("activo");
  $boton.addClass("activo");

  actualizar();
});
```

### 7.3. Micro-animaciones en Tarjetas (`eventos.js`)
Al actualizar el catálogo filtrado, las tarjetas generadas se presentan con una transición fluida de opacidad usando `.fadeIn(200)`:
```javascript
$("#lista-productos .tarjeta").hide().fadeIn(200);
```

### 7.4. Gestión del Formulario y Feedback Animado (`eventos.js`)
Intercepción del envío con `event.preventDefault()`, validación de fecha mínima contra la fecha actual (`setCustomValidity`) y presentación del mensaje de confirmación con `.slideDown(350)`:
```javascript
$resultado
  .hide()
  .html(`🎉 <strong>¡Gracias ${datos.nombre}!</strong> Tu solicitud para <em>${datos.servicio}</em> fue registrada.`)
  .slideDown(350);
```

### 7.5. Navegación Suave (*Smooth Scroll*) (`eventos.js`)
Desplazamiento vertical calculado con compensación de 20 píxeles hacia cualquier sección anclada mediante la animación de jQuery:
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

---

## 8. Novedades y Cambios Desarrollados Hoy (Día 11: `jquery-panel.js` y `jquery-comparado.js`)

Durante la jornada de hoy (Día 11) se implementaron las siguientes características y componentes avanzados en el proyecto:

### 8.1. Menú Desplegable Accesible para Dispositivos Móviles
- **Objetivo:** Permitir desplegar y replegar la barra de navegación en teléfonos y pantallas pequeñas sin sobrecargar visualmente el encabezado.
- **Implementación Técnica:**
  - Botón `#menu-toggle` integrado en `index.html` con atributos `aria-expanded="false"` y `aria-controls="menu-movil"`.
  - Uso exclusivo del método `.on("click")` (descartando los atajos obsoletos como `.click()`).
  - Animación con `.slideToggle(200)`.
  - **Sincronización de Accesibilidad Real:** El valor de `aria-expanded` se obtiene e invierte leyendo directamente el estado del DOM (`$(this).attr("aria-expanded") === "true"`), evitando variables globales que puedan desincronizarse:
  ```javascript
  $("#menu-toggle").on("click", function () {
    const $menu = $("#menu-movil");
    $menu.slideToggle(200);
    const abierto = $(this).attr("aria-expanded") === "true";
    $(this).attr("aria-expanded", !abierto);
  });
  ```

### 8.2. Acordeón Interactivo con Control Anti-Rebote (`#acordeon`)
- **Objetivo:** Organizar las preguntas frecuentes del taller TecnoFix en Colquencha de forma ordenada, desplegando únicamente la duda seleccionada.
- **Preguntas Técnicas Incluidas:**
  1. *Tiempos de entrega:* 24 horas para preventivo y 48 a 72 horas para diagnósticos electrónicos.
  2. *Garantías:* 30 días de cobertura en mano de obra y 3 a 6 meses de garantía de fábrica en repuestos originales.
  3. *Recomendaciones:* Respaldo preventivo de información y entrega de cargadores originales de laptop.
  4. *Servicio a domicilio:* Atención en taller en Colquencha (a media cuadra de la plaza 15 de agosto) y visitas técnicas a escuelas y negocios de la región.
- **Solución al Bug Clásico de Encolamiento de jQuery (`.stop()`):**
  Al pulsar rápidamente sobre una pregunta, jQuery acumula las animaciones en una cola interna, provocando que el panel se abra y cierre reiteradas veces de forma descontrolada. Se implementó `.stop(true, true)` antes de ejecutar cualquier animación para limpiar inmediatamente la cola pendiente.
- **Repliegue Exclusivo con `.not()`:**
  Al abrir un panel, los paneles hermanos se repliegan automáticamente y su atributo `aria-expanded` se restablece a `"false"`:
  ```javascript
  $("#acordeon").on("click", ".titulo", function () {
    const $titulo = $(this);
    const $cuerpo = $titulo.next(".cuerpo");

    $cuerpo.stop(true, true).slideToggle(200);
    $titulo.attr("aria-expanded", $titulo.attr("aria-expanded") !== "true");

    $("#acordeon .cuerpo").not($cuerpo).stop(true, true).slideUp(200);
    $("#acordeon .titulo").not($titulo).attr("aria-expanded", "false");
  });
  ```

### 8.3. Lista de Avisos con Animación Escalonada (`#avisos`)
- **Objetivo:** Mostrar los comunicados del taller (horarios de fin de semana, promociones de pasta térmica, nuevo instrumental de soldadura y llegada de discos SSD) con una secuencia visualmente atractiva.
- **Implementación Técnica:**
  - Recorrido secuencial de la lista mediante `.each(function(indice))`.
  - Aplicación de un retraso progresivo con `.delay(indice * 120)` para que cada elemento inicie su animación en instantes distintos antes del `.fadeIn(250)`.
  - Conmutación del texto del botón entre *"Mostrar avisos"* y *"Ocultar avisos"*.
  - Uso de `.off("click").on("click")` para desvincular el evento anterior y evitar la acumulación exponencial de controladores de clic.
  - Ocultamiento ágil mediante `.fadeOut(200)`:
  ```javascript
  function configurarAvisos() {
    $("#mostrar-avisos").off("click").on("click", function () {
      $("#avisos li").each(function (indice) {
        $(this).stop(true, true).delay(indice * 120).fadeIn(250);
      });

      $(this).text("Ocultar avisos").off("click").on("click", function () {
        $("#avisos li").stop(true, true).fadeOut(200);
        $(this).text("Mostrar avisos");
        configurarAvisos();
      });
    });
  }
  configurarAvisos();
  ```

### 8.4. Función Encadenable Personalizada y Principio de Plugins
- Se implementó la función utilitaria `resaltar($seleccion, milisegundos)` que añade temporalmente la clase CSS `.resaltado` y retorna la selección original de jQuery (`return $seleccion`), permitiendo encadenar métodos posteriores como `.css()`:
  ```javascript
  function resaltar($seleccion, milisegundos = 1200) {
    $seleccion.addClass("resaltado");
    setTimeout(() => $seleccion.removeClass("resaltado"), milisegundos);
    return $seleccion;
  }

  resaltar($("#panel h2")).css("letter-spacing", "0.5px");
  ```
- Se documentó el principio de construcción de plugins sobre `$.fn` (métodos de instancia de jQuery) que devuelven `this` al terminar para habilitar el encadenamiento (*chaining*).

### 8.5. Laboratorio Práctico Comparativo: Vanilla JS vs. jQuery (`jquery-comparado.js`)
Se elaboró un módulo didáctico de evaluación directa entre ambos paradigmas:

| Tarea de Desarrollo | Vanilla JavaScript (Nativo) | jQuery 3.7.1 |
| :--- | :--- | :--- |
| **Selección de nodo único** | `document.querySelector("#salida")` | `$("#salida")` |
| **Tipo de objeto retornado** | `HTMLElement` (nodo nativo del DOM) | Objeto envoltorio (`wrapper`) tipo colección con propiedad `.length` |
| **Lectura/Escritura de texto** | `.textContent = "..."` | `.text("...")` |
| **Gestión de clases CSS** | `.classList.add()` / `.classList.toggle()` | `.addClass()` / `.toggleClass()` |
| **Asignación de eventos** | `.addEventListener("click", callback)` | `.on("click", callback)` |
| **Encadenamiento (*Chaining*)** | Imperativo paso a paso con variables intermedias | Fluido y continuo: `$("#el").addClass().attr().css()` |
| **Selección múltiple** | `document.querySelectorAll(".tarjeta")` (NodeList estática) | `$(".tarjeta")` (Colección dinámica y métodos en bloque) |

---

## 9. Seguridad, Validación y Robustez de Datos

1. **Restricciones Semánticas Nativas:**
   - Campo de correo con `type="email"` para validación de formato según el estándar RFC 5322.
   - Cantidad de equipos restringida entre `min="1"` y `max="100"` mediante `type="number"`.
   - Casilla de verificación de aceptación de términos obligatoria (`required`).
2. **Validación de Fechas en Tiempo de Ejecución:**
   - Control en JavaScript para impedir la selección de fechas pasadas mediante `new Date().toISOString().slice(0, 10)` y el método `.setCustomValidity()` en el elemento nativo del DOM.
3. **Expresiones Regulares (`RegExp`):**
   - **Teléfono móvil/fijo:** `/^[0-9]{7,8}$/` (números válidos en Bolivia de 7 a 8 dígitos numéricos).
   - **Correo electrónico corporativo/personal:** `/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i`.
   - **Cédula de Identidad (CI):** `/^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/` (formato con o sin extensión alfanumérica de departamento/complemento).
4. **Tolerancia a Fallos Multimedia:**
   - Las imágenes del catálogo integran el manejador nativo en línea `onerror="this.onerror=null; this.src='taller.jpg';"`, evitando espacios en blanco si un recurso externo de Wikimedia experimenta intermitencia.

---

## 10. Registro Cronológico de Desarrollo (Bitácora de Sesiones / Git Log)

A continuación se resume la evolución técnica del proyecto registrada en el historial del repositorio:

| Sesión / Hito | Descripción del Avance | Archivos Clave Afectados |
| :---: | :--- | :--- |
| **Sesión 1** | Versión inicial del proyecto: esqueleto HTML base de TecnoFix. | `index.html` |
| **Sesión 2** | Incorporación de la tabla de tarifas, horarios, imágenes y formulario accesible. | `index.html`, `taller.jpg`, `ubicacion.jpg` |
| **Sesión 3** | Creación de la hoja de estilos (`estilos.css`), definición de paleta de colores y variables `:root`. | `estilos.css` |
| **Sesión 4** | Implementación de maquetación híbrida con Flexbox y CSS Grid. Enfoque mobile-first. | `estilos.css` |
| **Sesión 5** | Creación del archivo `README.md`, captura de pantallas en escritorio y móvil (375px), optimización visual. | `README.md`, `capturas/` |
| **Sesión 6** | Módulos JavaScript iniciales: `app.js` (tipos/constantes), `funciones.js` (closures/HOF) y `datos.js`. | `app.js`, `funciones.js`, `datos.js` |
| **Sesión 7** | Integración del módulo de eventos nativos y primeras pruebas dinámicas. | `eventos.js` |
| **Sesión 8** | Laboratorio comparativo de sintaxis Vanilla JavaScript vs. jQuery (`jquery-comparado.js`). | `jquery-comparado.js`, `index.html` |
| **Sesión 9 (HOY - Día 11)** | **Implementación avanzada de jQuery y componentes profesionales:**<br>• Desarrollo de `jquery-panel.js` (menú desplegable, acordeón con `.stop(true, true)`, avisos escalonados con `.delay()` y función encadenable `resaltar()`).<br>• Incorporación de la sección `#panel` en `index.html` con 4 preguntas frecuentes reales de TecnoFix.<br>• Catálogo multimedia enriquecido con fotos reales de hardware en `datos.js` y renderizado tolerante a fallos (`onerror`) en `render.js`.<br>• Actualización integral de diseño en `estilos.css` (estilos para acordeón, avisos y microinteracciones).<br>• Sincronización completa de la documentación técnica en `README.md` y `MEMORIA.md`. | `jquery-panel.js`, `jquery-comparado.js`, `index.html`, `estilos.css`, `datos.js`, `render.js`, `eventos.js`, `README.md`, `MEMORIA.md` |
| **Sesión 10** | **Datos remotos:** creación de `remoto.js` y `datos.json` (JSON, `fetch` con `async/await`, `$.getJSON` y los tres estados de carga), nueva sección `#remoto` en el HTML y sus estilos. | `remoto.js`, `datos.json`, `index.html`, `estilos.css` |

---

## 11. Dificultades Encontradas y Soluciones Técnicas

1. **Desbordamiento de controles de navegación en pantallas ultra estrechas (360px - 400px):**
   - *Problema:* Los botones de navegación se salían del margen derecho en dispositivos móviles.
   - *Solución:* Se aplicó `flex-wrap: wrap` con espaciado relativo `gap: 0.5rem` en `nav ul`, respaldado por el botón conmutador `#menu-toggle` que despliega el menú bajo demanda.
2. **Desincronización entre catálogo, filtros y select del formulario:**
   - *Problema:* Al buscar por texto o categoría, el select del formulario no reflejaba los artículos disponibles o mostraba elementos agotados sin advertencia.
   - *Solución:* Se modularizó la lógica en `render.js` para poblar el `<select>` con indicación explícita `(Agotado)` en aquellos artículos con `stock === 0`, y se centralizó el redibujado de la cuadrícula en una función pura `actualizar()`.
3. **Encolamiento descontrolado de animaciones al pulsar reiteradamente el acordeón:**
   - *Problema:* Si el usuario hacía clics consecutivos rápidos en las preguntas, jQuery encolaba múltiples transiciones `.slideToggle()`, haciendo que el acordeón se abriera y cerrara solo durante varios segundos.
   - *Solución:* Se antepuso el método `.stop(true, true)` antes de ejecutar cualquier animación, cancelando la cola en curso y llevando el elemento a su posición final instantáneamente antes de la nueva transición.
4. **Desincronización de accesibilidad en el menú desplegable:**
   - *Problema:* Mantener una variable booleana en JavaScript provocaba que tras redimensionar la ventana o pulsar la tecla Escape, el valor de `aria-expanded` quedara invertido.
   - *Solución:* Se configuró la lectura directa del atributo en el DOM (`$(this).attr("aria-expanded") === "true"`), asegurando coherencia absoluta para las tecnologías de asistencia.
5. **Acumulación de escuchadores de eventos al alternar botones de avisos:**
   - *Problema:* Al cambiar el texto de *"Mostrar avisos"* a *"Ocultar avisos"*, asociar un nuevo `.on("click")` sin remover el previo ejecutaba ambas funciones en los clics posteriores.
   - *Solución:* Se empleó la combinación `.off("click").on("click")` para desvincular limpiamente los listeners anteriores antes de registrar el nuevo comportamiento.
6. **Fallo de enlaces en imágenes externas del catálogo:**
   - *Problema:* Si una URL de Wikimedia Commons fallaba por conectividad o bloqueo, la tarjeta mostraba un recuadro roto antiestético.
   - *Solución:* Se programó un manejador en línea `onerror="this.onerror=null; this.src='taller.jpg';"` en `render.js`, redirigiendo automáticamente a la foto local del taller como fallback visual.

---

## 12. Conclusiones y Próximos Pasos

- El proyecto **TecnoFix Servicio Técnico** ha alcanzado una madurez notable, integrando una arquitectura modular limpia donde HTML5 semántico, CSS3 moderno y jQuery 3.7.1 colaboran armónicamente sin redundancias.
- La incorporación de componentes dinámicos en la jornada de hoy (menú desplegable, acordeón de preguntas frecuentes con prevención de colas y lista de avisos con animación escalonada) dotó al sitio de una experiencia de usuario (UX) ágil, profesional y accesible.
- **Criterio Técnico (jQuery vs. CSS3 vs. Vanilla JS):** Se constató que para microinteracciones visuales simples (como hovers y transiciones de color), CSS3 nativo es superior en rendimiento gráfico; mientras que jQuery resulta idóneo cuando la animación depende de lógica temporal, secuencias escalonadas (`.delay()`), cálculo de eventos y control de flujo condicional.
- **Proyecciones Futuras:**
  - Integración de persistencia local mediante `localStorage` o `sessionStorage` para almacenar borradores de solicitudes de servicio técnico.
  - Conexión con un backend (Node.js / Express o PHP) con base de datos relacional para el registro definitivo de órdenes de trabajo y notificaciones por WhatsApp o correo electrónico.
