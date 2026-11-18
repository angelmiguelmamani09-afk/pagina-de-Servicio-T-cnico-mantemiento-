# TecnoFix Integral — guía de instalación y módulos

## Requisitos
- Windows 10/11 o Linux.
- Node.js 20 o superior y npm.
- PostgreSQL 15 o superior.

## Instalación local
1. Copiar `.env.example` como `.env` en la raíz del proyecto.
2. Editar `DATABASE_URL` con el usuario, contraseña, host, puerto y base de datos PostgreSQL locales. Configurar `SESSION_SECRET` con al menos 32 caracteres aleatorios. No compartir el archivo `.env`.
3. Crear la base `tecnofix_db` (o el nombre que figure en `DATABASE_URL`).
4. En la raíz ejecutar `npm install`.
5. Ejecutar `npm run db:generate`.
6. Si se instala en una base vacía, ejecutar `npm run db:migrate` y seguir las instrucciones de Prisma. Si se usa una base que ya tiene la migración inicial aplicada, no volver a aplicar manualmente el SQL de esa migración.
7. Ejecutar `npm run admin:create` para inicializar los tres roles y crear el primer administrador. La contraseña se introduce de forma oculta en la terminal.
8. Ejecutar `npm run dev` y abrir `http://localhost:3000`. Panel administrativo: `http://localhost:3000/panel.html`.

## Roles
- `ADMINISTRADOR`: administra usuarios, catálogo, órdenes, inventario, presupuestos, pagos, garantías, opiniones y reportes.
- `TECNICO`: consulta órdenes asignadas, registra diagnósticos y repuestos, y actualiza estados permitidos.
- `CLIENTE`: consulta sus órdenes, pagos, presupuestos, garantías y notificaciones; puede aprobar o rechazar presupuestos.

## API principal
Todas las respuestas usan `{ success, message?, data? }`.

| Ruta | Acceso | Función |
|---|---|---|
| `GET /api/health` | Público | Estado del servidor |
| `GET /api/health/ready` | Público | Estado de servidor y PostgreSQL |
| `POST /api/auth/login` | Público | Iniciar sesión |
| `GET /api/auth/me` | Sesión | Usuario autenticado |
| `POST /api/auth/logout` | Sesión | Cerrar sesión |
| `/api/clientes` | Admin / cliente según ruta | Gestión de clientes |
| `/api/equipos` | Admin / cliente según ruta | Gestión de equipos |
| `/api/solicitudes` | Admin / cliente según ruta | Solicitudes |
| `/api/ordenes` | Admin / técnico / cliente según ruta | Órdenes e historial |
| `/api/ordenes/:ordenId/diagnosticos` | Admin / técnico | Diagnósticos |
| `POST /api/gestion/solicitudes` | Público | Registrar solicitud desde formulario web |
| `GET /api/gestion/catalogo` | Público | Catálogo activo |
| `/api/gestion/usuarios` | Admin | Usuarios, técnicos y cuentas de cliente |
| `/api/gestion/presupuestos` | Admin | Crear y enviar presupuestos |
| `/api/gestion/ordenes/:ordenId/presupuesto/decision` | Cliente / admin | Aprobar o rechazar presupuesto |
| `/api/gestion/ordenes/:ordenId/pagos` | Admin para registrar; propietario para consultar | Pagos y saldo |
| `/api/gestion/productos` | Admin / técnico | Inventario de productos |
| `POST /api/gestion/inventario/movimientos` | Admin | Entradas, salidas y ajustes |
| `POST /api/gestion/ordenes/:ordenId/repuestos` | Admin / técnico asignado | Consumir repuesto y descontar stock |
| `/api/gestion/ordenes/:ordenId/garantia` | Admin / cliente propietario | Emitir y consultar garantía |
| `/api/gestion/notificaciones` | Sesión / admin para crear | Notificaciones propias y emisión administrativa |
| `/api/gestion/opiniones` | Público para enviar/listar aprobadas; admin modera | Opiniones |
| `GET /api/gestion/reportes/dashboard` | Admin | Indicadores administrativos |
| `GET /api/gestion/seguimiento?codigo=...&telefono=...` | Público con verificación | Seguimiento limitado de orden |

## Reglas importantes implementadas
- El servidor valida roles; ocultar botones en el navegador no sustituye permisos.
- Las órdenes deben seguir el flujo de estados permitido.
- El diagnóstico administrativo requiere que la orden tenga un técnico asignado; el técnico solo actúa sobre órdenes propias.
- Un presupuesto por orden; aprobación expresa antes de reparar/continuar según el flujo.
- Los pagos no pueden superar el saldo del presupuesto aprobado.
- No se puede marcar una orden como entregada si no existe presupuesto aprobado y el saldo no está completamente pagado.
- Los movimientos de inventario y consumo de repuestos se registran en transacciones.
- La garantía se emite después de entregar el equipo.
- Las opiniones públicas quedan pendientes de moderación.
- El seguimiento público requiere código de orden y teléfono registrado y no expone datos personales completos.

## Consideraciones de alcance
- El modelo actual `Presupuesto` almacena subtotal, descuento y total, pero no tiene detalle de líneas de mano de obra/repuestos. Los repuestos utilizados se registran por separado en `RepuestoUtilizado`; si el proyecto exige cotizaciones itemizadas, será necesaria una ampliación del modelo y una migración adicional.
- La web pública registra solicitudes en PostgreSQL y ofrece continuar por WhatsApp. La gestión operativa se realiza desde la API y el panel administrativo inicial; no todas las pantallas de gestión (por ejemplo, formularios completos de cada módulo) están desarrolladas en el frontend.
- La notificación se almacena en la base de datos; no se integra todavía con correo, SMS ni WhatsApp automático.
- No se incluye pasarela de pagos en línea.
- La prueba final con datos reales debe ejecutarse en el equipo donde está PostgreSQL configurado. No se incluyen credenciales, `.env`, ni `node_modules` en la entrega.
