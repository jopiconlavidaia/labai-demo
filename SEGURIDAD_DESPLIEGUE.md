Actualización 19/09/2026: a petición del usuario, la demo vuelve a conectar con Groq a través del Worker de Cloudflare. Solo datos ficticios: el contenido enviado a IA sale del navegador hacia esos servicios. Se mantienen login de demostración y datos en memoria; esto no habilita uso clínico. Las referencias posteriores a IA bloqueada describen el estado del 17/09, sustituido por esta actualización.

# Separación entre demo y sistema del laboratorio

Revisión del 17/09/2026. El cliente dispone de un servidor físico en sus instalaciones; todavía no hay acceso ni especificaciones. Este documento define el trabajo pendiente, no certifica la aplicación ni declara listo un despliegue clínico.

## Demo pública actual

- Login y permisos de interfaz con cuentas ficticias y contraseña publicada. Cualquier persona que descargue el HTML puede inspeccionarlo o modificarlo: no hay autenticación ni autorización real.
- Muestras, documentos y ajustes en memoria. Cierre de sesión desmonta la aplicación y descarta esos cambios; recargar vuelve a la entrada. Las cuentas de prueba sobreviven a cerrar sesión, hasta recargar.
- Caducidad de interfaz tras 15 minutos sin actividad. No es una sesión de servidor ni una garantía de borrado forense de memoria.
- La configuración ya no lee ni guarda catálogos o personal en localStorage. Las antiguas claves de versiones anteriores pueden seguir en el navegador; se ignoran, no se borran automáticamente. Idioma y guía sí se guardan.
- El siguiente paciente requiere confirmar la reutilización de datos comunes. Se excluyen identificadores, edad, sexo, hallazgos y prioridad. La información clínica debe comprobarse por paciente.
- Las llamadas de IA de formularios se bloquean antes de usar fetch. El indicador y la guía identifican la simulación. La página sigue cargando librerías y fuentes de terceros: no es una aplicación aislada de Internet.
- El Worker de Cloudflare anterior conserva su despliegue independiente. Filtrar Origin no es autenticar al solicitante. Antes de reutilizarlo hacen falta autenticación, cuotas y revisión de destino/condiciones del tratamiento. Deshabilitar llamadas en el frontend no protege su endpoint de peticiones directas.
- Impresiones o exportaciones solicitadas por el usuario crean copias fuera de la sesión. Utilizar únicamente información ficticia también en ellas.

## Arquitectura prevista en el cliente

Navegadores de puestos → HTTPS en la red autorizada → aplicación/API con autenticación y permisos → base de datos central y almacenamiento de documentos en el servidor. Las copias requieren un destino separado aprobado por el cliente y pruebas de restauración. El acceso remoto de soporte debe ser controlado, temporal y auditable.

No basta cambiar `PUBLIC_DEMO` a `false` ni copiar este HTML al servidor. Hay que desarrollar y validar persistencia, sesiones y operaciones multiusuario; empaquetar las dependencias localmente y eliminar la carga de código de CDN del entorno clínico.

## Criterios mínimos antes de usar datos reales

1. Identidades individuales, altas/bajas y recuperación de acceso; credenciales almacenadas mediante mecanismos robustos del servidor o integración con el directorio del cliente. Considerar segundo factor para administración y acceso remoto.
2. Autorizar cada operación en el backend, con denegación por defecto. Definir recepción, técnico, facultativo, responsable y administrador. Administrar el sistema no debe implicar poder firmar clínicamente. Comprobar también acceso a datos de otros centros.
3. Sesiones gestionadas por el servidor, cookies HttpOnly/Secure/SameSite según arquitectura, caducidad y revocación. No guardar credenciales ni tokens de sesión en localStorage. Protección de formularios, límites de intentos y validación de entradas.
4. Base de datos con transacciones, numeración única concurrente, controles de edición simultánea, migraciones versionadas, trazabilidad de autor/fecha/cambio y pruebas que eviten mezclar pacientes/muestras.
5. Ciclo de informes con borrador, revisión, validación y rectificación; definición de firma e integración si se requiere. Una marca visual de «validado» no constituye firma digital.
6. HTTPS, cifrado de almacenamiento y copias según riesgo, gestión de claves, actualizaciones y mínimos privilegios del servicio. Acordar supervisión del sistema con el informático del cliente.
7. Plan de copias con retención acordada y restauración real en un entorno separado; objetivos de pérdida admisible y recuperación definidos por el laboratorio. Copia en el mismo disco no resuelve fallo del servidor.
8. Revisar con el responsable del tratamiento las bases, conservación, contratos de soporte/proveedores, evaluación del riesgo y necesidad de evaluación de impacto. No asumir cumplimiento RGPD por alojamiento local.
9. IA desconectada de datos reales por defecto. Cualquier activación requiere aprobar finalidad, proveedor/destino, condiciones, acceso y validación humana. La simulación no valida el comportamiento de un modelo clínico.
10. Piloto con el laboratorio, pruebas de concurrencia y recuperación, aceptación escrita del alcance, formación y procedimiento de contingencia. Dimensión inicial: unas 10 personas; diseñar y medir crecimiento a 25 y después 50 según carga.

## Evidencia y límites

Las pruebas automáticas verifican reglas y handlers, compilación del JSX, restricciones de demo, credenciales simuladas, reutilización y Worker con proveedor simulado. No son una prueba de penetración, validación clínica ni ensayo sobre el servidor del cliente.

Referencias técnicas: [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html). Contexto de salud: [AEPD, brechas de datos en el sector de la salud](https://www.aepd.es/areas-de-actuacion/salud/brechas-de-datos-personales-en-el-sector-de-la-salud).
