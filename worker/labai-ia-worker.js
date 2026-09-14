// Proxy de IA para LabAI: reenvía las peticiones del navegador a Groq usando
// una clave guardada como secreto del Worker, para que nadie tenga que meter
// su propia API key. El modelo anterior (llama-3.3-70b-versatile) fue
// retirado por Groq el 2026-08-16; este usa el modelo de migración recomendado.
const ALLOWED_ORIGINS = [
  'https://jopiconlavidaia.github.io',
];

const DEFAULT_MODEL = 'openai/gpt-oss-120b';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin);
    const error = (status, message) => new Response(JSON.stringify({ error: { message } }), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    if (!ALLOWED_ORIGINS.includes(origin)) return error(403, 'Origen no permitido');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }
    if (!env.GROQ_API_KEY) return error(503, 'Motor de IA no configurado');

    let body;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 64000) return error(413, 'Petición demasiado grande');
      body = JSON.parse(raw);
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'JSON inválido' } }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body || !Array.isArray(body.messages) || body.messages.length<1 || body.messages.length>50 ||
        body.messages.some(m => !m || !['system','user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim())) {
      return error(400, 'Mensajes inválidos');
    }
    if (body.temperature != null && (typeof body.temperature !== 'number' || !Number.isFinite(body.temperature) || body.temperature<0 || body.temperature>2)) return error(400, 'Temperatura inválida');
    if (body.max_tokens != null && (!Number.isInteger(body.max_tokens) || body.max_tokens<1 || body.max_tokens>4096)) return error(400, 'Límite de tokens inválido');

    try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        model: env.GROQ_MODEL || DEFAULT_MODEL,
        temperature: body.temperature ?? 0.4,
        max_tokens: body.max_tokens ?? 800,
        messages: body.messages,
      }),
    });

    const data = await groqRes.text();
    return new Response(data, {
      status: groqRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    } catch (e) {
      return error(e.name === 'TimeoutError' || e.name === 'AbortError' ? 504 : 502, 'El proveedor de IA no responde. Inténtalo de nuevo.');
    }
  },
};

function buildCorsHeaders(origin) {
  const headers = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}
