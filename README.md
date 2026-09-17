# LabAI · Demo BCN Patòlegs

Interfaz de demostración de gestión de laboratorio. Usar exclusivamente datos ficticios. Las muestras, documentos y ajustes viven en memoria y se descartan al cerrar sesión o recargar. Solo el idioma y la preferencia de la guía se guardan en el navegador. Las cuentas de prueba creadas se conservan hasta recargar la pestaña.

## Acceso y recepción (17/09/2026)

Usuarios de prueba: `admin`, `marta` y `recepcion`. Contraseña pública común: `DemoBCN2026!`. El administrador puede crear y desactivar cuentas de prueba. El personal no ve las vistas de administración. Hay cierre de sesión y caducidad de interfaz tras 15 minutos sin actividad. **Es una simulación de acceso, no autenticación segura**: no protege datos reales ni sustituye permisos en el servidor.

Después de registrar una muestra con centro, la siguiente recepción ofrece recuperar centro, mútua, médico, tipo, especialidad y número de botes. Requiere aceptar; no copia nombre, edad, sexo, historia, nacimiento, referencia propia de la muestra, descripción ni prioridad.

La demo pública usa IA simulada y bloquea las llamadas de sus formularios al proveedor externo. El Worker anterior sigue siendo un componente independiente: este cambio no lo elimina ni transforma en backend clínico. Véase [SEGURIDAD_DESPLIEGUE.md](SEGURIDAD_DESPLIEGUE.md) antes de planificar datos reales.

## Desarrollo local

Requiere Node.js 24 y npm.

```sh
npm ci
npm test
npm start
```

Abrir http://127.0.0.1:4173. La interfaz carga React, Babel y QR desde CDN, por lo que requiere conexión. El servidor local solo sirve la página, no es un servidor clínico ni almacena información.

El proxy de producción no admite el origen local por defecto. En local se puede revisar la interfaz y el modo simulado; las pruebas del Worker usan un proveedor simulado sin consumir la API.

Véase [REVISION.md](REVISION.md) para correcciones, evidencias y pendientes, y [worker/README.md](worker/README.md) para el despliegue independiente del proxy.
