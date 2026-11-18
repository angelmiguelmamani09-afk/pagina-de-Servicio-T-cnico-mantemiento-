# TecnoFix en Supabase: pasos

1. Crear proyecto en Supabase y guardar la contraseña de la base de datos.
2. Supabase > Connect: copiar "Transaction pooler" (6543) y "Session pooler" (5432).
3. Editar tu `.env` (basado en `.env.example`) con DATABASE_URL, DIRECT_URL y SESSION_SECRET.
4. En la carpeta del proyecto:
   ```
   npm install
   npm run db:deploy
   ```
5. Supabase > SQL Editor: pegar y ejecutar `supabase-setup.sql`.
6. `npm run admin:create` y luego `npm run dev`.
7. Probar http://localhost:3000/api/health/ready (debe decir "connected") y el login en /panel.html.
8. Desplegar en Render/Railway: Build `npm install`, Start `npm start`.
   Variables: NODE_ENV=production, DATABASE_URL, DIRECT_URL, SESSION_SECRET (nuevo).
9. Probar https://TU-APP/api/health/ready.
