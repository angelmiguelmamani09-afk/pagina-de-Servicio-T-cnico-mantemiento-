# Arquitectura técnica de TecnoFix Integral

## Decisiones
- Aplicación monolítica modular.
- Frontend existente (HTML, CSS, JavaScript y jQuery) servido desde `public/`.
- Backend Node.js + Express mediante API REST.
- PostgreSQL como persistencia y Prisma ORM.
- Tres roles: ADMINISTRADOR, TECNICO y CLIENTE.
- Desarrollo inicial local en Windows.

## Capas
1. Presentación: sitio público y portales por rol.
2. Aplicación: rutas, controladores, servicios, validaciones y autorización.
3. Persistencia: Prisma y PostgreSQL.

## Límites de confianza
El navegador nunca se conecta directamente a PostgreSQL. Toda operación privada debe verificar sesión, rol y propiedad del recurso en el servidor. No almacenar contraseñas ni tokens en localStorage.

## Rutas locales previstas
- Web: http://localhost:3000
- API health: http://localhost:3000/api/health
- API: http://localhost:3000/api

## Estado del scaffold
La primera base incluye servidor Express, servicio estático y endpoint health. Autenticación, módulos de negocio, sesiones y operaciones CRUD todavía deben implementarse y probarse.
