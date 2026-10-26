// ── IMPLEMENTACIÓN CON JQUERY ──────────────────────────────────────────────
$(function () {
  console.log("jQuery listo y funcionando. Versión:", $.fn.jquery);

  // ── 1. SELECTORES PRINCIPALES CON JQUERY ─────────────────────────────────
  const $buscador = $("#buscador");
  const $filtros = $("#filtros");
  const $resultado = $("#resultado");
  const $formulario = $("form");

  let categoriaActiva = "todos";
  let textoBuscado = "";

  // ── 2. ACTUALIZAR Y RENDERIZAR PRODUCTOS CON ANIMACIONES ──────────────────
  function actualizar() {
    if (typeof productos === "undefined" || typeof render !== "function") return;

    const visibles = productos
      .filter(p => categoriaActiva === "todos" || p.categoria === categoriaActiva)
      .filter(p => p.nombre.toLowerCase().includes(textoBuscado.toLowerCase()));

    // Renderizamos las tarjetas usando la función modular
    render(visibles);

    // Actualizamos el contador dinámico
    $resultado.text(`${visibles.length} de ${productos.length} productos disponibles`);

    // Animación suave de aparición en las tarjetas con jQuery
    $("#lista-productos .tarjeta").hide().fadeIn(200);
  }

  // Ejecución inicial
  actualizar();

  // ── 3. BÚSQUEDA REACTIVA EN TIEMPO REAL CON .on("input") ──────────────────
  $buscador.on("input", function () {
    textoBuscado = $(this).val();
    actualizar();
  });

  // ── 4. FILTRADO CON DELEGACIÓN DE EVENTOS EN JQUERY ──────────────────────
  $filtros.on("click", "button", function () {
    const $boton = $(this);
    categoriaActiva = $boton.data("categoria");

    // Gestión ágil de clases con jQuery
    $filtros.find("button").removeClass("activo");
    $boton.addClass("activo");

    actualizar();
  });

  // ── 5. FORMULARIO: VALIDACIÓN Y FEEDBACK ANIMADO CON JQUERY ───────────────
  $formulario.on("submit", function (event) {
    event.preventDefault();

    const formElement = this;
    if (!formElement.reportValidity()) {
      return;
    }

    const $fecha = $("#fecha");
    const hoy = new Date().toISOString().slice(0, 10);

    if ($fecha.val() < hoy) {
      $fecha[0].setCustomValidity("La fecha de entrega no puede ser anterior a hoy.");
      $fecha[0].reportValidity();

      $fecha.one("input", function () {
        this.setCustomValidity("");
      });
      return;
    }

    const datos = Object.fromEntries(new FormData(formElement));
    console.log("Pedido recibido:", datos);

    // Mensaje de éxito animado con slideDown
    $resultado
      .hide()
      .html(`🎉 <strong>¡Gracias ${datos.nombre}!</strong> Tu solicitud para <em>${datos.servicio}</em> fue registrada.`)
      .slideDown(350);

    formElement.reset();
  });

  // ── 6. NAVEGACIÓN CON SCROLL SUAVE MEDIANTE JQUERY ─────────────────────────
  $("header nav a").on("click", function (event) {
    const destinoId = $(this).attr("href");
    if (destinoId && destinoId.startsWith("#")) {
      const $destino = $(destinoId);
      if ($destino.length) {
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: $destino.offset().top - 20,
          },
          500
        );
      }
    }
  });

  // ── 7. VALIDACIÓN CON EXPRESIONES REGULARES ───────────────────────────────
  const PATRONES = {
    telefono: /^[0-9]{7,8}$/,
    correo: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
    ci: /^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/,
  };

  console.log("70123456 válido:", PATRONES.telefono.test("70123456"));
  console.log("7012 válido:", PATRONES.telefono.test("7012"));
  console.log("ana@correo.bo válido:", PATRONES.correo.test("ana@correo.bo"));
});
