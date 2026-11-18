import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Correo electrónico no válido")
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .max(128)
});