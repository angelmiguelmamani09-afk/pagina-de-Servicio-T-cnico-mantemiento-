import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

import {
  listarSolicitudes,
  crearSolicitud,
  listarMisSolicitudes,
  obtenerMiSolicitud,
  obtenerSolicitud,
  actualizarSolicitud
} from "./solicitudes.controller.js";

const router = Router();

router.use(requireAuth);

// Rutas del cliente
router.post("/", requireRoles("CLIENTE"), crearSolicitud);
router.get("/me", requireRoles("CLIENTE"), listarMisSolicitudes);
router.get("/me/:id", requireRoles("CLIENTE"), obtenerMiSolicitud);

// Rutas del administrador
router.get("/", requireRoles("ADMINISTRADOR"), listarSolicitudes);
router.get("/:id", requireRoles("ADMINISTRADOR"), obtenerSolicitud);
router.patch("/:id", requireRoles("ADMINISTRADOR"), actualizarSolicitud);

export default router;