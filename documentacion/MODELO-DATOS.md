# Modelo de datos inicial

El modelo Prisma define roles, usuarios, clientes, equipos, categorías, servicios, productos, solicitudes, órdenes de trabajo, diagnósticos, historial de estados, presupuestos, pagos, movimientos de inventario, repuestos utilizados, garantías, notificaciones y opiniones.

Importes monetarios se representan con Decimal. Las relaciones de propiedad y permisos deben validarse también en los servicios del backend. Las operaciones que descuenten inventario y registren consumo deben ejecutarse en transacciones.

## Convenciones
- Identificadores internos CUID.
- Fechas en DateTime.
- Estados mediante enums.
- Código de solicitud, orden y garantía únicos.
- No borrar físicamente historial operativo; usar estados y auditoría.
