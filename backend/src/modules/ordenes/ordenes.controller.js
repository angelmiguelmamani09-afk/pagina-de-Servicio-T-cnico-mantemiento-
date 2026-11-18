import { randomBytes } from "node:crypto";
import { prisma } from "../../config/database.js";

import {
  crearOrdenSchema,
  convertirSolicitudSchema,
  asignarTecnicoSchema,
  cambiarEstadoOrdenSchema,
  ordenIdSchema,
  ordenQuerySchema
} from "./ordenes.schemas.js";

const incluirOrden = {
  cliente: {
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      telefono: true
    }
  },
  equipo: true,
  tecnico: {
    select: {
      id: true,
      nombre: true,
      email: true
    }
  },
  solicitud: {
    select: {
      id: true,
      codigo: true,
      descripcion: true
    }
  }
};

function generarCodigoOrden() {
  const anio = new Date().getFullYear();
  const aleatorio = randomBytes(4).toString("hex").toUpperCase();

  return `TFX-${anio}-${aleatorio}`;
}

async function validarTecnico(tx, tecnicoId) {
  if (!tecnicoId) return true;

  const tecnico = await tx.usuario.findFirst({
    where: {
      id: tecnicoId,
      activo: true,
      rol: { nombre: "TECNICO" }
    },
    select: { id: true }
  });

  return Boolean(tecnico);
}

async function registrarHistorial(tx, ordenId, usuarioId, estadoNuevo, estadoAnterior = null, observacion = null) {
  return tx.historialEstado.create({
    data: {
      ordenId,
      usuarioId,
      estadoAnterior,
      estadoNuevo,
      observacion
    }
  });
}

// ADMINISTRADOR: listar todas las órdenes
export async function listarOrdenes(req, res, next) {
  try {
    const validacion = ordenQuerySchema.safeParse(req.query);

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
          { cliente: { nombres: { contains: buscar, mode: "insensitive" } } },
          { cliente: { apellidos: { contains: buscar, mode: "insensitive" } } },
          { equipo: { marca: { contains: buscar, mode: "insensitive" } } },
          { equipo: { modelo: { contains: buscar, mode: "insensitive" } } }
        ]
      })
    };

    const [ordenes, total] = await prisma.$transaction([
      prisma.ordenTrabajo.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fechaRecepcion: "desc" },
        include: incluirOrden
      }),
      prisma.ordenTrabajo.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        ordenes,
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

// ADMINISTRADOR: crear una orden manualmente
export async function crearOrden(req, res, next) {
  try {
    const validacion = crearOrdenSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de la orden no válidos",
        errors: validacion.error.flatten()
      });
    }

    const datos = validacion.data;

    const resultado = await prisma.$transaction(async (tx) => {
      const equipo = await tx.equipo.findUnique({
        where: { id: datos.equipoId },
        select: { id: true, clienteId: true }
      });

      if (!equipo || equipo.clienteId !== datos.clienteId) {
        return { error: "EQUIPO_NO_VALIDO" };
      }

      const cliente = await tx.cliente.findUnique({
        where: { id: datos.clienteId },
        select: { id: true }
      });

      if (!cliente) return { error: "CLIENTE_NO_EXISTE" };

      if (datos.tecnicoId && !(await validarTecnico(tx, datos.tecnicoId))) {
        return { error: "TECNICO_NO_VALIDO" };
      }

      const orden = await tx.ordenTrabajo.create({
        data: {
          codigo: generarCodigoOrden(),
          clienteId: datos.clienteId,
          equipoId: datos.equipoId,
          tecnicoId: datos.tecnicoId || null,
          accesoriosRecibidos: datos.accesoriosRecibidos || null,
          observacionesRecepcion: datos.observacionesRecepcion || null,
          estado: "RECIBIDO"
        },
        include: incluirOrden
      });

      await registrarHistorial(
        tx,
        orden.id,
        req.user.id,
        "RECIBIDO",
        null,
        "Orden de trabajo creada"
      );

      return { orden };
    });

    if (resultado.error) {
      const mensajes = {
        EQUIPO_NO_VALIDO: [400, "El equipo no existe o no pertenece al cliente indicado"],
        CLIENTE_NO_EXISTE: [404, "El cliente no existe"],
        TECNICO_NO_VALIDO: [400, "El técnico no existe, está inactivo o no tiene el rol correcto"]
      };

      const [status, message] = mensajes[resultado.error];

      return res.status(status).json({ success: false, message });
    }

    return res.status(201).json({
      success: true,
      message: "Orden de trabajo creada correctamente",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
}

// ADMINISTRADOR: convertir una solicitud en orden de trabajo
export async function convertirSolicitud(req, res, next) {
  try {
    const validacionId = ordenIdSchema.safeParse(req.params.solicitudId);
    const validacionBody = convertirSolicitudSchema.safeParse(req.body);

    if (!validacionId.success || !validacionBody.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de conversión no válidos",
        errors: validacionBody.success
          ? undefined
          : validacionBody.error.flatten()
      });
    }

    const datos = validacionBody.data;

    const resultado = await prisma.$transaction(async (tx) => {
      const solicitud = await tx.solicitud.findUnique({
        where: { id: validacionId.data }
      });

      if (!solicitud) return { error: "SOLICITUD_NO_EXISTE" };

      if (solicitud.estado === "CONVERTIDA") {
        return { error: "SOLICITUD_CONVERTIDA" };
      }

      if (solicitud.estado === "RECHAZADA") {
        return { error: "SOLICITUD_RECHAZADA" };
      }

      const equipo = await tx.equipo.findUnique({
        where: { id: datos.equipoId },
        select: { id: true, clienteId: true }
      });

      if (!equipo || equipo.clienteId !== solicitud.clienteId) {
        return { error: "EQUIPO_NO_VALIDO" };
      }

      if (datos.tecnicoId && !(await validarTecnico(tx, datos.tecnicoId))) {
        return { error: "TECNICO_NO_VALIDO" };
      }

      const orden = await tx.ordenTrabajo.create({
        data: {
          codigo: generarCodigoOrden(),
          clienteId: solicitud.clienteId,
          equipoId: datos.equipoId,
          solicitudId: solicitud.id,
          tecnicoId: datos.tecnicoId || null,
          accesoriosRecibidos: datos.accesoriosRecibidos || null,
          observacionesRecepcion: datos.observacionesRecepcion || null,
          estado: "RECIBIDO"
        },
        include: incluirOrden
      });

      await tx.solicitud.update({
        where: { id: solicitud.id },
        data: { estado: "CONVERTIDA" }
      });

      await registrarHistorial(
        tx,
        orden.id,
        req.user.id,
        "RECIBIDO",
        null,
        `Orden creada desde solicitud ${solicitud.codigo}`
      );

      return { orden };
    });

    const errores = {
      SOLICITUD_NO_EXISTE: [404, "Solicitud no encontrada"],
      SOLICITUD_CONVERTIDA: [409, "La solicitud ya fue convertida"],
      SOLICITUD_RECHAZADA: [409, "No se puede convertir una solicitud rechazada"],
      EQUIPO_NO_VALIDO: [400, "El equipo no existe o no pertenece al cliente de la solicitud"],
      TECNICO_NO_VALIDO: [400, "El técnico no existe, está inactivo o no tiene el rol correcto"]
    };

    if (resultado.error) {
      const [status, message] = errores[resultado.error];
      return res.status(status).json({ success: false, message });
    }

    return res.status(201).json({
      success: true,
      message: "Solicitud convertida en orden de trabajo",
      data: resultado
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "La solicitud ya está vinculada a una orden de trabajo"
      });
    }
    next(error);
  }
}

// ADMINISTRADOR: asignar o retirar un técnico
export async function asignarTecnico(req, res, next) {
  try {
    const validacionId = ordenIdSchema.safeParse(req.params.id);
    const validacionBody = asignarTecnicoSchema.safeParse(req.body);

    if (!validacionId.success || !validacionBody.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de asignación no válidos"
      });
    }

    const { tecnicoId } = validacionBody.data;

    const resultado = await prisma.$transaction(async (tx) => {
      const orden = await tx.ordenTrabajo.findUnique({
        where: { id: validacionId.data }
      });

      if (!orden) return { error: "ORDEN_NO_EXISTE" };

      if (tecnicoId && !(await validarTecnico(tx, tecnicoId))) {
        return { error: "TECNICO_NO_VALIDO" };
      }

      const actualizada = await tx.ordenTrabajo.update({
        where: { id: orden.id },
        data: { tecnicoId },
        include: incluirOrden
      });

      return { orden: actualizada };
    });

    if (resultado.error) {
      const errores = {
        ORDEN_NO_EXISTE: [404, "Orden de trabajo no encontrada"],
        TECNICO_NO_VALIDO: [400, "El técnico no existe, está inactivo o no tiene el rol correcto"]
      };
      const [status, message] = errores[resultado.error];
      return res.status(status).json({ success: false, message });
    }

    return res.json({
      success: true,
      message: tecnicoId ? "Técnico asignado correctamente" : "Técnico retirado de la orden",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
}
// ADMINISTRADOR Y TÉCNICO: cambiar estado y guardar historial
export async function cambiarEstadoOrden(req, res, next) {
  try {
    const validacionId = ordenIdSchema.safeParse(req.params.id);
    const validacionBody = cambiarEstadoOrdenSchema.safeParse(req.body);

    if (!validacionId.success || !validacionBody.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de actualización no válidos"
      });
    }

    const { estado, observacion } = validacionBody.data;
    const esTecnico = req.user.rol.nombre === "TECNICO";

    const transiciones = {
      RECIBIDO: ["EN_DIAGNOSTICO", "CANCELADO"],
      EN_DIAGNOSTICO: ["PRESUPUESTO_PENDIENTE", "EN_REPARACION", "CANCELADO"],
      PRESUPUESTO_PENDIENTE: ["PRESUPUESTO_APROBADO", "CANCELADO"],
      PRESUPUESTO_APROBADO: ["EN_REPARACION", "CANCELADO"],
      EN_REPARACION: ["EN_PRUEBAS", "CANCELADO"],
      EN_PRUEBAS: ["EN_REPARACION", "FINALIZADO"],
      FINALIZADO: ["LISTO_PARA_ENTREGA", "EN_REPARACION"],
      LISTO_PARA_ENTREGA: ["ENTREGADO", "EN_REPARACION"],
      ENTREGADO: [],
      CANCELADO: []
    };

    const resultado = await prisma.$transaction(async (tx) => {
      const orden = await tx.ordenTrabajo.findUnique({
        where: { id: validacionId.data }
      });

      if (!orden) return { error: "ORDEN_NO_EXISTE" };

      if (esTecnico && orden.tecnicoId !== req.user.id) {
        return { error: "SIN_ASIGNACION" };
      }

      if (!transiciones[orden.estado].includes(estado)) {
        return { error: "TRANSICION_NO_PERMITIDA" };
      }

      if (esTecnico && estado === "CANCELADO") {
        return { error: "CANCELACION_NO_PERMITIDA" };
      }

      if (estado === "PRESUPUESTO_APROBADO") {
        const presupuesto = await tx.presupuesto.findUnique({ where: { ordenId: orden.id } });
        if (!presupuesto || presupuesto.estado !== "APROBADO") return { error: "PRESUPUESTO_NO_APROBADO" };
      }

      if (estado === "ENTREGADO") {
        const finanzas = await tx.ordenTrabajo.findUnique({
          where: { id: orden.id },
          include: { presupuesto: true, pagos: true }
        });
        if (!finanzas.presupuesto || finanzas.presupuesto.estado !== "APROBADO") {
          return { error: "PRESUPUESTO_NO_APROBADO" };
        }
        const pagado = finanzas.pagos.reduce((suma, pago) => suma + Number(pago.monto), 0);
        if (pagado + 0.001 < Number(finanzas.presupuesto.total)) {
          return { error: "SALDO_PENDIENTE" };
        }
      }

      const actualizada = await tx.ordenTrabajo.update({
        where: { id: orden.id },
        data: {
          estado,
          ...(estado === "ENTREGADO" ? { fechaEntrega: new Date() } : {})
        },
        include: incluirOrden
      });

      await registrarHistorial(
        tx,
        orden.id,
        req.user.id,
        estado,
        orden.estado,
        observacion || null
      );

      return { orden: actualizada };
    });

    const errores = {
      ORDEN_NO_EXISTE: [404, "Orden de trabajo no encontrada"],
      SIN_ASIGNACION: [403, "No tienes asignada esta orden de trabajo"],
      TRANSICION_NO_PERMITIDA: [409, "No se permite ese cambio desde el estado actual"],
      CANCELACION_NO_PERMITIDA: [403, "Solo el administrador puede cancelar una orden"],
      PRESUPUESTO_NO_APROBADO: [409, "No se puede entregar: el presupuesto no está aprobado"],
      SALDO_PENDIENTE: [409, "No se puede entregar: la orden todavía tiene saldo pendiente"]
    };

    if (resultado.error) {
      const [status, message] = errores[resultado.error];
      return res.status(status).json({ success: false, message });
    }

    return res.json({
      success: true,
      message: "Estado actualizado e historial registrado",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
}

// ADMINISTRADOR: consultar una orden y su historial
export async function obtenerOrden(req, res, next) {
  try {
    const validacion = ordenIdSchema.safeParse(req.params.id);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de orden no válido"
      });
    }

    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id: validacion.data },
      include: {
        ...incluirOrden,
        diagnosticos: true,
        presupuesto: true,
        pagos: true,
        repuestos: true,
        garantia: true,
        historial: {
          orderBy: { creadoEn: "desc" },
          include: {
            usuario: {
              select: { id: true, nombre: true, email: true }
            }
          }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({
        success: false,
        message: "Orden de trabajo no encontrada"
      });
    }

    return res.json({
      success: true,
      data: { orden }
    });
  } catch (error) {
    next(error);
  }
}

// CLIENTE Y TÉCNICO: consultar sus propias órdenes
export async function listarMisOrdenes(req, res, next) {
  try {
    const rol = req.user.rol.nombre;
    let where;

    if (rol === "CLIENTE") {
      const cliente = await txCliente(req.user.id);

      if (!cliente) {
        return res.status(409).json({
          success: false,
          message: "Tu cuenta no tiene un perfil de cliente asociado"
        });
      }

      where = { clienteId: cliente.id };
    } else {
      where = { tecnicoId: req.user.id };
    }

    const ordenes = await prisma.ordenTrabajo.findMany({
      where,
      orderBy: { fechaRecepcion: "desc" },
      include: incluirOrden
    });

    return res.json({
      success: true,
      data: { ordenes }
    });
  } catch (error) {
    next(error);
  }
}

async function txCliente(usuarioId) {
  return prisma.cliente.findUnique({
    where: { usuarioId },
    select: { id: true }
  });
}

// CLIENTE Y TÉCNICO: consultar el detalle de una orden propia
export async function obtenerMiOrden(req, res, next) {
  try {
    const validacion = ordenIdSchema.safeParse(req.params.id);

    if (!validacion.success) {
      return res.status(400).json({
        success: false,
        message: "Identificador de orden no válido"
      });
    }

    const rol = req.user.rol.nombre;
    let where;

    if (rol === "CLIENTE") {
      const cliente = await txCliente(req.user.id);

      if (!cliente) {
        return res.status(409).json({
          success: false,
          message: "Tu cuenta no tiene un perfil de cliente asociado"
        });
      }

      where = {
        id: validacion.data,
        clienteId: cliente.id
      };
    } else {
      where = {
        id: validacion.data,
        tecnicoId: req.user.id
      };
    }

    const orden = await prisma.ordenTrabajo.findFirst({
      where,
      include: {
        ...incluirOrden,
        diagnosticos: true,
        historial: {
          orderBy: { creadoEn: "desc" },
          select: {
            estadoAnterior: true,
            estadoNuevo: true,
            observacion: true,
            creadoEn: true
          }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada o no tienes permiso para consultarla"
      });
    }

    return res.json({
      success: true,
      data: { orden }
    });
  } catch (error) {
    next(error);
  }
}