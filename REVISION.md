Actualización 19/09/2026: a petición del usuario, la demo vuelve a conectar con Groq a través del Worker de Cloudflare. Solo datos ficticios: el contenido enviado a IA sale del navegador hacia esos servicios. Se mantienen login de demostración y datos en memoria; esto no habilita uso clínico. Las referencias posteriores a IA bloqueada describen el estado del 17/09, sustituido por esta actualización.

# Revisión de la demo de BCN Patòlegs

## Actualización del 17 de septiembre de 2026

Se conservan las mejoras de catálogos, búsqueda, ordenación y preformatos de las dos ramas previas. Se añade acceso de demostración para dirección/personal, gestión de cuentas ficticias, cierre de sesión, caducidad de interfaz y reutilización explícita de datos comunes en la siguiente recepción. Corregida la presentación de edad cero y sexo no indicado.

La demo pública deja de enviar formularios a IA externa y deja de leer/escribir configuración clínica o de personal en localStorage. Muestras y ajustes se descartan al cerrar sesión; las cuentas de prueba al recargar. La guía y los indicadores reflejan la simulación. El Worker sigue desplegado de forma independiente y no se ha modificado en esta actualización.

`npm test`: **22 pruebas correctas** de JSX, reglas, handlers y Worker simulado. Incluyen bloqueo de llamadas externas, credenciales de prueba, permisos de navegación y exclusión de datos personales en la plantilla de recepción. Las pruebas anteriores del frontend de IA externa se sustituyen por pruebas de que la demo no emite esas peticiones.

En navegador local se verifican contraseña incorrecta, entrada de administrador, dos pacientes ficticios sucesivos con reutilización aceptada, opción de empezar en blanco, creación y desactivación de una cuenta ficticia, rechazo del acceso desactivado, cierre y entrada como recepción. El empleado carece de menús administrativos y ve su horario propio sin selector de otros empleados. Recargar devuelve a login; consola sin errores en el recorrido. Se inspecciona visualmente el login a 390 × 844. No se ha esperado 15 minutos para medir la caducidad en tiempo real ni probado el servidor físico.

La autenticación definitiva, base de datos, validación clínica, recuperación y seguridad siguen pendientes. Véase [SEGURIDAD_DESPLIEGUE.md](SEGURIDAD_DESPLIEGUE.md). El registro que sigue describe la revisión anterior y debe leerse como histórico.

Fecha: 14 de septiembre de 2026. Correcciones publicadas en GitHub Pages y Worker de Cloudflare actualizado (versión 9add8dae).

Comprobación real del Worker: HTTP 200, origen CORS correcto y respuesta `OK` sin datos personales. Se detectó que el sondeo original de 3 tokens agotaba el límite antes de producir contenido; se amplió a 200 tokens y una petición explícita de respuesta breve.

Actualización de repositorio: revisión trasladada a `jopiconlavidaia/labai-demo`, sobre el commit `2e450b3`. La única diferencia respecto a la base anterior era el nuevo origen CORS; se ha conservado `https://jopiconlavidaia.github.io` y se han actualizado sus pruebas. El usuario confirma que no existe otra base de datos ni backend.

## Resultado y alcance

Se revisó el código de `index.html` y del proxy, se abrió la demo publicada para reproducir fallos y se ejecutó una copia local. La aplicación es una demo de interfaz, no un sistema clínico completo. No se han usado pacientes reales para las nuevas pruebas.

## Correcciones

- Altas de muestras y documentos con el año actual; recepción y fecha de informe actuales. Fechas administrativas en hora local, evitando el cambio de día por UTC.
- Validación de edades enteras entre 0 y 120 y botes enteros. Se reprodujo en navegador que la versión publicada permitía edad -1; la copia corregida la bloquea y permite edad 0.
- Validación de tarifas, descuentos, cantidades e importes. Cambiar el cliente de un documento elimina las líneas anteriores; también se valida la pertenencia de sus muestras. No se permite eliminar clientes con documentos vinculados.
- Comprobación del tipo de colección recuperada del almacenamiento local. No constituye validación completa de todos los esquemas históricos.
- Los informes nuevos no reciben hallazgos ni orientación diagnóstica de relleno. Se retiró la asignación de SNOMED por especialidad de la ficha y del contexto enviado para redactar informes.
- La simulación de informes conserva el texto aportado y deja diagnóstico/codificación pendientes; no afirma confirmar una orientación ni añade recomendaciones por especialidad.
- Selector y campos del informe bloqueados durante generación. Selección de documento bloqueada durante análisis para evitar resultados asociados a otra selección.
- Respuestas simuladas identificadas explícitamente. Eliminadas páginas aleatorias de fuentes y la afirmación de haber indexado archivos cuyo contenido no se lee.
- Peticiones de IA con tiempo máximo y rechazo de respuestas vacías. El indicador solo declara IA activa tras comprobar una respuesta.
- Proxy con rechazo de orígenes no permitidos, validación de mensajes y parámetros, límite de tamaño aceptado, comprobación de configuración y tratamiento de fallos del proveedor.
- Textos de cifrado, alojamiento, certificación y auditoría corregidos para reflejar la implementación de esta demo.
- Informe identificado como borrador también al exportar; añadido al área imprimible (antes el CSS de impresión lo ocultaba). Falta validar la paginación con impresoras reales.
- Cabecera móvil sin controles recortados; nombre accesible del botón de notificaciones.

## Evidencia de pruebas

`npm test`: **17 pruebas correctas**. Incluyen compilación de todo el JSX, inicialización del módulo, handlers de recepción/facturación con estado React simulado, validaciones numéricas, fechas, calendario, almacenamiento, respuesta de IA y proxy con proveedor simulado. No son 17 pruebas completas de navegador ni una validación clínica.

Auditoría de las dependencias npm instaladas: **0 vulnerabilidades reportadas** tras actualizar Babel. Esto no cubre las dependencias CDN de la aplicación ni equivale a una auditoría de seguridad completa.

Pruebas de navegador realizadas:

- Apertura de panel, muestras, informes, archivo, clientes, administración, personal, calidad, equipo, configuración, análisis y asistente.
- Alta de `PACIENTE FICTICIO QA`, edad 0, dos botes; código `26B131`, referencia `BP-26-00927` y fecha actual.
- Recorrido recepción → inclusión → procesamiento → diagnóstico → validado; bloqueo por falta de material/macroscopia y por falta de código/texto diagnóstico.
- Traslado de macroscopia y diagnóstico del caso ficticio al formulario del informe; bloqueo del selector durante generación y resultado señalado como simulación.
- Recarga final con campos de informe vacíos en casos sin hallazgos. La simulación sin códigos inventados se verificó además con prueba automática.
- Panel a 390 × 844, revisión visual y corrección de la cabecera. Restaurado el tamaño del navegador al finalizar.

La IA local entró en modo demostración. No se validó el proveedor en producción ni se desplegó el Worker modificado. El formulario publicado se inspeccionó sin enviar el alta inválida.

## Pendientes para un producto real

1. **Servidor y persistencia:** muestras, documentos, borradores y numeraciones desaparecen al recargar; no hay coordinación entre puestos, copias ni recuperación. Hace falta confirmar si existe otro repositorio con esta implementación.
2. **Identidad y permisos:** el perfil y las vistas de administrador/empleado son controles de interfaz, sin autenticación ni autorización del servidor. El filtro de Origin del Worker no es autenticación: un cliente ajeno al navegador puede falsificarlo. Faltan límites de uso por usuario y protección del coste del proveedor.
3. **Informes y archivo:** no hay almacenamiento/versionado del informe, firma real ni recuperación del informe firmado. Marcar una muestra como validada no firma un documento. El archivo vuelve a abrir el generador.
4. **Auditoría:** los eventos y los tiempos de trazabilidad son ejemplos fijos. Deben generarse a partir de operaciones persistidas con actor y fecha reales. Los indicadores del panel y equipo incluyen cifras de ejemplo.
5. **IA/documentos:** no existe extracción, OCR ni búsqueda sobre documentos. El asistente puede transmitir nombres y contexto de muestras al proveedor; no existe anonimización. Mantener exclusivamente datos ficticios hasta definir e implementar el flujo de datos.
6. **Administración:** confirmar cuándo una muestra queda reservada/facturada, cancelaciones, abonos, impuestos, redondeo y numeración. Actualmente cualquier documento vincula las muestras y puede impedir seleccionarlas de nuevo; falta especificar el comportamiento esperado por el laboratorio.
7. **Personal:** confirmar cómputo anual y días laborables, festivos, solapamientos, saldos, turnos nocturnos y efecto real de aprobar un cambio. No se modificó la política de vacaciones sin esos criterios.
8. **Calidad y operación:** validación por profesionales de plantillas, códigos, transiciones, trazabilidad, datos de identidad y formato de impresión. Probar lectores QR, impresoras de etiquetas, concurrencia, pérdida de red, recuperación y volúmenes reales.
9. **Interfaz:** completar etiquetas accesibles y navegación de teclado, traducciones y pruebas de todas las variantes en móvil; empaquetar React/Babel con versiones fijadas para eliminar compilación y dependencias de CDN en tiempo de ejecución.

No se afirma que todos los flujos posibles estén probados ni que esta demo esté lista para uso clínico.
