import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  getCurrentUser
} from "./auth.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiados intentos. Inténtalo más tarde."
  }
});

// Iniciar sesión.
router.post("/login", loginLimiter, login);

// Consultar usuario autenticado.
router.get("/me", requireAuth, getCurrentUser);

// Cerrar sesión.
router.post("/logout", requireAuth, logout);

export default router;