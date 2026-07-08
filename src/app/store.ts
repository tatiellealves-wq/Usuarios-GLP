// Persistencia local (privacidad por defecto: todo queda en el dispositivo)
import { useEffect, useState } from 'react';

export type Perfil = {
  nombre: string;
  pesoInicial: number; // kg
  unidad: 'kg' | 'lb';
  medicamento: 'Ozempic' | 'Wegovy' | 'Mounjaro' | 'Otro';
  diaDosis: number; // 0=domingo … 6=sábado
  objetivo?: number; // kg
  fechaInicio: string;
};

export type RegistroDia = {
  fecha: string; // YYYY-MM-DD
  nauseas?: number;
  energia?: number;
  agua: number;
  proteina: boolean;
  pasosInyeccion?: string[];
  nota?: string; // diario: qué comí, cómo me sentí
};

export type Peso = { fecha: string; kg: number };
export type Medidas = { fecha: string; cintura?: number; cadera?: number; brazo?: number; muslo?: number };

export type Comida = 'desayuno' | 'almuerzo' | 'cena' | 'snack';
export type PlanDia = Partial<Record<Comida, number>>; // id de receta
export type PlanSemanal = Record<number, PlanDia>; // 0=domingo … 6=sábado

// ---- Plan alimentario inteligente ----
export type SexoBio = 'F' | 'M';
export type ObjetivoPlan = 'perder' | 'mantener' | 'ganar';
export type PlanInteligente = {
  peso: number; // kg
  altura: number; // cm
  edad: number;
  sexo: SexoBio;
  objetivo: ObjetivoPlan;
  suave: boolean; // priorizar recetas suaves (estómago sensible)
  comidas: Partial<Record<Comida, number>>; // id de receta por comida
};

export type Estado = {
  activado: boolean;
  codigoUsado?: string; // código de activación introducido (para soporte)
  perfil?: Perfil;
  registros: Record<string, RegistroDia>;
  pesos: Peso[];
  medidas: Medidas[];
  plan: PlanSemanal;
  planInteligente?: PlanInteligente; // plan alimentario generado por calorías
  comprasHechas: string[]; // ítems marcados de la lista de compras
  despensaHecha: string[]; // ítems marcados de la Lista de Supermercado (Módulo 3)
  salida?: { inicio: string; checks: string[] };
  rutinasHechas: string[]; // 'YYYY-MM-DD:rutinaId'
};

const KEY = 'glp1app-v1';

const inicial: Estado = { activado: false, registros: {}, pesos: [], medidas: [], plan: {}, comprasHechas: [], despensaHecha: [], rutinasHechas: [] };

function cargar(): Estado {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...inicial, ...JSON.parse(raw) };
  } catch { /* datos corruptos → empezar de cero */ }
  return inicial;
}

export function useEstado() {
  const [estado, setEstado] = useState<Estado>(cargar);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(estado));
  }, [estado]);
  return [estado, setEstado] as const;
}

// ---- Copia de seguridad (las fotos viven en IndexedDB y no se incluyen) ----
export function exportarDatos(estado: Estado): void {
  const respaldo = { app: 'glp1app', version: 1, exportado: new Date().toISOString(), datos: estado };
  const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `guia-glp1-respaldo-${hoyISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importarDatos(file: File): Promise<Estado> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        const datos = json?.app === 'glp1app' ? json.datos : json; // acepta respaldo o estado crudo
        if (!datos || typeof datos !== 'object' || typeof datos.activado !== 'boolean') {
          rej(new Error('archivo no reconocido')); return;
        }
        res({ ...inicial, ...datos });
      } catch { rej(new Error('archivo dañado')); }
    };
    reader.onerror = () => rej(reader.error);
    reader.readAsText(file);
  });
}

export const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const lbAKg = (lb: number) => Math.round(lb * 0.453592 * 10) / 10;

// Meta de proteína recalculada con el peso más reciente (si existe):
// al bajar de peso, la meta acompaña — como indica la guía (1.6–1.8 g/kg).
export function metaProteina(perfil: Perfil, pesoActual?: number): number {
  return Math.round((pesoActual ?? perfil.pesoInicial) * 1.7);
}

export function esDiaDosis(perfil: Perfil, fecha = new Date()): boolean {
  return fecha.getDay() === perfil.diaDosis;
}

// Metas del plan alimentario inteligente.
// BMR con Mifflin-St Jeor · TDEE con actividad ligera · déficit/superávit según objetivo.
// La proteína sigue la guía (1.7–2.0 g/kg) para proteger el músculo durante el GLP-1.
export function metasPlan(d: { peso: number; altura: number; edad: number; sexo: SexoBio; objetivo: ObjetivoPlan }): {
  bmr: number; tdee: number; calorias: number; proteina: number;
} {
  const base = 10 * d.peso + 6.25 * d.altura - 5 * d.edad;
  const bmr = Math.round(base + (d.sexo === 'M' ? 5 : -161));
  const tdee = bmr * 1.375; // actividad ligera (caminatas + tareas del día)
  let cal = d.objetivo === 'perder' ? tdee - 500 : d.objetivo === 'ganar' ? tdee + 250 : tdee;
  const piso = d.sexo === 'F' ? 1200 : 1500; // mínimo seguro
  cal = Math.max(piso, cal);
  const factor = d.objetivo === 'perder' ? 1.8 : d.objetivo === 'ganar' ? 2.0 : 1.7;
  return {
    bmr,
    tdee: Math.round(tdee),
    calorias: Math.round(cal / 10) * 10,
    proteina: Math.round(d.peso * factor),
  };
}

export function racha(registros: Record<string, RegistroDia>): number {
  let n = 0;
  const d = new Date();
  for (;;) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const r = registros[iso];
    const tiene = r && (r.nauseas !== undefined || r.energia !== undefined || r.agua > 0 || r.proteina);
    if (tiene) { n++; d.setDate(d.getDate() - 1); }
    else if (n === 0 && iso === hoyISO()) { d.setDate(d.getDate() - 1); } // hoy aún sin registro no rompe la racha
    else break;
    if (n > 999) break;
  }
  return n;
}

// Media semanal de pesos para la curva de tendencia
export function tendenciaSemanal(pesos: Peso[]): { etiqueta: string; kg: number }[] {
  if (!pesos.length) return [];
  const orden = [...pesos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const semanas = new Map<string, number[]>();
  for (const p of orden) {
    const d = new Date(p.fecha + 'T12:00:00');
    const lunes = new Date(d);
    lunes.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const k = lunes.toISOString().slice(0, 10);
    if (!semanas.has(k)) semanas.set(k, []);
    semanas.get(k)!.push(p.kg);
  }
  return [...semanas.entries()].map(([k, v]) => ({
    etiqueta: k.slice(8, 10) + '/' + k.slice(5, 7),
    kg: Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10,
  }));
}

// ---- Plan de Salida ----
export type Salida = { inicio: string; checks: string[] };

export function semanaSalida(salida: Salida): number {
  const ms = Date.now() - new Date(salida.inicio + 'T00:00:00').getTime();
  return Math.min(12, Math.max(1, Math.floor(ms / (7 * 86400000)) + 1));
}

// ---- Fotos de progreso (IndexedDB: demasiado grandes para localStorage) ----
export type Foto = { fecha: string; data: string };

function abrirDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open('glp1app-fotos', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('fotos', { keyPath: 'fecha' });
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export async function guardarFoto(foto: Foto): Promise<void> {
  const db = await abrirDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction('fotos', 'readwrite');
    tx.objectStore('fotos').put(foto);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function listarFotos(): Promise<Foto[]> {
  const db = await abrirDB();
  return new Promise((res, rej) => {
    const req = db.transaction('fotos').objectStore('fotos').getAll();
    req.onsuccess = () => res((req.result as Foto[]).sort((a, b) => b.fecha.localeCompare(a.fecha)));
    req.onerror = () => rej(req.error);
  });
}

export async function borrarFoto(fecha: string): Promise<void> {
  const db = await abrirDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction('fotos', 'readwrite');
    tx.objectStore('fotos').delete(fecha);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export function comprimirImagen(file: File, maxLado = 900): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * escala);
      c.height = Math.round(img.height * escala);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}
