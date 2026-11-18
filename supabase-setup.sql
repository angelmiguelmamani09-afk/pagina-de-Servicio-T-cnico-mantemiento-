-- TecnoFix en Supabase: ejecutar en SQL Editor DESPUÉS de "npm run db:deploy".

-- 1) Tabla de sesiones (la usa connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid"    varchar      NOT NULL PRIMARY KEY,
  "sess"   json         NOT NULL,
  "expire" timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- 2) Seguridad: activar RLS en todas las tablas de "public".
--    Sin políticas, la API pública de Supabase (clave anon) no puede leer nada.
--    Tu servidor Express usa el rol postgres, que ignora RLS, así que sigue funcionando.
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- 3) Capa extra: quitar permisos a los roles de la API pública.
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- Nota: si en el futuro añades tablas con una migración, vuelve a ejecutar el paso 2.
