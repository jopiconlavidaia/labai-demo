// Proxy de IA para LabAI: reenvía las peticiones del navegador a Groq usando
// una clave guardada como secreto del Worker, para que nadie tenga que meter
// su propia API key. El modelo anterior (llama-3.3-70b-versatile) fue
// retirado por Groq el 2026-08-16; este usa el modelo de migración recomendado.
const ALLOWED_ORIGINS = [
  'https://lacostaagency1.github.io',
];

const DEFAULT_MODEL = 'openai/gpt-oss-120b';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'JSON inválido' } }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
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
  },
};

function buildCorsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}
