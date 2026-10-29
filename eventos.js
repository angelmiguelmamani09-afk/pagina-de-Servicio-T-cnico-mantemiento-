// ── IMPLEMENTACIÓN CON JQUERY ──────────────────────────────────────────────
const WHATSAPP = "59168009791";   // 591 (Bolivia) + 68009791
const sinTildes = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// Fecha de HOY en hora local (toISOString usa UTC y en Bolivia "adelanta" el día desde las 20:00)
const hoyLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };

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
      .filter(p => sinTildes(p.nombre).includes(sinTildes(textoBuscado.trim())));

    // Orden elegido en "Preferencias" (antes se guardaba pero no se aplicaba)
    const orden = (typeof preferencias !== "undefined" && preferencias.orden) || "nombre";
    visibles.sort(orden === "precio" ? (a, b) => a.precio - b.precio : (a, b) => a.nombre.localeCompare(b.nombre, "es"));

    // Renderizamos las tarjetas usando la función modular
    render(visibles);

    // Actualizamos el contador dinámico
    $resultado.text(`Mostrando ${visibles.length} de ${productos.length}`);

    // Animación suave de aparición en las tarjetas con jQuery
    $("#lista-productos .tarjeta").hide().fadeIn(200);
  }

  document.addEventListener("preferencias:cambio", actualizar);
  $("#fecha").attr("min", hoyLocal());

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

  // ── 5. FORMULARIO: valida y envía la solicitud por WhatsApp ──────────────
  $formulario.on("submit", function (event) {
    event.preventDefault();
    const f = this;
    const $fecha = $("#fecha");
    $fecha[0].setCustomValidity("");
    if (!f.reportValidity()) return;

    if ($fecha.val() < hoyLocal()) {
      $fecha[0].setCustomValidity("La fecha de recepción no puede ser anterior a hoy.");
      $fecha[0].reportValidity();
      $fecha.one("input", function () { this.setCustomValidity(""); });
      return;
    }

    const d = Object.fromEntries(new FormData(f));
    const texto = `Hola TecnoFix, quiero solicitar un servicio.\n` +
      `• Nombre: ${d.nombre}\n• Teléfono: ${d.telefono || "-"}\n• Correo: ${d.email}\n` +
      `• Servicio: ${$("#servicio option:selected").text()}\n• Equipos: ${d.cantidad}\n` +
      `• Fecha de recepción: ${d.fecha}\n• Falla: ${d.notas || "-"}`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener");

    // .text() evita inyectar HTML con lo que escribió el usuario
    $("#mensaje-form").prop("hidden", false).empty()
      .append($("<strong>").text(`¡Gracias, ${d.nombre}! `),
        "Abrimos WhatsApp con tu solicitud lista para enviar. ",
        $("<a>", { href: url, target: "_blank", rel: "noopener" }).text("¿No se abrió? Toca aquí."))
      .hide().slideDown(350);
    f.reset();
  });

  // ── 6. NAVEGACIÓN CON SCROLL SUAVE MEDIANTE JQUERY ─────────────────────────
  $("header nav a").on("click", function (event) {
    const destinoId = $(this).attr("href");
    if (destinoId && destinoId.startsWith("#")) {
      const $destino = $(destinoId);
      if ($destino.length) {
        event.preventDefault();
        if ($("#menu-toggle").is(":visible")) {   // cierra el menú en móvil
          $("#menu-movil").slideUp(150);
          $("#menu-toggle").attr("aria-expanded", "false");
        }
        $("html, body").animate(
          {
            scrollTop: $destino.offset().top - ($(".topbar").outerHeight() || 0) - 8,
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
