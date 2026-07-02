// Sistema de códigos de activación — funciona offline, sin servidor.
// Cada código GLP1-XXXX-XXXX lleva 2 caracteres verificadores al final,
// calculados a partir del cuerpo + secreto. El app valida recalculando,
// sin necesitar una lista de códigos ni conexión.
// Para generar códigos de venta: tools/generador-codigos.html (mismo algoritmo).

// Alfabeto sin caracteres ambiguos (sin I, L, O, 0, 1)
export const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const SECRETO = 'GLP1-GUIA-ALIMENTACION-2026-K7R4';
const LARGO_CUERPO = 6;

function hashFNV(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function checksum(cuerpo: string): string {
  const h = hashFNV(cuerpo + SECRETO);
  return ALFABETO[h % ALFABETO.length] + ALFABETO[Math.floor(h / ALFABETO.length) % ALFABETO.length];
}

// Acepta el código con o sin guiones, espacios o minúsculas
export function normalizarCodigo(entrada: string): string {
  return entrada.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function formatearCodigo(cuerpoYCheck: string): string {
  return `GLP1-${cuerpoYCheck.slice(0, 4)}-${cuerpoYCheck.slice(4)}`;
}

export function validarCodigo(entrada: string): boolean {
  let c = normalizarCodigo(entrada);
  if (c.startsWith('GLP1')) c = c.slice(4);
  if (c.length !== LARGO_CUERPO + 2) return false;
  const cuerpo = c.slice(0, LARGO_CUERPO);
  for (const ch of cuerpo) if (!ALFABETO.includes(ch)) return false;
  return checksum(cuerpo) === c.slice(LARGO_CUERPO);
}

export function generarCodigo(): string {
  const rnd = new Uint32Array(LARGO_CUERPO);
  crypto.getRandomValues(rnd);
  let cuerpo = '';
  for (let i = 0; i < LARGO_CUERPO; i++) cuerpo += ALFABETO[rnd[i] % ALFABETO.length];
  return formatearCodigo(cuerpo + checksum(cuerpo));
}
