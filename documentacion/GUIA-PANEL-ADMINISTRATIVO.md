# Guía del panel administrativo TecnoFix Integral

## Acceso

1. Abre PowerShell en la carpeta raíz del proyecto (la que contiene `package.json`).
2. Si es la primera ejecución en ese equipo, instala las dependencias con `npm install`.
3. Comprueba que PostgreSQL esté iniciado y que el archivo `.env` local tenga la configuración de conexión correcta. No compartas ese archivo.
4. Ejecuta `npm run dev` y mantén esa ventana abierta.
5. En el navegador entra a `http://localhost:3000/panel.html` e inicia sesión con una cuenta de rol `ADMINISTRADOR`.

## Secciones disponibles

- **Resumen:** indicadores del sistema y órdenes recientes.
- **Clientes:** registrar, buscar y editar clientes.
- **Equipos:** registrar equipos y vincularlos a un cliente.
- **Solicitudes:** revisar solicitudes recibidas, convertirlas en órdenes o rechazarlas.
- **Órdenes de trabajo:** crear órdenes, asignar técnico, registrar diagnóstico, presupuesto, aprobación administrativa, pagos, cambios de estado y emisión de garantía (después de entregar el equipo).
- **Personal y usuarios:** crear técnicos/administradores y activar o desactivar cuentas.
- **Inventario:** crear productos y registrar entradas, salidas y ajustes de stock.
- **Servicios y categorías:** crear categorías y servicios del catálogo.

## Flujo de prueba recomendado

1. Registrar un cliente ficticio.
2. Registrar un equipo asociado a ese cliente.
3. Crear una orden para ese cliente y equipo.
4. Asignar un técnico.
5. Cambiar el estado a `EN_DIAGNOSTICO` y registrar el diagnóstico.
6. Crear el presupuesto. La orden debe estar en diagnóstico o con presupuesto pendiente.
7. Para una demostración administrativa, aprobar el presupuesto desde la acción de gestión. En el flujo real, la aprobación debe realizarla el cliente desde su cuenta.
8. Registrar un pago parcial, sin superar el saldo pendiente.
9. Avanzar el estado de la orden hasta `ENTREGADO` según el trabajo realizado.

## Consideraciones

- Los botones llaman a las API existentes y respetan sus permisos y validaciones. Si una operación no cumple las reglas del backend, se muestra el mensaje devuelto por el servidor.
- No se deben borrar tablas ni ejecutar un restablecimiento de la base de datos para probar el panel.
- Esta entrega no incluye `.env` ni `node_modules`. Conserva el `.env` de tu equipo y ejecuta `npm install` si fuera necesario.
- La opción de aprobación administrativa se incluye para facilitar una demostración local; en producción, el cliente debe aprobar o rechazar su presupuesto con una cuenta vinculada.
