
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./config/database.js";
import { sessionMiddleware } from "./config/session.js";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import clientesRoutes from "./modules/clientes/clientes.routes.js";
import equiposRoutes from "./modules/equipos/equipos.routes.js";
import solicitudesRoutes from "./modules/solicitudes/solicitudes.routes.js";
import ordenesRoutes from "./modules/ordenes/ordenes.routes.js";
import diagnosticosRoutes from "./modules/diagnosticos/diagnosticos.routes.js";
import gestionRoutes from "./modules/gestion/gestion.routes.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, "../../public");

export const app = express();

app.disable("x-powered-by");

// Necesario detrás del proxy de Render/Railway para que la cookie de sesión "secure" funcione.
app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// Sesiones persistentes almacenadas en PostgreSQL.
app.use(sessionMiddleware);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/gestion", gestionRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use(
    "/api/ordenes/:ordenId/diagnosticos",
    diagnosticosRoutes
);

// Comprueba que Express está funcionando.
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend TecnoFix operativo",
    data: {
      status: "ok",
      timestamp: new Date().toISOString()
    }
  });
});

// Comprueba que PostgreSQL también está disponible.
app.get("/api/health/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "TecnoFix está listo",
      data: {
        server: "ok",
        database: "connected",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error comprobando PostgreSQL:", error.message);

    res.status(503).json({
      success: false,
      message: "Base de datos no disponible",
      data: {
        server: "ok",
        database: "disconnected"
      }
    });
  }
});

// Respuestas para rutas API inexistentes.
app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint API no encontrado"
  });
});

// Archivos del frontend existente.
app.use(express.static(publicDir, {
  extensions: ["html"],
  index: "index.html",
  dotfiles: "deny"
}));

app.use((_req, res) => {
  res.status(404).send("Página no encontrada");
});

// Manejo centralizado de errores.
app.use((err, _req, res, _next) => {
  console.error("Error interno:", err);

  res.status(err.status || 500).json({
    success: false,
    message: "Error interno del servidor"
  });
});
