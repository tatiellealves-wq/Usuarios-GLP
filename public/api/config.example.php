<?php
// Plantilla — copiar a config.php (ignorado por git) y completar con valores reales.
// En producción, este archivo se genera automáticamente en el pipeline de deploy
// a partir de GitHub Secrets (ver .github/workflows/deploy.yml). No es necesario
// crearlo a mano en el servidor.

// Clave de API de Resend (resend.com/api-keys). Nunca commitear el valor real.
define('RESEND_API_KEY', 'MY_RESEND_API_KEY');

// Token secreto configurado en Hotmart al crear el webhook (Ferramentas > Webhooks).
// Hotmart lo reenvía en el campo "hottok" de cada payload; debe coincidir exacto.
define('HOTMART_HOTTOK', 'MY_HOTMART_HOTTOK');

// Remitente verificado en Resend (Domains > Add Domain). Debe ser del dominio
// que verificaste ahí — no funciona con una dirección arbitraria.
define('FROM_EMAIL', 'acceso@usuariosdeglp-1.site');
define('FROM_NAME', 'Método Proteína Primero');
