import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

const router = Router();

// Panel de administración.
// Solo pueden acceder usuarios autenticados con rol ADMINISTRADOR.
router.get(
  "/dashboard",
  requireAuth,
  requireRoles("ADMINISTRADOR"),
  (req, res) => {
    return res.json({
      success: true,
      message: "Acceso autorizado al panel de administración",
      data: {
        user: {
          id: req.user.id,
          nombre: req.user.nombre,
          email: req.user.email,
          rol: req.user.rol.nombre
        }
      }
    });
  }
);

export default router;