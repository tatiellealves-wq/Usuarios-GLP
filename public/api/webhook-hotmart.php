<?php
declare(strict_types=1);

// Webhook de Hotmart: al aprobarse una compra, genera un código de acceso
// (mismo algoritmo que src/app/codigos.ts) y lo envía por correo vía Resend.
// No guarda estado — cada código es independiente y se valida solo con su
// propio checksum, igual que en la app.

header('Content-Type: application/json; charset=utf-8');

// Nombre deliberadamente distinto de "config.php": algunos hostings
// compartidos ponen en cuarentena/eliminan automáticamente cualquier
// archivo con ese nombre exacto (blanco típico de fugas de credenciales).
$configPath = __DIR__ . '/secrets.inc.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'secrets.inc.php ausente']);
    exit;
}
require $configPath;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

// Hotmart reenvía el token configurado en el panel dentro de "hottok".
$hottok = (string) ($payload['hottok'] ?? '');
if ($hottok === '' || !hash_equals(HOTMART_HOTTOK, $hottok)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'invalid_hottok']);
    exit;
}

// Solo entregamos acceso en compra aprobada; otros eventos se confirman y se ignoran.
$event = (string) ($payload['event'] ?? '');
if ($event !== 'PURCHASE_APPROVED') {
    http_response_code(200);
    echo json_encode(['ok' => true, 'ignored_event' => $event]);
    exit;
}

$buyer = $payload['data']['buyer'] ?? [];
$email = is_string($buyer['email'] ?? null) ? trim($buyer['email']) : '';
$name  = is_string($buyer['name'] ?? null) ? trim($buyer['name']) : 'usuaria';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'missing_or_invalid_buyer_email']);
    exit;
}

// ---- Generación de código — puerto exacto de src/app/codigos.ts ----

const CODE_ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_SECRETO = 'GLP1-GUIA-ALIMENTACION-2026-K7R4';
const CODE_LARGO_CUERPO = 6;

function glp1_fnv1a(string $texto): int
{
    $h = 0x811c9dc5;
    $len = strlen($texto);
    for ($i = 0; $i < $len; $i++) {
        $h ^= ord($texto[$i]);
        $h = ($h * 0x01000193) & 0xFFFFFFFF; // equivalente a Math.imul(...) >>> 0
    }
    return $h;
}

function glp1_checksum(string $cuerpo): string
{
    $h = glp1_fnv1a($cuerpo . CODE_SECRETO);
    $n = strlen(CODE_ALFABETO);
    return CODE_ALFABETO[$h % $n] . CODE_ALFABETO[intdiv($h, $n) % $n];
}

function glp1_generar_codigo(): string
{
    $n = strlen(CODE_ALFABETO);
    $cuerpo = '';
    for ($i = 0; $i < CODE_LARGO_CUERPO; $i++) {
        $cuerpo .= CODE_ALFABETO[random_int(0, $n - 1)];
    }
    $full = $cuerpo . glp1_checksum($cuerpo);
    return 'GLP1-' . substr($full, 0, 4) . '-' . substr($full, 4);
}

$codigo = glp1_generar_codigo();
$appUrl = 'https://usuariosdeglp-1.site/app/';

// ---- Email ----

$primerNombre = trim(explode(' ', $name)[0] ?? $name) ?: 'usuaria';
$safeNombre = htmlspecialchars($primerNombre, ENT_QUOTES, 'UTF-8');
$safeCodigo = htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8');

$html = <<<HTML
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#F3EFE7;font-family:Georgia,'Times New Roman',serif;color:#17140C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EFE7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E4DFD0;">
        <tr><td style="padding:28px 32px 4px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#A8860D;font-family:Arial,sans-serif;font-weight:bold;">Método Proteína Primero</p>
        </td></tr>
        <tr><td style="padding:12px 32px 0;">
          <h1 style="margin:0;font-size:24px;line-height:1.3;">¡Gracias, {$safeNombre}!</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#3A362C;font-family:Arial,sans-serif;">
            Tu compra fue aprobada. Este es tu código de acceso a la app — actívalo en 2 minutos.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table role="presentation" width="100%" style="background:#17140C;border-radius:12px;">
            <tr><td align="center" style="padding:20px 16px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#D9C08A;font-family:Arial,sans-serif;">Tu código</p>
              <p style="margin:0;font-size:26px;font-weight:bold;letter-spacing:2px;color:#F3EFE7;font-family:'Courier New',monospace;">{$safeCodigo}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 8px;">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#3A362C;font-family:Arial,sans-serif;">
            <strong>Cómo activar:</strong><br>
            1. Abre la app: <a href="{$appUrl}" style="color:#A8860D;">{$appUrl}</a><br>
            2. Toca "Ya tengo un código"<br>
            3. Pega el código de arriba
          </p>
        </td></tr>
        <tr><td align="center" style="padding:20px 32px 8px;">
          <a href="{$appUrl}" style="display:inline-block;background:#D4AF37;color:#17140C;text-decoration:none;font-weight:bold;font-size:15px;font-family:Arial,sans-serif;padding:14px 32px;border-radius:10px;">Abrir mi app →</a>
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
</html>
HTML;

$text = "¡Gracias, {$primerNombre}!\n\n"
    . "Tu compra fue aprobada. Tu código de acceso es: {$codigo}\n\n"
    . "Cómo activar:\n"
    . "1. Abre la app: {$appUrl}\n"
    . "2. Toca \"Ya tengo un código\"\n"
    . "3. Pega el código de arriba\n\n"
    . "¿Problemas para activar? Responde este correo y te ayudamos.";

$resendBody = [
    'from' => FROM_NAME . ' <' . FROM_EMAIL . '>',
    'to' => [$email],
    'subject' => 'Tu acceso al Método Proteína Primero está listo',
    'html' => $html,
    'text' => $text,
];

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . RESEND_API_KEY,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($resendBody),
    CURLOPT_TIMEOUT => 15,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpCode < 200 || $httpCode >= 300) {
    error_log('[webhook-hotmart] Resend falló: HTTP ' . $httpCode . ' ' . $curlError . ' body=' . $response);
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'resend_failed']);
    exit;
}

http_response_code(200);
echo json_encode(['ok' => true]);
