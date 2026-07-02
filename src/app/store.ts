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
};

export type Peso = { fecha: string; kg: number };
export type Medidas = { fecha: string; cintura?: number; cadera?: number; brazo?: number; muslo?: number };

export type Comida = 'desayuno' | 'almuerzo' | 'cena' | 'snack';
export type PlanDia = Partial<Record<Comida, number>>; // id de receta
export type PlanSemanal = Record<number, PlanDia>; // 0=domingo … 6=sábado

export type Estado = {
  activado: boolean;
  perfil?: Perfil;
  registros: Record<string, RegistroDia>;
  pesos: Peso[];
  medidas: Medidas[];
  plan: PlanSemanal;
  comprasHechas: string[]; // ítems marcados de la lista de compras
};

const KEY = 'glp1app-v1';

const inicial: Estado = { activado: false, registros: {}, pesos: [], medidas: [], plan: {}, comprasHechas: [] };

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

export const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const lbAKg = (lb: number) => Math.round(lb * 0.453592 * 10) / 10;

export function metaProteina(perfil: Perfil): number {
  return Math.round(perfil.pesoInicial * 1.7);
}

export function esDiaDosis(perfil: Perfil, fecha = new Date()): boolean {
  return fecha.getDay() === perfil.diaDosis;
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
