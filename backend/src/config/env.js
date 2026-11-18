import dotenv from "dotenv";
dotenv.config();

const required = ["DATABASE_URL", "SESSION_SECRET"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta configurar ${key} en el archivo .env`);
}
export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET
};
