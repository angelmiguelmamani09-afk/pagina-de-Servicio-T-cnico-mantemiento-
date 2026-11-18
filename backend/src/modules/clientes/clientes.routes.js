import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

import {
  listarClientes,
  crearCliente,
  obtenerCliente,
  actualizarCliente,
  obtenerMiPerfil
} from "./clientes.controller.js";

const router = Router();

// Todas las rutas requieren autenticación.
router.use(requireAuth);

// Perfil del cliente autenticado.
router.get(
  "/me",
  requireRoles("CLIENTE"),
  obtenerMiPerfil
);

// Operaciones exclusivas del administrador.
router.get(
  "/",
  requireRoles("ADMINISTRADOR"),
  listarClientes
);

router.post(
  "/",
  requireRoles("ADMINISTRADOR"),
  crearCliente
);

router.get(
  "/:id",
  requireRoles("ADMINISTRADOR"),
  obtenerCliente
);

router.patch(
  "/:id",
  requireRoles("ADMINISTRADOR"),
  actualizarCliente
);

export default router;