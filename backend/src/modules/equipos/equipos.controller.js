
import { prisma } from "../../config/database.js";

import {
  createEquipoSchema,
  updateEquipoSchema,
  equipoIdSchema,
  equipoQuerySchema
} from "./equipos.schemas.js";

// GET /api/equipos
export async function listarEquipos(req, res, next) {
  try {
    const validation = equipoQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Parámetros de búsqueda no válidos",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    const { buscar, clienteId, page, limit } = validation.data;

    const where = {
      ...(clienteId ? { clienteId } : {}),
      ...(buscar
        ? {
            OR: [
              { tipo: { contains: buscar, mode: "insensitive" } },
              { marca: { contains: buscar, mode: "insensitive" } },
              { modelo: { contains: buscar, mode: "insensitive" } },
              { numeroSerie: { contains: buscar, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const skip = (page - 1) * limit;

    const [equipos, total] = await prisma.$transaction([
      prisma.equipo.findMany({
        where,
        select: {
          id: true,
          clienteId: true,
          tipo: true,
          marca: true,
          modelo: true,
          numeroSerie: true,
          descripcion: true,
          creadoEn: true,
          cliente: {
            select: {
              nombres: true,
              apellidos: true,
              telefono: true
            }
          }
        },
        orderBy: { creadoEn: "desc" },
        skip,
        take: limit
      }),
      prisma.equipo.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        equipos,
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

// POST /api/equipos
export async function crearEquipo(req, res, next) {
  try {
    const validation = createEquipoSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Datos del equipo no válidos",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    const data = validation.data;

    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
      select: { id: true }
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "El cliente asociado no existe"
      });
    }

    const equipo = await prisma.equipo.create({
      data: {
        ...data,
        modelo: data.modelo || null,
        numeroSerie: data.numeroSerie || null,
        descripcion: data.descripcion || null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Equipo registrado correctamente",
      data: { equipo }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/equipos/:id
export async function obtenerEquipo(req, res, next) {
  try {
    const validation = equipoIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de equipo no válido"
      });
    }

    const equipo = await prisma.equipo.findUnique({
      where: { id: validation.data },
      select: {
        id: true,
        clienteId: true,
        tipo: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        descripcion: true,
        creadoEn: true,
        cliente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            telefono: true,
            email: true
          }
        }
      }
    });

    if (!equipo) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado"
      });
    }

    return res.json({
      success: true,
      data: { equipo }
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/equipos/:id
export async function actualizarEquipo(req, res, next) {
  try {
    const idValidation = equipoIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de equipo no válido"
      });
    }

    const validation = updateEquipoSchema.safeParse(req.body);

    if (
      !validation.success ||
      Object.keys(validation.data || {}).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos de actualización no válidos",
        errors: validation.success
          ? []
          : validation.error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message
            }))
      });
    }

    const data = validation.data;

    const equipo = await prisma.equipo.update({
      where: { id: idValidation.data },
      data: {
        ...data,
        ...(data.modelo !== undefined
          ? { modelo: data.modelo || null }
          : {}),
        ...(data.numeroSerie !== undefined
          ? { numeroSerie: data.numeroSerie || null }
          : {}),
        ...(data.descripcion !== undefined
          ? { descripcion: data.descripcion || null }
          : {})
      }
    });

    return res.json({
      success: true,
      message: "Equipo actualizado correctamente",
      data: { equipo }
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado"
      });
    }

    next(error);
  }
}

// GET /api/equipos/me
export async function listarMisEquipos(req, res, next) {
  try {
    const equipos = await prisma.equipo.findMany({
      where: {
        cliente: {
          usuarioId: req.user.id
        }
      },
      select: {
        id: true,
        tipo: true,
        marca: true,
        modelo: true,
        numeroSerie: true,
        descripcion: true,
        creadoEn: true
      },
      orderBy: { creadoEn: "desc" }
    });

    return res.json({
      success: true,
      data: { equipos }
    });
  } catch (error) {
    next(error);
  }
}
