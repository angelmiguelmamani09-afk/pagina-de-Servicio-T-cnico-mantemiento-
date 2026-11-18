import { z } from "zod";

const estadosOrden = [
  "RECIBIDO",
  "EN_DIAGNOSTICO",
  "PRESUPUESTO_PENDIENTE",
  "PRESUPUESTO_APROBADO",
  "EN_REPARACION",
  "EN_PRUEBAS",
  "FINALIZADO",
  "LISTO_PARA_ENTREGA",
  "ENTREGADO",
  "CANCELADO"
];

export const crearOrdenSchema = z.object({
  clienteId: z.string().cuid(),
  equipoId: z.string().cuid(),
  tecnicoId: z.string().cuid().nullable().optional(),
  accesoriosRecibidos: z.string().trim().max(500).optional(),
  observacionesRecepcion: z.string().trim().max(2000).optional()
});

export const convertirSolicitudSchema = z.object({
  equipoId: z.string().cuid(),
  tecnicoId: z.string().cuid().nullable().optional(),
  accesoriosRecibidos: z.string().trim().max(500).optional(),
  observacionesRecepcion: z.string().trim().max(2000).optional()
});

export const asignarTecnicoSchema = z.object({
  tecnicoId: z.string().cuid().nullable()
});

export const cambiarEstadoOrdenSchema = z.object({
  estado: z.enum(estadosOrden),
  observacion: z.string().trim().max(1000).optional()
});

export const ordenIdSchema = z.string().cuid();

export const ordenQuerySchema = z.object({
  buscar: z.string().trim().max(100).optional(),
  estado: z.enum(estadosOrden).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});