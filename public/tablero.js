// ══ TABLERO DEL CLIENTE: "ARMA TU PEDIDO" (Día 14: Drag & Drop + Canvas) ═══
// El cliente arrastra servicios y repuestos entre tres columnas y ve cuánto va a pagar.
// Los productos salen de datos.js (variable `productos`): si cambias un precio ahí, se actualiza aquí.
const COLUMNAS = ["disponibles", "pedido"];
const ETIQUETAS = { disponibles: "Disponibles", pedido: "Mi pedido" };
const CATEGORIAS = ["servicios", "repuestos", "accesorios"];
const CLAVE_TABLERO = "tecnofix:pedido";
const NUMERO_TALLER = "59168009791";

const buscarProducto = (nombre) => productos.find((p) => p.nombre === nombre);
const bs = (n) => `Bs ${n.toFixed(2)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// ── ESTADO: qué ficha está en qué columna (el DOM solo lo muestra) ──────
function tableroInicial() {
  return { disponibles: productos.map((p) => ({ nombre: p.nombre, cantidad: 1, nota: "" })), pedido: [] };
}

// Se guarda en el navegador; al cargar se reconcilia con el catálogo actual
// (si borraste un producto de datos.js desaparece; si agregaste uno nuevo aparece en "Disponibles").
// Si quedó guardado algo de la antigua columna "Lo pensaré", vuelve a "Disponibles".
function cargarTablero() {
  let t = tableroInicial();
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_TABLERO));
    if (guardado && COLUMNAS.every((c) => Array.isArray(guardado[c]))) {
      const vistos = new Set();
      t = { disponibles: [], pedido: [] };
      COLUMNAS.forEach((c) => guardado[c].forEach((f) => {
        if (buscarProducto(f.nombre) && !vistos.has(f.nombre)) {
          vistos.add(f.nombre);
          t[c].push({ nombre: f.nombre, cantidad: Math.max(1, Number(f.cantidad) || 1), nota: String(f.nota || "") });
        }
      }));
      productos.filter((p) => !vistos.has(p.nombre)).forEach((p) => t.disponibles.push({ nombre: p.nombre, cantidad: 1, nota: "" }));
    }
  } catch (e) { /* sin storage o dato dañado: se usa el inicial */ }
  return t;
}
function guardarTablero() {
  try { localStorage.setItem(CLAVE_TABLERO, JSON.stringify(tablero)); } catch (e) { /* ignorar */ }
}
let tablero = cargarTablero();

const subtotal = (f) => buscarProducto(f.nombre).precio * f.cantidad;
const totalColumna = (c) => tablero[c].reduce((s, f) => s + subtotal(f), 0);
const totalPedido = () => totalColumna("pedido");

const mensaje = document.querySelector("#mensaje-tablero");
function avisar(texto) { if (mensaje) mensaje.textContent = texto; }

// ── 1. ACCIONES DEL CLIENTE (todas modifican el estado y vuelven a pintar) ─
function moverFicha(origen, indice, destino) {
  if (origen === destino) return;
  const ficha = tablero[origen][indice];
  if (!ficha) return;
  const prod = buscarProducto(ficha.nombre);
  if (destino === "pedido" && !prod.disponible) {
    avisar(`"${prod.nombre}" está agotado por ahora. Consúltanos por WhatsApp para pedirlo.`);
    return;
  }
  tablero[origen].splice(indice, 1);
  if (destino === "disponibles") { ficha.cantidad = 1; ficha.nota = ""; }
  tablero[destino].push(ficha);
  avisar(`${prod.nombre}: movido a "${ETIQUETAS[destino]}".`);
  guardarTablero();
  renderTablero();
}

function cambiarCantidad(indice, delta) {
  const ficha = tablero.pedido[indice];
  if (!ficha) return;
  const max = Math.max(1, buscarProducto(ficha.nombre).stock);
  ficha.cantidad = Math.min(max, Math.max(1, ficha.cantidad + delta));
  guardarTablero();
  renderTablero();
}

function vaciarPedido() {
  while (tablero.pedido.length) moverFicha("pedido", 0, "disponibles");
  avisar("Pedido vaciado.");
}

function resumenPedido() {
  const lineas = tablero.pedido.map((f) =>
    `• ${f.cantidad} × ${f.nombre} (${bs(subtotal(f))})${f.nota ? ` — ${f.nota}` : ""}`);
  return `Hola TecnoFix, quiero este pedido:\n${lineas.join("\n")}\nTotal: ${bs(totalPedido())}`;
}

// ── 2. PINTAR EL TABLERO ────────────────────────────────────────────────
function crearBoton(texto, etiqueta, accion) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = texto;
  b.setAttribute("aria-label", etiqueta);
  b.addEventListener("click", accion);
  return b;
}

function crearFicha(item, indice, columna, pos) {
  const prod = buscarProducto(item.nombre);
  const li = document.createElement("li");
  li.className = "ficha" + (prod.disponible ? "" : " agotada");
  li.draggable = true;
  li.dataset.columna = columna;
  li.dataset.indice = indice;

  const fila = document.createElement("div");
  fila.className = "ficha-fila";
  const nombre = document.createElement("span");
  nombre.className = "nombre";
  nombre.textContent = item.nombre;
  const detalle = document.createElement("small");
  detalle.textContent = prod.disponible ? `${bs(prod.precio)} · ${prod.categoria}` : `${bs(prod.precio)} · Agotado`;
  nombre.append(detalle);

  // Flechas: alternativa para celular y teclado, donde arrastrar no funciona
  if (pos > 0) fila.append(crearBoton("◀", `Mover ${item.nombre} a ${ETIQUETAS[COLUMNAS[pos - 1]]}`, () => moverFicha(columna, indice, COLUMNAS[pos - 1])));
  fila.append(nombre);
  if (pos < COLUMNAS.length - 1) fila.append(crearBoton("▶", `Mover ${item.nombre} a ${ETIQUETAS[COLUMNAS[pos + 1]]}`, () => moverFicha(columna, indice, COLUMNAS[pos + 1])));
  li.append(fila);

  // Solo en "Mi pedido": cantidad, nota libre (ej. "cambiar a 16 GB") y quitar
  if (columna === "pedido") {
    const extra = document.createElement("div");
    extra.className = "ficha-extra";
    const cant = document.createElement("span");
    cant.className = "cantidad";
    cant.textContent = item.cantidad;
    cant.setAttribute("aria-label", `Cantidad: ${item.cantidad}`);
    const sub = document.createElement("strong");
    sub.className = "subtotal";
    sub.textContent = bs(subtotal(item));
    extra.append(
      crearBoton("−", `Menos ${item.nombre}`, () => cambiarCantidad(indice, -1)), cant,
      crearBoton("+", `Más ${item.nombre}`, () => cambiarCantidad(indice, 1)), sub,
      crearBoton("✕", `Quitar ${item.nombre} del pedido`, () => moverFicha("pedido", indice, "disponibles"))
    );
    const nota = document.createElement("input");
    nota.type = "text";
    nota.className = "nota-ficha";
    nota.maxLength = 80;
    nota.placeholder = "Detalle (ej. memoria de 16 GB, laptop HP)";
    nota.value = item.nota;
    nota.setAttribute("aria-label", `Detalle para ${item.nombre}`);
    nota.addEventListener("input", () => { item.nota = nota.value; guardarTablero(); });
    li.append(extra, nota);
  }
  return li;
}


// ── 2b. REDONDOS: cada cosa elegida se ve como un círculo con su foto ────
const FOTO_RESPALDO = "taller.jpg";
function renderRedondos() {
  const caja = document.querySelector("#redondos");
  if (!caja) return;
  caja.innerHTML = "";
  tablero.pedido.forEach((item, indice) => {
    const prod = buscarProducto(item.nombre);
    const art = document.createElement("li");
    art.className = "redondo";
    art.title = `${item.nombre} · ${bs(subtotal(item))}`;

    const marco = document.createElement("div");
    marco.className = "redondo-foto";
    const img = document.createElement("img");
    img.src = prod.imagen || FOTO_RESPALDO;
    img.alt = item.nombre;
    img.loading = "lazy";
    img.addEventListener("error", () => { img.src = FOTO_RESPALDO; }, { once: true });
    marco.append(img);
    if (item.cantidad > 1) {
      const cant = document.createElement("span");
      cant.className = "redondo-cant";
      cant.textContent = `×${item.cantidad}`;
      marco.append(cant);
    }
    const quitar = crearBoton("✕", `Quitar ${item.nombre} del pedido`, () => moverFicha("pedido", indice, "disponibles"));
    quitar.className = "redondo-quitar";

    const nombre = document.createElement("span");
    nombre.className = "redondo-nombre";
    nombre.textContent = item.nombre;
    const precio = document.createElement("small");
    precio.textContent = bs(subtotal(item));

    art.append(marco, quitar, nombre, precio);
    caja.append(art);
  });
  const vacio = document.querySelector("#redondos-vacio");
  if (vacio) vacio.hidden = tablero.pedido.length > 0;
  const total = document.querySelector("#redondos-total");
  if (total) total.textContent = `${plural(tablero.pedido.length, "elegido", "elegidos")} · ${bs(totalPedido())}`;
}

function renderTablero() {
  COLUMNAS.forEach((nombreColumna, pos) => {
    const columna = document.querySelector(`[data-columna="${nombreColumna}"]`);
    const lista = columna.querySelector(".lista-columna");
    lista.innerHTML = "";
    tablero[nombreColumna].forEach((item, indice) => lista.append(crearFicha(item, indice, nombreColumna, pos)));

    const n = tablero[nombreColumna].length;
    columna.querySelector(".total").textContent = nombreColumna === "disponibles"
      ? plural(n, "opción", "opciones")
      : `${plural(n, "ítem", "ítems")} · ${bs(totalColumna(nombreColumna))}`;
  });

  renderRedondos();
  document.querySelector("#total-pedido").textContent = bs(totalPedido());
  const vacio = tablero.pedido.length === 0;
  document.querySelectorAll("#acciones-pedido button").forEach((b) => { b.disabled = vacio; });
  animarGrafico();
}

// ── 3. DRAG & DROP: LOS EVENTOS, EN ORDEN ───────────────────────────────
const elTablero = document.querySelector("#tablero");

elTablero.addEventListener("dragstart", (event) => {
  const ficha = event.target.closest(".ficha");
  if (!ficha) return;
  event.dataTransfer.setData("text/plain", JSON.stringify({ columna: ficha.dataset.columna, indice: Number(ficha.dataset.indice) }));
  event.dataTransfer.effectAllowed = "move";
  ficha.classList.add("arrastrando");
});
elTablero.addEventListener("dragend", (event) => {
  const ficha = event.target.closest(".ficha");
  if (ficha) ficha.classList.remove("arrastrando");
  document.querySelectorAll(".columna").forEach((c) => c.classList.remove("encima"));
});
elTablero.addEventListener("dragover", (event) => {
  const columna = event.target.closest(".columna[data-columna]");
  if (!columna) return;
  event.preventDefault();                       // sin esto el navegador no permite soltar
  event.dataTransfer.dropEffect = "move";
  columna.classList.add("encima");
});
elTablero.addEventListener("dragleave", (event) => {
  const columna = event.target.closest(".columna");
  if (columna && !columna.contains(event.relatedTarget)) columna.classList.remove("encima");
});
elTablero.addEventListener("drop", (event) => {
  const columna = event.target.closest(".columna[data-columna]");
  if (!columna) return;
  event.preventDefault();
  columna.classList.remove("encima");
  try {
    const origen = JSON.parse(event.dataTransfer.getData("text/plain"));
    moverFicha(origen.columna, origen.indice, columna.dataset.columna);
  } catch (e) { /* se soltó algo que no era una ficha */ }
});
// Un campo de texto dentro de un elemento "draggable" no deja seleccionar texto:
// mientras se escribe, la ficha deja de ser arrastrable.
elTablero.addEventListener("focusin", (e) => { if (e.target.matches(".nota-ficha")) e.target.closest(".ficha").draggable = false; });
elTablero.addEventListener("focusout", (e) => { if (e.target.matches(".nota-ficha")) e.target.closest(".ficha").draggable = true; });

// ── 4. ENVIAR EL PEDIDO ─────────────────────────────────────────────────
document.querySelector("#enviar-whatsapp").addEventListener("click", () => {
  window.open(`https://wa.me/${NUMERO_TALLER}?text=${encodeURIComponent(resumenPedido())}`, "_blank", "noopener");
});
document.querySelector("#llevar-formulario").addEventListener("click", () => {
  const notas = document.querySelector("#notas");
  if (notas) notas.value = resumenPedido();
  document.querySelector("#solicitud").scrollIntoView({ behavior: "smooth" });
  avisar("Pedido copiado en el formulario de solicitud. Completa tus datos y envíalo.");
});
document.querySelector("#vaciar-pedido").addEventListener("click", vaciarPedido);

// ── 5. CANVAS: gasto del pedido por categoría (nítido en retina y adaptable) ─
const canvas = document.querySelector("#grafico");
const ctx = canvas.getContext("2d");

function ajustarCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

function dibujarGrafico(progreso = 1) {
  const { w, h } = ajustarCanvas();
  const totales = CATEGORIAS.map((cat) =>
    tablero.pedido.filter((f) => buscarProducto(f.nombre).categoria === cat).reduce((s, f) => s + subtotal(f), 0));
  const maximo = Math.max(...totales, 1);
  ctx.clearRect(0, 0, w, h);

  const margen = 32;
  const hueco = (w - margen * 2) / CATEGORIAS.length;
  const anchoBarra = Math.min(hueco * 0.55, 110);
  const alturaUtil = h - margen * 2 - 10;
  const estilo = getComputedStyle(document.body);
  const colorBarra = estilo.getPropertyValue("--color-acento").trim() || "#1f5bff";
  const colorTexto = estilo.getPropertyValue("--color-texto").trim() || "#1b2540";

  CATEGORIAS.forEach((cat, i) => {
    const x = margen + i * hueco + (hueco - anchoBarra) / 2;
    const alto = (totales[i] / maximo) * alturaUtil * progreso;
    const y = h - margen - alto;
    ctx.fillStyle = colorBarra;
    ctx.beginPath();
    ctx.roundRect(x, y, anchoBarra, Math.max(alto, 0), [8, 8, 0, 0]);
    ctx.fill();
    ctx.fillStyle = colorTexto;
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(cat, x + anchoBarra / 2, h - margen + 20);
    if (totales[i] > 0) ctx.fillText(`Bs ${totales[i]}`, x + anchoBarra / 2, y - 8);
  });

  ctx.beginPath();
  ctx.moveTo(margen - 10, h - margen);
  ctx.lineTo(w - margen + 10, h - margen);
  ctx.strokeStyle = colorTexto;
  ctx.lineWidth = 1;
  ctx.stroke();

  canvas.setAttribute("aria-label", "Gasto del pedido por categoría: " + CATEGORIAS.map((c, i) => `${c} Bs ${totales[i]}`).join(", "));
}

// ── 6. ANIMAR: las barras crecen (requestAnimationFrame) ────────────────
let animacion = null;
function animarGrafico() {
  cancelAnimationFrame(animacion);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return dibujarGrafico();
  const inicio = performance.now();
  const paso = (ahora) => {
    const p = Math.min((ahora - inicio) / 450, 1);
    dibujarGrafico(1 - Math.pow(1 - p, 3));
    if (p < 1) animacion = requestAnimationFrame(paso);
  };
  animacion = requestAnimationFrame(paso);
}
window.addEventListener("resize", () => dibujarGrafico());
document.addEventListener("preferencias:cambio", () => dibujarGrafico());

renderTablero();
