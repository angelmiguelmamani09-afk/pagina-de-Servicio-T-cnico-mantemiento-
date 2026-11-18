import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRoles } from "../../middlewares/roles.middleware.js";

import {
    crearDiagnostico,
    listarDiagnosticosPorOrden
} from "./diagnosticos.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(requireRoles("ADMINISTRADOR", "TECNICO"));

router.get("/", listarDiagnosticosPorOrden);
router.post("/", crearDiagnostico);

export default router;