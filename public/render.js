// ── 1. SELECCIONAR ──────────────────────────────────────────────────────
const contenedor = document.querySelector("#lista-productos");
const titulos = document.querySelectorAll("h2");

console.log("El contenedor existe:", contenedor !== null);
console.log("Hay", titulos.length, "encabezados h2 en la página");

const textosDeTitulos = [...titulos].map(t => t.textContent);
console.log(textosDeTitulos);

// ── 4. CREAR ELEMENTOS ──────────────────────────────────────────────────
function crearTarjeta(producto) {
  const articulo = document.createElement("article");

  articulo.classList.add("tarjeta");
  if (!producto.disponible) {
    articulo.classList.add("agotado");
  }

  articulo.dataset.nombre = producto.nombre;

  const imagenSrc = producto.imagen || "taller.jpg";

  articulo.innerHTML = `
    <div class="tarjeta-img-contenedor">
      <img class="tarjeta-img" 
           src="${imagenSrc}" 
           alt="${producto.nombre}" 
           loading="lazy" 
           onerror="this.onerror=null; this.src='taller.jpg';">
      <span class="tarjeta-badge">${producto.categoria}</span>
    </div>
    <h3>${producto.nombre}</h3>
    <p class="precio">Bs ${producto.precio.toFixed(2)}</p>
    <p class="stock">${producto.disponible ? `${producto.stock} en stock` : "Agotado"}</p>
  `;

  return articulo;
}

// ── 5. RENDER: EL PATRÓN DEL MÓDULO ─────────────────────────────────────
function render(lista) {
  if (!contenedor) return;
  contenedor.innerHTML = "";

  lista.forEach(producto => {
    contenedor.append(crearTarjeta(producto));
  });

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos que mostrar.</p>";
  }
}

// ── 6. PINTAR LAS TARJETAS ──────────────────────────────────────────────
if (typeof productos !== "undefined") {
  render(productos);
}

// ── 7. LLENAR EL SELECT DEL FORMULARIO DINÁMICAMENTE ─────────────────────
const selectServicio = document.querySelector("#servicio");

if (selectServicio && typeof productos !== "undefined") {
  productos.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nombre.toLowerCase();
    
    if (p.disponible) {
      option.textContent = `${p.nombre} (Bs ${p.precio.toFixed(2)})`;
    } else {
      option.textContent = `${p.nombre} (Bs ${p.precio.toFixed(2)}) - Agotado`;
    }
    
    selectServicio.append(option);
  });
}

// ── 8. RECORRER EL ÁRBOL ────────────────────────────────────────────────
const primeraTarjeta = document.querySelector(".tarjeta");
if (primeraTarjeta) {
  console.log("Padre de la primera tarjeta:", primeraTarjeta.parentElement.id);
  console.log("Su producto es:", primeraTarjeta.dataset.nombre);
}
