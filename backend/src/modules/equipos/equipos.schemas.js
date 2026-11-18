
import { z } from "zod";

export const createEquipoSchema = z.object({
  clienteId: z.string().cuid("Identificador de cliente no válido"),

  tipo: z.string()
    .trim()
    .min(2, "El tipo de equipo debe tener al menos 2 caracteres")
    .max(50),

  marca: z.string()
    .trim()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(60),

  modelo: z.string()
    .trim()
    .max(100)
    .optional(),

  numeroSerie: z.string()
    .trim()
    .max(100)
    .optional(),

  descripcion: z.string()
    .trim()
    .max(1000)
    .optional()
});

export const updateEquipoSchema = createEquipoSchema
  .omit({ clienteId: true })
  .partial();

export const equipoIdSchema = z.string()
  .cuid("Identificador de equipo no válido");

export const equipoQuerySchema = z.object({
  buscar: z.string().trim().max(100).optional(),

  clienteId: z.string().cuid().optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10)
});
