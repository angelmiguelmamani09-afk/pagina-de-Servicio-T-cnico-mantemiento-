import { prisma } from "../../config/database.js";
import {
  createClienteSchema,
  updateClienteSchema,
  clienteQuerySchema,
  clienteIdSchema
} from "./clientes.schemas.js"; 


// GET /api/clientes
export async function listarClientes(req, res, next) {
  try {
    const validation = clienteQuerySchema.safeParse(req.query);

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

    const { buscar, page, limit } = validation.data;

    const where = buscar
      ? {
          OR: [
            { nombres: { contains: buscar, mode: "insensitive" } },
            { apellidos: { contains: buscar, mode: "insensitive" } },
            { telefono: { contains: buscar } },
            { email: { contains: buscar, mode: "insensitive" } }
          ]
        }
      : {};

    const skip = (page - 1) * limit;

    const [clientes, total] = await prisma.$transaction([
      prisma.cliente.findMany({
        where,
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          telefono: true,
          email: true,
          direccion: true,
          creadoEn: true
        },
        orderBy: {
          creadoEn: "desc"
        },
        skip,
        take: limit
      }),

      prisma.cliente.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        clientes,
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

// POST /api/clientes
export async function crearCliente(req, res, next) {
  try {
    const validation = createClienteSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Datos del cliente no válidos",
        errors: validation.error.issues
      });
    }

    const data = validation.data;

    const cliente = await prisma.cliente.create({
      data: {
        ...data,
        email: data.email || null
      }
    });

    return res.status(201).json({
      success: true,
      message: "Cliente registrado correctamente",
      data: { cliente }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/clientes/:id

export async function obtenerCliente(req, res, next) {
  try {
    const validation = clienteIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de cliente no válido"
      });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: validation.data },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        email: true,
        direccion: true,
        creadoEn: true,
        equipos: true
      }
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    return res.json({
      success: true,
      data: { cliente }
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/clientes/:id

export async function actualizarCliente(req, res, next) {
  try {
    const idValidation = clienteIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de cliente no válido"
      });
    }

    const validation = updateClienteSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de actualización no válidos",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debes proporcionar al menos un campo para actualizar"
      });
    }

    const data = {
      ...validation.data
    };

    if (data.email !== undefined) {
      data.email = data.email || null;
    }

    const cliente = await prisma.cliente.update({
      where: { id: idValidation.data },
      data
    });

    return res.json({
      success: true,
      message: "Cliente actualizado correctamente",
      data: { cliente }
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    next(error);
  }
}

// GET /api/clientes/me
export async function obtenerMiPerfil(req, res, next) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { usuarioId: req.user.id },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        email: true,
        direccion: true,
        equipos: true
      }
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Tu cuenta todavía no tiene un perfil de cliente asociado"
      });
    }

    return res.json({
      success: true,
      data: { cliente }
    });
  } catch (error) {
    next(error);
  }
}