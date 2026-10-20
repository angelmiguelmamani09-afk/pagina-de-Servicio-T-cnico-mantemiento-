// ── 1. OBJETO LITERAL ───────────────────────────────────────────────────
const mantenimiento = {
  nombre: "Mantenimiento preventivo",
  precio: 100,
  categoria: "servicios",
  stock: 40,                           // cupos de la semana
  disponible: true,
};

console.log(mantenimiento.nombre);

const propiedad = "precio";
console.log(mantenimiento[propiedad]);

mantenimiento.stock = 35;
mantenimiento.garantia = false;
delete mantenimiento.garantia;

// ── 2. DESTRUCTURING ────────────────────────────────────────────────────
const { nombre, precio } = mantenimiento;
console.log(`${nombre} cuesta Bs ${precio}`);

const mantenimientoPromo = { ...mantenimiento, precio: 80, nombre: "Mantenimiento en promoción" };
console.log(mantenimientoPromo);

// ── 3. ARREGLO DE OBJETOS ───────────────────────────────────────────────
const productos = [
  { nombre: "Mantenimiento preventivo",  precio: 100, categoria: "servicios",  stock: 40, disponible: true },
  { nombre: "Formateo e instalación",    precio: 70,  categoria: "servicios",  stock: 25, disponible: true },
  { nombre: "Diagnóstico especializado", precio: 50,  categoria: "servicios",  stock: 8,  disponible: true },
  { nombre: "Memoria RAM 8 GB",          precio: 220, categoria: "repuestos",  stock: 0,  disponible: false },
  { nombre: "Pasta térmica",             precio: 25,  categoria: "repuestos",  stock: 30, disponible: true },
  { nombre: "Disco SSD 480 GB",          precio: 350, categoria: "accesorios", stock: 2,  disponible: true },
  { nombre: "Mouse óptico",              precio: 35,  categoria: "accesorios", stock: 50, disponible: true },
  { nombre: "Cable HDMI",                precio: 20,  categoria: "accesorios", stock: 0,  disponible: false },
];

// ── 4. LOS MÉTODOS QUE IMPORTAN ─────────────────────────────────────────
productos.forEach(p => console.log(p.nombre));

const nombres = productos.map(p => p.nombre);
console.log(nombres);

const disponibles = productos.filter(p => p.disponible);
console.log(disponibles.length, "de", productos.length, "disponibles");

const caro = productos.find(p => p.precio > 300);
console.log(caro);

console.log(nombres.includes("Mouse óptico"));
console.log(productos.some(p => p.stock === 0));
console.log(productos.every(p => p.precio > 0));

const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(porPrecio.map(p => p.nombre));

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor del inventario: Bs", valorInventario.toFixed(2));

// ── 5. ENCADENAR ────────────────────────────────────────────────────────
const nombresDisponibles = productos
  .filter(p => p.disponible)
  .map(p => p.nombre);
console.log(nombresDisponibles);

const totalAccesoriosEnStock = productos
  .filter(p => p.categoria === "accesorios" && p.disponible)
  .reduce((total, p) => total + p.precio * p.stock, 0);
console.log("Accesorios en stock: Bs", totalAccesoriosEnStock.toFixed(2));

const porCategoria = productos.reduce((grupos, p) => {
  if (!grupos[p.categoria]) grupos[p.categoria] = [];
  grupos[p.categoria].push(p.nombre);
  return grupos;
}, {});
console.log(porCategoria);

// ── 6. CLASES ───────────────────────────────────────────────────────────
class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  estaDisponible() {
    return this.stock > 0;
  }

  valorEnStock() {
    return this.precio * this.stock;
  }
}

const mouse = new Producto("Mouse óptico", 35, 50);
console.log(mouse.nombre, mouse.estaDisponible(), mouse.valorEnStock());

class ProductoConDescuento extends Producto {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }

  precioFinal() {
    return this.precio * (1 - this.descuento / 100);
  }
}

const cableHdmi = new ProductoConDescuento("Cable HDMI", 20, 20, 25);
console.log(cableHdmi.precioFinal(), cableHdmi.estaDisponible());
