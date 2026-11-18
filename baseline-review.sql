-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'TECNICO', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('RECIBIDA', 'EN_REVISION', 'CONVERTIDA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('RECIBIDO', 'EN_DIAGNOSTICO', 'PRESUPUESTO_PENDIENTE', 'PRESUPUESTO_APROBADO', 'EN_REPARACION', 'EN_PRUEBAS', 'FINALIZADO', 'LISTO_PARA_ENTREGA', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "EstadoPresupuesto" AS ENUM ('BORRADOR', 'ENVIADO', 'APROBADO', 'RECHAZADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'QR', 'OTRO');

-- CreateTable
CREATE TABLE "RolSistema" (
    "id" SERIAL NOT NULL,
    "nombre" "Rol" NOT NULL,

    CONSTRAINT "RolSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "rolId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT,
    "numeroSerie" TEXT,
    "descripcion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "categoriaId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "categoriaId" TEXT,
    "sku" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "costo" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "servicioId" TEXT,
    "equipoTipo" TEXT,
    "descripcion" TEXT NOT NULL,
    "fechaPreferida" TIMESTAMP(3),
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'RECIBIDA',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenTrabajo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "solicitudId" TEXT,
    "tecnicoId" TEXT,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'RECIBIDO',
    "accesoriosRecibidos" TEXT,
    "observacionesRecepcion" TEXT,
    "fechaRecepcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3),
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "tecnicoId" TEXT NOT NULL,
    "descripcionProblema" TEXT NOT NULL,
    "pruebasRealizadas" TEXT,
    "recomendacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialEstado" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "estadoAnterior" "EstadoOrden",
    "estadoNuevo" "EstadoOrden" NOT NULL,
    "observacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialEstado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "estado" "EstadoPresupuesto" NOT NULL DEFAULT 'BORRADOR',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "aprobadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "referencia" TEXT,
    "observacion" TEXT,
    "registradoPor" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepuestoUtilizado" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepuestoUtilizado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Garantia" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "condiciones" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Garantia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opinion" (
    "id" TEXT NOT NULL,
    "nombreVisible" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "aprobada" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RolSistema_nombre_key" ON "RolSistema"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "Cliente"("usuarioId");

-- CreateIndex
CREATE INDEX "Equipo_clienteId_idx" ON "Equipo"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_codigo_key" ON "Solicitud"("codigo");

-- CreateIndex
CREATE INDEX "Solicitud_clienteId_creadoEn_idx" ON "Solicitud"("clienteId", "creadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenTrabajo_codigo_key" ON "OrdenTrabajo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenTrabajo_solicitudId_key" ON "OrdenTrabajo"("solicitudId");

-- CreateIndex
CREATE INDEX "OrdenTrabajo_clienteId_estado_idx" ON "OrdenTrabajo"("clienteId", "estado");

-- CreateIndex
CREATE INDEX "OrdenTrabajo_tecnicoId_estado_idx" ON "OrdenTrabajo"("tecnicoId", "estado");

-- CreateIndex
CREATE INDEX "HistorialEstado_ordenId_creadoEn_idx" ON "HistorialEstado"("ordenId", "creadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "Presupuesto_ordenId_key" ON "Presupuesto"("ordenId");

-- CreateIndex
CREATE INDEX "Pago_ordenId_creadoEn_idx" ON "Pago"("ordenId", "creadoEn");

-- CreateIndex
CREATE INDEX "MovimientoInventario_productoId_creadoEn_idx" ON "MovimientoInventario"("productoId", "creadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "Garantia_ordenId_key" ON "Garantia"("ordenId");

-- CreateIndex
CREATE UNIQUE INDEX "Garantia_codigo_key" ON "Garantia"("codigo");

-- CreateIndex
CREATE INDEX "Notificacion_usuarioId_leida_idx" ON "Notificacion"("usuarioId", "leida");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "RolSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEstado" ADD CONSTRAINT "HistorialEstado_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialEstado" ADD CONSTRAINT "HistorialEstado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepuestoUtilizado" ADD CONSTRAINT "RepuestoUtilizado_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepuestoUtilizado" ADD CONSTRAINT "RepuestoUtilizado_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garantia" ADD CONSTRAINT "Garantia_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenTrabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
