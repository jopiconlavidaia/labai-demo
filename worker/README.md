# Worker de IA para LabAI

Proxy que guarda la clave de Groq en el servidor para que nadie tenga que
meter su propia API key en la demo. El Worker anterior (cuenta Cloudflare de
`la-costa-agency1`) dejó de funcionar porque pedía el modelo
`llama-3.3-70b-versatile`, retirado por Groq el 2026-08-16. Este Worker usa
`openai/gpt-oss-120b`, el modelo de migración que recomienda Groq.

## Desplegar (5 minutos, cuenta gratuita)

1. Consigue una API key de Groq gratis en https://console.groq.com/keys
2. Entra en https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
3. Ponle un nombre (por ejemplo `labai-ia`) y crea el Worker.
4. En el editor, sustituye el código por defecto por el de
   [`labai-ia-worker.js`](labai-ia-worker.js) de esta carpeta, y despliega.
5. Ve a **Settings → Variables and Secrets** del Worker y añade:
   - `GROQ_API_KEY` (tipo *Secret*) → tu clave de Groq.
   - `GROQ_MODEL` (opcional, tipo *Text*) → `openai/gpt-oss-120b` (ya es el valor por defecto si no la pones).
6. Copia la URL del Worker, algo como `https://labai-ia.<tu-subdominio>.workers.dev`.

## Conectarlo a la app

Pásame esa URL y actualizo `PROXY_URL` en `index.html` (línea ~1071) para
que apunte ahí en vez de al Worker antiguo.

Si el dominio de GitHub Pages cambia, actualiza también `ALLOWED_ORIGINS`
en `labai-ia-worker.js` antes de desplegar — si no, el navegador bloqueará
las peticiones por CORS aunque el Worker funcione.
