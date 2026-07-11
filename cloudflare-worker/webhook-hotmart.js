// Webhook de Hotmart en Cloudflare Workers.
// Al aprobarse una compra, genera un código de acceso (mismo algoritmo que
// src/app/codigos.ts) y lo envía por correo vía Resend.
//
// Secrets requeridos (Settings → Variables → agregar como "Secret", nunca
// como texto plano): RESEND_API_KEY, HOTMART_HOTTOK, RESEND_FROM_EMAIL

const CODE_ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_SECRETO = 'GLP1-GUIA-ALIMENTACION-2026-K7R4';
const CODE_LARGO_CUERPO = 6;
const APP_URL = 'https://usuariosdeglp-1.site/app/';

function fnv1a(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function checksum(cuerpo) {
  const h = fnv1a(cuerpo + CODE_SECRETO);
  const n = CODE_ALFABETO.length;
  return CODE_ALFABETO[h % n] + CODE_ALFABETO[Math.floor(h / n) % n];
}

function generarCodigo() {
  const n = CODE_ALFABETO.length;
  const rnd = new Uint32Array(CODE_LARGO_CUERPO);
  crypto.getRandomValues(rnd);
  let cuerpo = '';
  for (let i = 0; i < CODE_LARGO_CUERPO; i++) cuerpo += CODE_ALFABETO[rnd[i] % n];
  const full = cuerpo + checksum(cuerpo);
  return `GLP1-${full.slice(0, 4)}-${full.slice(4)}`;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function emailHtml(nombre, codigo) {
  const safeNombre = escapeHtml(nombre);
  const safeCodigo = escapeHtml(codigo);
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#F3EFE7;font-family:Georgia,'Times New Roman',serif;color:#17140C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EFE7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E4DFD0;">
        <tr><td style="padding:28px 32px 4px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#A8860D;font-family:Arial,sans-serif;font-weight:bold;">Método Proteína Primero</p>
        </td></tr>
        <tr><td style="padding:12px 32px 0;">
          <h1 style="margin:0;font-size:24px;line-height:1.3;">¡Gracias, ${safeNombre}!</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#3A362C;font-family:Arial,sans-serif;">
            Tu compra fue aprobada. Este es tu código de acceso a la app — actívalo en 2 minutos.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table role="presentation" width="100%" style="background:#17140C;border-radius:12px;">
            <tr><td align="center" style="padding:20px 16px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D9C08A;font-family:Arial,sans-serif;">Tu código</p>
              <p style="margin:0;font-size:26px;font-weight:bold;letter-spacing:2px;color:#F3EFE7;font-family:'Courier New',monospace;">${safeCodigo}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 8px;">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#3A362C;font-family:Arial,sans-serif;">
            <strong>Cómo activar:</strong><br>
            1. Abre la app: <a href="${APP_URL}" style="color:#A8860D;">${APP_URL}</a><br>
            2. Toca "Ya tengo un código"<br>
            3. Pega el código de arriba
          </p>
        </td></tr>
        <tr><td align="center" style="padding:20px 32px 8px;">
          <a href="${APP_URL}" style="display:inline-block;background:#D4AF37;color:#17140C;text-decoration:none;font-weight:bold;font-size:15px;font-family:Arial,sans-serif;padding:14px 32px;border-radius:10px;">Abrir mi app →</a>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #EFEAE0;margin-top:16px;">
          <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#8A8574;font-family:Arial,sans-serif;">
            ¿Problemas para activar? Responde este correo y te ayudamos.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405);
    }

    const rawBody = await request.text();

    let payload = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      // seguimos: quizás el hottok viaja fuera del body
    }

    const fromBody = payload?.hottok;
    const fromQuery = url.searchParams.get('hottok');
    const fromHeader = request.headers.get('x-hotmart-hottok');
    const hottok = String(fromBody ?? fromQuery ?? fromHeader ?? '');
    const expected = String(env.HOTMART_HOTTOK ?? '');

    if (!hottok || hottok !== expected) {
      return json({ ok: false, error: 'invalid_hottok' }, 401);
    }

    const event = String(payload?.event ?? '');
    if (event !== 'PURCHASE_APPROVED') {
      return json({ ok: true, ignored_event: event });
    }

    const buyer = payload?.data?.buyer ?? {};
    const email = typeof buyer.email === 'string' ? buyer.email.trim() : '';
    const name = typeof buyer.name === 'string' ? buyer.name.trim() : 'usuaria';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'missing_or_invalid_buyer_email' }, 422);
    }

    const codigo = generarCodigo();
    const primerNombre = name.split(' ')[0] || 'usuaria';
    const text = `¡Gracias, ${primerNombre}!\n\nTu compra fue aprobada. Tu código de acceso es: ${codigo}\n\nCómo activar:\n1. Abre la app: ${APP_URL}\n2. Toca "Ya tengo un código"\n3. Pega el código de arriba\n\n¿Problemas para activar? Responde este correo y te ayudamos.`;

    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Método Proteína Primero <${env.RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: 'Tu acceso al Método Proteína Primero está listo',
        html: emailHtml(primerNombre, codigo),
        text,
      }),
    });

    if (!resendResp.ok) {
      const detail = await resendResp.text();
      console.error('Resend failed', resendResp.status, detail);
      return json({ ok: false, error: 'resend_failed' }, 502);
    }

    return json({ ok: true });
  },
};
