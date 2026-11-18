# TecnoFix Integral

Sistema web académico para la gestión de servicios técnicos, mantenimiento y reparación de equipos informáticos. Conserva el frontend HTML/CSS/JavaScript/jQuery y añade backend Node.js + Express, PostgreSQL y Prisma.

## Requisitos
- Node.js 20+ y npm.
- PostgreSQL 15+.
- Windows PowerShell, Linux o macOS.

## Instalación local
1. Crear una base PostgreSQL, por ejemplo `tecnofix_db`.
2. Copiar `.env.example` a `.env` y configurar `DATABASE_URL`, `PORT` y un `SESSION_SECRET` aleatorio de al menos 32 caracteres. Nunca subir `.env` a repositorios ni compartirlo.
3. En la carpeta raíz ejecutar `npm install`.
4. Ejecutar `npm run db:generate`.
5. Ejecutar `npm run db:migrate` para aplicar las migraciones existentes.
6. Ejecutar `npm run admin:create`. Este comando inicializa los roles ADMINISTRADOR, TECNICO y CLIENTE y crea el primer administrador; la contraseña se solicita sin mostrarla en pantalla.
7. Ejecutar `npm run dev`.
8. Abrir el sitio público en `http://localhost:3000` y el panel administrativo en `http://localhost:3000/panel.html`.

También se incluye `iniciar-tecnofix.ps1` como ayuda para preparar dependencias y Prisma en Windows. No reemplaza la configuración manual de `.env` ni la creación de la base de datos.

## Componentes
- `public/`: frontend servido por Express. El formulario registra solicitudes en la base de datos y ofrece continuar por WhatsApp.
- `backend/src/`: API REST, autenticación por sesión, control de roles y módulos funcionales.
- `backend/prisma/`: esquema y migración inicial de PostgreSQL.
- `documentacion/ENTREGA-TECNICA.md`: instalación, rutas API, reglas de negocio y alcance.
- `panel.html`: panel inicial de acceso y resumen administrativo.

## Módulos de API
Autenticación y roles; clientes; equipos; solicitudes; órdenes de trabajo; diagnósticos; usuarios y cuentas de cliente; catálogo; presupuestos; pagos y saldos; inventario; consumo de repuestos; garantías; notificaciones; opiniones moderadas; reportes y seguimiento público verificado.

## Comprobaciones
- `GET /api/health`: comprueba que Express responde.
- `GET /api/health/ready`: comprueba Express y conexión con PostgreSQL.
- Las rutas privadas requieren una sesión válida y aplican permisos por rol en el backend.
- La entrega no incluye `.env`, credenciales ni `node_modules`; ejecutar `npm install` en el equipo de destino.

## Alcance académico y límites conocidos
El esquema existente de `Presupuesto` contiene subtotal, descuento y total, pero no líneas detalladas de cotización. Los repuestos utilizados se almacenan por separado. La notificación es interna (base de datos), sin envío automático por correo/SMS/WhatsApp. No hay pasarela de pagos en línea. El panel visual entregado muestra indicadores y órdenes recientes; las operaciones administrativas detalladas se consumen mediante la API. Antes de usarlo en producción se recomienda añadir interfaz CRUD completa, CSRF/origin estricto, auditoría de seguridad, pruebas automatizadas de integración y política de copias de seguridad.
