import { z } from "zod";

export const crearDiagnosticoSchema = z.object({
    descripcionProblema: z.string()
        .trim()
        .min(10, "Describe el problema con al menos 10 caracteres")
        .max(3000),

    pruebasRealizadas: z.string()
        .trim()
        .max(3000)
        .optional(),

    recomendacion: z.string()
        .trim()
        .max(3000)
        .optional()
});

export const ordenIdSchema = z.string().cuid();