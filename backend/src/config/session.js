import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

// Limpia parámetros que son solo de Prisma (pgbouncer, connection_limit, schema)
// para que el driver "pg" no los reciba.
function poolConnectionString(raw) {
  const url = new URL(raw);
  ["pgbouncer", "connection_limit", "schema"].forEach((k) => url.searchParams.delete(k));
  return url.toString();
}

const isLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(env.databaseUrl);

// Conexión de PostgreSQL destinada al almacenamiento de sesiones.
// Supabase exige SSL; en local (localhost) se desactiva.
export const sessionPool = new Pool({
  connectionString: poolConnectionString(env.databaseUrl),
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 3
});

sessionPool.on("error", (error) => {
  console.error("Error en el pool de sesiones:", error.message);
});

// Adaptador que guarda las sesiones en PostgreSQL.
const PgSession = connectPgSimple(session);

// La tabla "session" se crea con supabase-setup.sql (no automáticamente).
const sessionStore = new PgSession({
  pool: sessionPool,
  tableName: "session",
  createTableIfMissing: false
});

// Configuración de sesiones de TecnoFix.
export const sessionMiddleware = session({
  name: "tecnofix.sid",
  secret: env.sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000
  }
});
