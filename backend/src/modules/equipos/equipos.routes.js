
import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

import {
  listarEquipos,
  crearEquipo,
  obtenerEquipo,
  actualizarEquipo,
  listarMisEquipos
} from "./equipos.controller.js";

const router = Router();

// Todas las rutas requieren autenticación.
router.use(requireAuth);

// Equipos asociados al usuario cliente autenticado.
router.get("/me", requireRoles("CLIENTE"), listarMisEquipos);

// Administración de equipos.
router.get("/", requireRoles("ADMINISTRADOR"), listarEquipos);
router.post("/", requireRoles("ADMINISTRADOR"), crearEquipo);
router.get("/:id", requireRoles("ADMINISTRADOR"), obtenerEquipo);
router.patch("/:id", requireRoles("ADMINISTRADOR"), actualizarEquipo);

export default router;
