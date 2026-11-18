
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { sessionPool } from "./config/session.js";

const server = app.listen(env.port, () => {
  console.log(`TecnoFix: http://localhost:${env.port}`);
  console.log(`API health: http://localhost:${env.port}/api/health`);
  console.log(`API readiness: http://localhost:${env.port}/api/health/ready`);
});

let shuttingDown = false;

async function close(signal) {
  if (shuttingDown) return;

  shuttingDown = true;
  console.log(`${signal}: cerrando TecnoFix...`);

  server.close(async (error) => {
    if (error) {
      console.error("Error cerrando servidor:", error);
      process.exitCode = 1;
    }

    try {
      await prisma.$disconnect();
      console.log("Conexión Prisma cerrada correctamente.");

      await sessionPool.end();
      console.log("Pool de sesiones PostgreSQL cerrado correctamente.");
    } catch (dbError) {
      console.error("Error cerrando Prisma:", dbError);
      process.exitCode = 1;
    }

    process.exit();
  });
}

process.on("SIGINT", () => close("SIGINT"));
process.on("SIGTERM", () => close("SIGTERM"));
