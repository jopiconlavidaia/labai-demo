# LabAI · Demo BCN Patòlegs

Interfaz de demostración de gestión de laboratorio. Usar datos ficticios. Las muestras y documentos viven en memoria de la pestaña; la configuración usa almacenamiento local del navegador.

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
