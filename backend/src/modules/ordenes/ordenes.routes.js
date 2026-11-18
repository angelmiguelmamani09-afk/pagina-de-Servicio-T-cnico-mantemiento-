import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

import {
  listarOrdenes,
  crearOrden,
  convertirSolicitud,
  asignarTecnico,
  cambiarEstadoOrden,
  obtenerOrden,
  listarMisOrdenes,
  obtenerMiOrden
} from "./ordenes.controller.js";

const router = Router();

router.use(requireAuth);

// Vistas propias: cliente y técnico
router.get("/mis-ordenes", requireRoles("CLIENTE", "TECNICO"), listarMisOrdenes);
router.get("/mis-ordenes/:id", requireRoles("CLIENTE", "TECNICO"), obtenerMiOrden);

// Administración
router.get("/", requireRoles("ADMINISTRADOR"), listarOrdenes);
router.post("/", requireRoles("ADMINISTRADOR"), crearOrden);
router.post(
  "/desde-solicitud/:solicitudId",
  requireRoles("ADMINISTRADOR"),
  convertirSolicitud
);
router.patch(
  "/:id/asignacion",
  requireRoles("ADMINISTRADOR"),
  asignarTecnico
);
router.patch(
  "/:id/estado",
  requireRoles("ADMINISTRADOR", "TECNICO"),
  cambiarEstadoOrden
);
router.get("/:id", requireRoles("ADMINISTRADOR"), obtenerOrden);

export default router;