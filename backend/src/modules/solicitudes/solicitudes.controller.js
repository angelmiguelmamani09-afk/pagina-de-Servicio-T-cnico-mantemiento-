import { randomBytes } from "node:crypto";
import { prisma } from "../../config/database.js";

import {
  createSolicitudSchema,
  updateSolicitudSchema,
  solicitudIdSchema,
  solicitudQuerySchema
} from "./solicitudes.schemas.js";

async function obtenerClienteUsuario(usuarioId) {
  return prisma.cliente.findUnique({
    where: { usuarioId },
    select: { id: true }
  });
}

function generarCodigoSolicitud() {
  const anio = new Date().getFullYear();
  const aleatorio = randomBytes(4).toString("hex").toUpperCase();

  return `SOL-${anio}-${aleatorio}`;
}

// ADMINISTRADOR: listar todas las solicitudes
export async function listarSolicitudes(req, res, next) {
  try {
    const validacion = solicitudQuerySchema.safeParse(req.query);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de búsqueda no válidos",
        errors: validacion.error.flatten()
      });
    }

    const { buscar, estado, page, limit } = validacion.data;

    const where = {
      ...(estado && { estado }),
      ...(buscar && {
        OR: [
          { codigo: { contains: buscar, mode: "insensitive" } },
          { descripcion: { contains: buscar, mode: "insensitive" } },
          { cliente: { nombres: { contains: buscar, mode: "insensitive" } } },
          { cliente: { apellidos: { contains: buscar, mode: "insensitive" } } }
        ]
      })
    };

    const [solicitudes, total] = await prisma.$transaction([
      prisma.solicitud.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { creadoEn: "desc" },
        include: {
          cliente: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              telefono: true
            }
          },
          servicio: {
            select: {
              id: true,
              nombre: true,
              precio: true
            }
          }
        }
      }),
      prisma.solicitud.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        solicitudes,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

// CLIENTE: registrar una solicitud propia
export async function crearSolicitud(req, res, next) {
  try {
    const validacion = createSolicitudSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de solicitud no válidos",
        errors: validacion.error.flatten()
      });
    }

    const cliente = await obtenerClienteUsuario(req.user.id);

    if (!cliente) {
      return res.status(409).json({
        success: false,
        message: "Tu cuenta todavía no tiene un perfil de cliente asociado"
      });
    }

    const datos = validacion.data;

    if (datos.servicioId) {
      const servicio = await prisma.servicio.findFirst({
        where: {
          id: datos.servicioId,
          activo: true
        },
        select: { id: true }
      });

      if (!servicio) {
        return res.status(404).json({
          success: false,
          message: "El servicio no existe o no está disponible"
        });
      }
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        codigo: generarCodigoSolicitud(),
        clienteId: cliente.id,
        servicioId: datos.servicioId || null,
        equipoTipo: datos.equipoTipo || null,
        descripcion: datos.descripcion,
        fechaPreferida: datos.fechaPreferida || null
      },
      include: {
        servicio: {
          select: {
            id: true,
            nombre: true,
            precio: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Solicitud registrada correctamente",
      data: { solicitud }
    });
  } catch (error) {
    next(error);
  }
}

// CLIENTE: consultar sus solicitudes
export async function listarMisSolicitudes(req, res, next) {
  try {
    const cliente = await obtenerClienteUsuario(req.user.id);

    if (!cliente) {
      return res.status(409).json({
        success: false,
        message: "Tu cuenta todavía no tiene un perfil de cliente asociado"
      });
    }

    const solicitudes = await prisma.solicitud.findMany({
      where: { clienteId: cliente.id },
      orderBy: { creadoEn: "desc" },
      include: {
        servicio: {
          select: {
            id: true,
            nombre: true,
            precio: true
          }
        }
      }
    });

    return res.json({
      success: true,
      data: { solicitudes }
    });
  } catch (error) {
    next(error);
  }
}

// CLIENTE: consultar una solicitud propia
export async function obtenerMiSolicitud(req, res, next) {
  try {
    const validacion = solicitudIdSchema.safeParse(req.params.id);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de solicitud no válido"
      });
    }

    const cliente = await obtenerClienteUsuario(req.user.id);

    if (!cliente) {
      return res.status(409).json({
        success: false,
        message: "Tu cuenta todavía no tiene un perfil de cliente asociado"
      });
    }

    const solicitud = await prisma.solicitud.findFirst({
      where: {
        id: validacion.data,
        clienteId: cliente.id
      },
      include: {
        servicio: true
      }
    });

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    return res.json({
      success: true,
      data: { solicitud }
    });
  } catch (error) {
    next(error);
  }
}

// ADMINISTRADOR: consultar una solicitud
export async function obtenerSolicitud(req, res, next) {
  try {
    const validacion = solicitudIdSchema.safeParse(req.params.id);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de solicitud no válido"
      });
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: validacion.data },
      include: {
        cliente: true,
        servicio: true,
        orden: {
          select: {
            id: true,
            codigo: true,
            estado: true
          }
        }
      }
    });

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    return res.json({
      success: true,
      data: { solicitud }
    });
  } catch (error) {
    next(error);
  }
}

// ADMINISTRADOR: cambiar estado
export async function actualizarSolicitud(req, res, next) {
  try {
    const validacionId = solicitudIdSchema.safeParse(req.params.id);
    const validacionBody = updateSolicitudSchema.safeParse(req.body);

    if (!validacionId.success || !validacionBody.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de actualización no válidos",
        errors: validacionBody.success
          ? undefined
          : validacionBody.error.flatten()
      });
    }

    const existente = await prisma.solicitud.findUnique({
      where: { id: validacionId.data },
      include: { orden: true }
    });

    if (!existente) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    if (existente.estado === "CONVERTIDA" || existente.orden) {
      return res.status(409).json({
        success: false,
        message: "La solicitud ya fue convertida en una orden de trabajo"
      });
    }

    if (existente.estado === "RECHAZADA") {
      return res.status(409).json({
        success: false,
        message: "No se puede modificar una solicitud rechazada"
      });
    }

    const solicitud = await prisma.solicitud.update({
      where: { id: validacionId.data },
      data: { estado: validacionBody.data.estado }
    });

    return res.json({
      success: true,
      message: "Estado de solicitud actualizado correctamente",
      data: { solicitud }
    });
  } catch (error) {
    next(error);
  }
}