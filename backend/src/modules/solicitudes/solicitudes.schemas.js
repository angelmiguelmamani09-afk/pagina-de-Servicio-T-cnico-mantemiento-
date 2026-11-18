import { z } from "zod";

export const createSolicitudSchema = z.object({
  servicioId: z.string().cuid().optional().nullable(),

  equipoTipo: z.string()
    .trim()
    .min(2, "El tipo de equipo debe tener al menos 2 caracteres")
    .max(50)
    .optional(),

  descripcion: z.string()
    .trim()
    .min(10, "Describe el problema con al menos 10 caracteres")
    .max(2000),

  fechaPreferida: z.coerce.date().optional().nullable()
});

export const updateSolicitudSchema = z.object({
  estado: z.enum([
    "EN_REVISION",
    "RECHAZADA"
  ])
});

export const solicitudIdSchema = z.string()
  .cuid("Identificador de solicitud no válido");

export const solicitudQuerySchema = z.object({
  buscar: z.string().trim().max(100).optional(),
  estado: z.enum([
    "RECIBIDA",
    "EN_REVISION",
    "CONVERTIDA",
    "RECHAZADA"
  ]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});