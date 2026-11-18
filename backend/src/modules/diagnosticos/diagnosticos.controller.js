import { prisma } from "../../config/database.js";
import {
    crearDiagnosticoSchema,
    ordenIdSchema
} from "./diagnosticos.schemas.js";

// Verifica que el usuario pueda acceder a la orden.
async function verificarAccesoOrden(ordenId, usuario) {
    const orden = await prisma.ordenTrabajo.findUnique({
        where: { id: ordenId },
        select: {
            id: true,
            codigo: true,
            estado: true,
            tecnicoId: true
        }
    });

    if (!orden) {
        return {
            error: "Orden de trabajo no encontrada",
            status: 404
        };
    }

    if (
        usuario.rol?.nombre === "TECNICO" &&
        orden.tecnicoId !== usuario.id
    ) {
        return {
            error: "No tienes asignada esta orden de trabajo",
            status: 403
        };
    }

    return { orden };
}

// Registrar diagnÃ³stico.
export async function crearDiagnostico(req, res) {
    try {
        const idValidado = ordenIdSchema.safeParse(req.params.ordenId);

        if (!idValidado.success) {
            return res.status(400).json({
                success: false,
                message: "Identificador de orden invÃ¡lido"
            });
        }

        const datos = crearDiagnosticoSchema.safeParse(req.body);

        if (!datos.success) {
            return res.status(400).json({
                success: false,
                message: "Datos del diagnÃ³stico invÃ¡lidos",
                errors: datos.error.issues
            });
        }

        const acceso = await verificarAccesoOrden(
            idValidado.data,
            req.user
        );

        if (acceso.error) {
            return res.status(acceso.status).json({
                success: false,
                message: acceso.error
            });
        }

        if (req.user.rol?.nombre === "ADMINISTRADOR" && !acceso.orden.tecnicoId) {
            return res.status(409).json({
                success: false,
                message: "Asigna un técnico a la orden antes de registrar el diagnóstico."
            });
        }

        if (acceso.orden.estado !== "EN_DIAGNOSTICO") {
            return res.status(409).json({
                success: false,
                message: "La orden debe estar en diagnÃ³stico para registrar este informe"
            });
        }

        const diagnostico = await prisma.diagnostico.create({
            data: {
                ordenId: acceso.orden.id,
                tecnicoId: req.user.rol?.nombre === "TECNICO" ? req.user.id : acceso.orden.tecnicoId,
                descripcionProblema: datos.data.descripcionProblema,
                pruebasRealizadas: datos.data.pruebasRealizadas || null,
                recomendacion: datos.data.recomendacion || null
            },
            include: {
                tecnico: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        });

        return res.status(201).json({
            success: true,
            message: "DiagnÃ³stico registrado correctamente",
            data: { diagnostico }
        });

    } catch (error) {
        console.error("Error al registrar diagnÃ³stico:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno al registrar el diagnÃ³stico"
        });
    }
}

// Consultar diagnÃ³sticos de una orden.
export async function listarDiagnosticosPorOrden(req, res) {
    try {
        const idValidado = ordenIdSchema.safeParse(req.params.ordenId);

        if (!idValidado.success) {
            return res.status(400).json({
                success: false,
                message: "Identificador de orden invÃ¡lido"
            });
        }

        const acceso = await verificarAccesoOrden(
            idValidado.data,
            req.user
        );

        if (acceso.error) {
            return res.status(acceso.status).json({
                success: false,
                message: acceso.error
            });
        }

        const diagnosticos = await prisma.diagnostico.findMany({
            where: {
                ordenId: acceso.orden.id
            },
            include: {
                tecnico: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: {
                creadoEn: "desc"
            }
        });

        return res.json({
            success: true,
            data: {
                orden: {
                    id: acceso.orden.id,
                    codigo: acceso.orden.codigo,
                    estado: acceso.orden.estado
                },
                total: diagnosticos.length,
                diagnosticos
            }
        });

    } catch (error) {
        console.error("Error al consultar diagnÃ³sticos:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno al consultar los diagnÃ³sticos"
        });
    }
}

