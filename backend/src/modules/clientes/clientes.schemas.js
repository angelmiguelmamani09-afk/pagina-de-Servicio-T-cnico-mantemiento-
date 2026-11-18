
import { z } from "zod";

export const createClienteSchema = z.object({
  nombres: z.string()
    .trim()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100),

  apellidos: z.string()
    .trim()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100),

  telefono: z.string()
    .trim()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(20),

  email: z.string()
    .trim()
    .max(254)
    .pipe(
      z.union([
        z.string().email("Correo electrónico no válido"),
        z.literal("")
      ])
    )
    .optional(),

  direccion: z.string()
    .trim()
    .max(250)
    .optional()
});

export const updateClienteSchema = createClienteSchema.partial();

export const clienteIdSchema = z.string().cuid(
  "Identificador de cliente no válido"
);

export const clienteQuerySchema = z.object({
  buscar: z.string().trim().max(100).optional(),

  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(10)
});
