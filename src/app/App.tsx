import React, { useMemo, useState } from 'react';
import {
  BookOpen, Calendar, Camera, Check, ChevronDown, ChevronUp, Download, Droplets,
  Flame, Home, KeyRound, LineChart, Lock, NotebookPen, Printer, Ruler, Search, ShieldCheck,
  ShoppingBag, ShoppingCart, Sparkles, Syringe, Upload, Utensils, X,
} from 'lucide-react';
import {
  ALIMENTOS_EVITAR, CLAVE_ACCESO, FASES_SALIDA, GUIA_CAPITULOS, LISTA_SUPER, PASOS_INYECCION,
  RECETAS, RUTINAS, type Receta, type Rutina,
} from './data';
import { normalizarCodigo, validarCodigo } from './codigos';
import {
  borrarFoto, comprimirImagen, esDiaDosis, exportarDatos, guardarFoto, hoyISO, importarDatos,
  lbAKg, listarFotos, metaProteina, racha, semanaSalida, tendenciaSemanal, useEstado,
  type Comida, type Foto, type Medidas, type Perfil, type PlanSemanal, type RegistroDia,
} from './store';

type Tab = 'hoy' | 'recetas' | 'plan' | 'progreso' | 'mas';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function App() {
  const [estado, setEstado] = useEstado();
  const [tab, setTab] = useState<Tab>('hoy');

  if (!estado.activado) {
    return <Activacion onOk={(codigo) => setEstado((e) => ({ ...e, activado: true, codigoUsado: codigo }))} />;
  }
  if (!estado.perfil) {
    return <Onboarding onDone={(perfil) => setEstado((e) => ({ ...e, perfil }))} />;
  }

  const perfil = estado.perfil;
  const hoy = hoyISO();
  const pesoActual = estado.pesos.length
    ? [...estado.pesos].sort((a, b) => a.fecha.localeCompare(b.fecha)).at(-1)!.kg
    : undefined;
  const meta = metaProteina(perfil, pesoActual);
  const reg: RegistroDia = estado.registros[hoy] ?? { fecha: hoy, agua: 0, proteina: false };
  const setReg = (r: Partial<RegistroDia>) =>
    setEstado((e) => ({ ...e, registros: { ...e.registros, [hoy]: { ...reg, ...r, fecha: hoy } } }));

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1F2430] font-sans pb-24">
      <div key={tab} className="anim-screen">
      {tab === 'hoy' && <PantallaHoy perfil={perfil} meta={meta} reg={reg} setReg={setReg} registros={estado.registros} plan={estado.plan} />}
      {tab === 'recetas' && <PantallaRecetas />}
      {tab === 'plan' && (
        <PantallaPlan
          meta={meta}
          plan={estado.plan}
          comprasHechas={estado.comprasHechas}
          setPlan={(plan) => setEstado((e) => ({ ...e, plan }))}
          toggleCompra={(item) => setEstado((e) => ({
            ...e,
            comprasHechas: e.comprasHechas.includes(item)
              ? e.comprasHechas.filter((x) => x !== item)
              : [...e.comprasHechas, item],
          }))}
        />
      )}
      {tab === 'progreso' && (
        <PantallaProgreso
          estado={estado}
          onPeso={(kg) => setEstado((e) => ({ ...e, pesos: [...e.pesos.filter((p) => p.fecha !== hoy), { fecha: hoy, kg }] }))}
          onMedidas={(m) => setEstado((e) => ({ ...e, medidas: [...e.medidas.filter((x) => x.fecha !== m.fecha), m] }))}
        />
      )}
      {tab === 'mas' && <PantallaMas estado={estado} setEstado={setEstado} />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}

/* ---------- Emblema botánico (la firma visual del kit) ---------- */
function EmblemaBotanico({ className, color = '#D4AF37' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={`emblema ${className ?? ''}`} aria-hidden="true">
      <path pathLength={1} d="M60 108 C58 82 62 50 60 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path pathLength={1} d="M60 90 Q42 86 33 94 Q45 102 60 90 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 90 Q78 86 87 94 Q75 102 60 90 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 66 Q44 61 36 68 Q47 76 60 66 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 66 Q76 61 84 68 Q73 76 60 66 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 44 Q47 38 41 45 Q51 52 60 44 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 44 Q73 38 79 45 Q69 52 60 44 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path pathLength={1} d="M60 16 Q53 25 60 32 Q67 25 60 16 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Activación ---------- */
function Activacion({ onOk }: { onOk: (codigo: string) => void }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const esMaestro = normalizarCodigo(clave) === normalizarCodigo(CLAVE_ACCESO);
    if (validarCodigo(clave) || esMaestro) {
      setOk(true);
      setTimeout(() => onOk(clave.trim().toUpperCase()), 1200);
    } else setError(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A2A18] flex items-center justify-center p-6">
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl glow-drift" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-[#16A34A]/10 blur-3xl" aria-hidden="true" />

      <div className="w-full max-w-sm text-center relative">
        {ok ? (
          <div className="anim-fade-up" role="status">
            <div className="mx-auto h-20 w-20 rounded-full bg-[#D4AF37] flex items-center justify-center mb-5 anim-pop">
              <Check className="h-10 w-10 text-[#0A2A18] stroke-[3px]" />
            </div>
            <h1 className="text-white font-bold text-2xl mb-1">Código verificado</h1>
            <p className="text-[#D4AF37] text-sm">Preparando tu guía…</p>
          </div>
        ) : (
          <>
            <EmblemaBotanico className="mx-auto h-24 w-24 mb-1" />
            <p className="anim-fade-up d1 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[.28em] mb-2">Te damos la bienvenida a tu kit digital</p>
            <h1 className="anim-fade-up d2 text-white font-bold text-3xl leading-tight mb-2">
              Guía GLP-1 <span className="text-[#D4AF37]">Inteligente</span>
            </h1>
            <p className="anim-fade-up d3 text-green-100/60 text-sm mb-2 leading-relaxed">
              El acompañamiento premium de tu tratamiento —<br />cada día, en tu bolsillo.
            </p>
            <p className="anim-fade-up d3 text-white/30 text-[10px] uppercase tracking-[.18em] mb-8">
              45 recetas ✦ Diario ✦ Plan de salida ✦ 100% offline
            </p>
            <form onSubmit={enviar} className="anim-fade-up d4">
              <label className="block text-left text-xs font-semibold text-green-100 mb-2 uppercase tracking-wider">
                Código de acceso <span className="text-white/40 normal-case tracking-normal font-normal">· llegó a tu correo</span>
              </label>
              <input
                value={clave}
                onChange={(e) => { setClave(e.target.value); setError(false); }}
                placeholder="GLP1-XXXX-XXXX"
                className="w-full rounded-2xl bg-white/[.08] border border-white/20 text-white placeholder-white/40 px-4 py-4 text-center tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
              {error && <p className="text-red-300 text-xs mt-2" role="alert">Código no válido. Revisa el correo de tu compra.</p>}
              <button type="submit" className="btn3d btn3d-gold w-full mt-4 py-4 rounded-2xl flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" /> Activar mi app
              </button>
            </form>
            <p className="anim-fade-up d5 text-white/35 text-[11px] mt-6">¿No encuentras tu código? Escribe a soporte@guiaglp1.com</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Onboarding ---------- */
function Onboarding({ onDone }: { onDone: (p: Perfil) => void }) {
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('');
  const [unidad, setUnidad] = useState<'kg' | 'lb'>('kg');
  const [medicamento, setMedicamento] = useState<Perfil['medicamento']>('Ozempic');
  const [diaDosis, setDiaDosis] = useState(1);
  const [objetivo, setObjetivo] = useState('');

  const pesoKg = unidad === 'lb' ? lbAKg(Number(peso)) : Number(peso);
  const valido = nombre.trim().length > 0 && pesoKg >= 30 && pesoKg <= 300;

  return (
    <div className="min-h-screen bg-[#FBF9F5] p-6 flex flex-col justify-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="anim-fade-up">
          <EmblemaBotanico className="h-14 w-14 -ml-1 mb-1" color="#166534" />
          <p className="text-[#C9A035] font-bold text-xs uppercase tracking-widest mb-2">Te damos la bienvenida</p>
          <h1 className="text-2xl font-bold mb-1">Personalicemos tu guía</h1>
          <p className="text-sm text-gray-500 mb-7">2 minutos — el app calcula tus metas con esto.</p>
        </div>
        <div className="anim-fade-up d2">

        <label className="lbl">¿Cómo te llamas?</label>
        <input className="inp" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />

        <label className="lbl">Tu peso actual</label>
        <div className="flex gap-2">
          <input className="inp flex-1" type="number" inputMode="decimal" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder={unidad === 'kg' ? 'Ej. 75' : 'Ej. 165'} />
          {(['kg', 'lb'] as const).map((u) => (
            <button key={u} onClick={() => setUnidad(u)} className={`px-4 rounded-xl font-bold text-sm border ${unidad === u ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-gray-200 text-gray-500'}`}>{u.toUpperCase()}</button>
          ))}
        </div>

        <label className="lbl">Tu medicamento</label>
        <div className="grid grid-cols-2 gap-2">
          {(['Ozempic', 'Wegovy', 'Mounjaro', 'Otro'] as const).map((m) => (
            <button key={m} onClick={() => setMedicamento(m)} className={`py-3 rounded-xl font-semibold text-sm border ${medicamento === m ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-gray-200 text-gray-600'}`}>{m}</button>
          ))}
        </div>

        <label className="lbl">¿Qué día te aplicas la dosis?</label>
        <select className="inp" value={diaDosis} onChange={(e) => setDiaDosis(Number(e.target.value))}>
          {DIAS.map((d, i) => <option key={d} value={i}>{d}</option>)}
        </select>

        <label className="lbl">Peso objetivo (opcional, en {unidad})</label>
        <input className="inp" type="number" inputMode="decimal" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Puedes definirlo después" />

        {valido && (
          <div className="mt-5 rounded-xl bg-[#EAF4EC] border border-[#CBE3D1] p-4 text-sm">
            <p className="font-bold text-[#166534] mb-1">Tus metas diarias</p>
            <p className="text-gray-600">Proteína: <b>{Math.round(pesoKg * 1.7)} g</b> · Agua: <b>8 vasos</b> · Registro: <b>2 min/día</b></p>
          </div>
        )}

        <button
          disabled={!valido}
          onClick={() => onDone({
            nombre: nombre.trim(), pesoInicial: pesoKg, unidad, medicamento, diaDosis,
            objetivo: objetivo ? (unidad === 'lb' ? lbAKg(Number(objetivo)) : Number(objetivo)) : undefined,
            fechaInicio: hoyISO(),
          })}
          className="w-full mt-6 bg-[#16A34A] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl"
        >
          Empezar mi acompañamiento
        </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hoy ---------- */
function PantallaHoy({ perfil, meta, reg, setReg, registros, plan }: {
  perfil: Perfil; meta: number; reg: RegistroDia; setReg: (r: Partial<RegistroDia>) => void; registros: Record<string, RegistroDia>; plan: PlanSemanal;
}) {
  const dosisHoy = esDiaDosis(perfil);
  const planHoy = plan[new Date().getDay()] ?? {};
  const comidasHoy = (Object.entries(planHoy) as [Comida, number][])
    .map(([c, id]) => ({ c, r: RECETAS.find((x) => x.id === id)! }))
    .filter((x) => x.r);
  const proteinaPlan = comidasHoy.reduce((s, x) => s + x.r.proteina, 0);
  const dias = racha(registros);
  const fecha = new Date().toLocaleDateString('es-419', { weekday: 'long', day: 'numeric', month: 'long' });

  const diaReto = Math.min(21, Math.max(1, Math.floor((Date.now() - new Date(perfil.fechaInicio + 'T00:00:00').getTime()) / 86400000) + 1));
  const pctReto = Math.round((diaReto / 21) * 100);
  const proteinaPct = Math.min(100, Math.round((proteinaPlan / meta) * 100));

  const pathRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    (pathRef.current?.querySelector('[data-now="1"]') as HTMLElement | null)?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, []);

  return (
    <div className="max-w-md mx-auto px-5 pt-7">
      {/* Encabezado + racha */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#16A34A] capitalize">{fecha}</p>
          <h1 className="text-2xl font-extrabold">¡Hola, {perfil.nombre}! 👋</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 bg-[#FFF4D6] border-2 border-[#F1DE9E]" style={{ boxShadow: '0 3px 0 #F1DE9E' }}>
          <Flame className="h-5 w-5 text-[#E7B93B] anim-flame" />
          <div className="leading-none text-center">
            <p className="text-lg font-extrabold text-[#B08621] tabular-nums">{dias}</p>
            <p className="text-[9px] font-bold text-[#B08621]/70 -mt-0.5">racha</p>
          </div>
        </div>
      </div>

      {/* Progreso del reto */}
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-extrabold text-[#1F2430]">Día {diaReto} <span className="text-gray-400 font-bold">de 21</span></p>
        <span className="text-xs font-extrabold text-[#16A34A]">{pctReto}%</span>
      </div>
      <div className="h-3 rounded-full bg-[#ECE7DD] overflow-hidden mb-4">
        <div className="h-full bg-[#16A34A] rounded-full transition-all" style={{ width: `${pctReto}%` }} />
      </div>

      {/* Camino de 21 días (estilo Duolingo) */}
      <div ref={pathRef} className="flex gap-2.5 overflow-x-auto pb-3 -mx-5 px-5 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 21 }).map((_, i) => {
          const d = i + 1;
          const st = d < diaReto ? 'done' : d === diaReto ? 'now' : 'lock';
          return (
            <div key={d} data-now={st === 'now' ? '1' : undefined} className="shrink-0 flex flex-col items-center gap-1.5">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-extrabold text-sm ${
                  st === 'done' ? 'bg-[#16A34A] text-white'
                    : st === 'now' ? 'bg-[#E7B93B] text-[#3A2E07] scale-110 ring-4 ring-[#E7B93B]/25'
                    : 'bg-[#EBEDF0] text-[#9AA3AE]'
                }`}
                style={{ boxShadow: st === 'done' ? '0 3px 0 #107636' : st === 'now' ? '0 3px 0 #B08621' : '0 3px 0 #D3D7DD' }}
              >
                {st === 'done' ? <Check className="h-5 w-5 stroke-[3px]" /> : st === 'lock' ? <Lock className="h-4 w-4" /> : d}
              </div>
              <span className={`text-[9px] font-bold ${st === 'now' ? 'text-[#B08621]' : 'text-gray-400'}`}>{st === 'now' ? 'Hoy' : `Día ${d}`}</span>
            </div>
          );
        })}
      </div>

      {dosisHoy && <ModoInyeccion reg={reg} setReg={setReg} />}

      {comidasHoy.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-extrabold flex items-center gap-2"><Utensils className="h-4 w-4 text-[#16A34A]" /> Tu menú de hoy</h2>
            <span className="tag bg-[#EAF4EC] text-[#166534]">{proteinaPlan}/{meta} g</span>
          </div>
          <div className="h-2.5 bg-[#ECE7DD] rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-[#16A34A] rounded-full transition-all" style={{ width: `${proteinaPct}%` }} />
          </div>
          <div className="space-y-2">
            {comidasHoy.map(({ c, r }) => (
              <div key={c} className="flex items-center gap-3 rounded-2xl bg-[#F7F5EF] border-2 border-[#ECE7DD] px-3 py-2.5">
                <span className="h-9 w-9 rounded-xl bg-white border-2 border-[#ECE7DD] flex items-center justify-center shrink-0">
                  <Utensils className="h-4 w-4 text-[#16A34A]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#C9A035] capitalize">{c}</p>
                  <p className="text-sm font-bold text-[#1F2430] truncate">{r.nombre}</p>
                </div>
                <span className="text-xs font-extrabold text-[#16A34A] shrink-0">{r.proteina}g</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-extrabold mb-3">Registro de hoy</h2>
        <Escala titulo="Náuseas" valor={reg.nauseas} onSet={(v) => setReg({ nauseas: v })} colores={['#16A34A', '#84CC16', '#F59E0B', '#DC2626']} />
        <Escala titulo="Energía" valor={reg.energia} onSet={(v) => setReg({ energia: v })} colores={['#DC2626', '#F59E0B', '#84CC16', '#16A34A']} />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-sky-500" />
            <span className="text-sm font-bold">Agua</span>
            <span className="text-xs text-gray-400">{reg.agua} de 8 vasos</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setReg({ agua: Math.max(0, reg.agua - 1) })} className="btn3d btn3d-soft h-10 w-10 rounded-full text-lg flex items-center justify-center">−</button>
            <button onClick={() => setReg({ agua: Math.min(15, reg.agua + 1) })} className="btn3d btn3d-blue h-10 w-10 rounded-full text-lg flex items-center justify-center">+</button>
          </div>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-2.5 flex-1 rounded-full ${i < reg.agua ? 'bg-sky-400' : 'bg-[#ECE7DD]'}`} />
          ))}
        </div>

        <button
          onClick={() => setReg({ proteina: !reg.proteina })}
          className={`btn3d w-full mt-4 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 ${reg.proteina ? '' : 'btn3d-soft'}`}
        >
          <Check className={`h-4 w-4 ${reg.proteina ? '' : 'opacity-30'}`} />
          {reg.proteina ? `Proteína cumplida (~${meta} g) ✓` : `¿Cumpliste tus ~${meta} g de proteína?`}
        </button>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-bold mb-1.5 flex items-center gap-2"><NotebookPen className="h-4 w-4 text-[#C9A035]" /> Diario del día</p>
          <textarea
            value={reg.nota ?? ''}
            onChange={(e) => setReg({ nota: e.target.value })}
            placeholder="¿Qué comiste? ¿Cómo te sentiste? Ej.: 'el yogur me cayó perfecto, la cena grasosa me dio náuseas'"
            rows={2}
            className="w-full bg-[#FBF9F5] border-2 border-[#ECE7DD] rounded-2xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
          />
          <p className="text-[10px] text-gray-400 mt-1">Con el tiempo, tus notas revelan qué alimentos te caen bien y cuáles no — evidencia de oro para tu próxima consulta.</p>
        </div>
      </div>

      {!dosisHoy && (
        <div className="card flex items-center gap-3">
          <Syringe className="h-5 w-5 text-[#C9A035] shrink-0" />
          <p className="text-sm text-gray-600">
            {(new Date().getDay() + 1) % 7 === perfil.diaDosis ? (
              <><b>Mañana es tu día de dosis.</b> Deja lista una comida ligera y proteica para 2–3 h antes — mañana te guío paso a paso.</>
            ) : (
              <>Tu próxima dosis: <b>{DIAS[perfil.diaDosis]}</b>. Ese día el app te guía paso a paso.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function Escala({ titulo, valor, onSet, colores }: { titulo: string; valor?: number; onSet: (v: number) => void; colores: string[] }) {
  const labels = ['0', '1', '2', '3'];
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-semibold">{titulo}</span>
        <span className="text-[10px] text-gray-400">0 = sin molestias · 3 = fuerte</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {labels.map((l, i) => (
          <button
            key={l}
            onClick={() => onSet(i)}
            className="py-2.5 rounded-xl font-bold text-sm border transition-all"
            style={valor === i
              ? { background: colores[i], color: '#fff', borderColor: colores[i] }
              : { background: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModoInyeccion({ reg, setReg }: { reg: RegistroDia; setReg: (r: Partial<RegistroDia>) => void }) {
  const hechos = reg.pasosInyeccion ?? [];
  const toggle = (id: string) =>
    setReg({ pasosInyeccion: hechos.includes(id) ? hechos.filter((x) => x !== id) : [...hechos, id] });
  const pct = Math.round((hechos.length / PASOS_INYECCION.length) * 100);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0D3320] to-[#17452A] text-white p-5 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-1">
        <p className="font-bold flex items-center gap-2"><Syringe className="h-4 w-4 text-[#D4AF37]" /> Hoy es día de dosis</p>
        <span className="text-xs font-bold text-[#D4AF37]">{hechos.length}/{PASOS_INYECCION.length}</span>
      </div>
      <div className="h-1.5 bg-white/15 rounded-full mb-4"><div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
      {['Antes de la dosis', 'Primeras 24 h'].map((fase) => (
        <div key={fase} className="mb-2">
          <p className="text-[10px] uppercase tracking-widest text-green-300/70 font-bold mb-1.5">{fase}</p>
          {PASOS_INYECCION.filter((p) => p.fase === fase).map((p) => (
            <button key={p.id} onClick={() => toggle(p.id)} className="w-full flex items-start gap-2.5 text-left py-1.5">
              <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${hechos.includes(p.id) ? 'bg-[#D4AF37] border-[#D4AF37] anim-pop' : 'border-white/40'}`}>
                {hechos.includes(p.id) && <Check className="h-3 w-3 text-[#0D3320]" />}
              </span>
              <span className={`text-xs leading-snug ${hechos.includes(p.id) ? 'text-white/50 line-through' : 'text-white/90'}`}>{p.texto}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Recetas ---------- */
function PantallaRecetas() {
  const [filtro, setFiltro] = useState<'todas' | 'suaves'>('todas');
  const [cat, setCat] = useState<'todas' | Receta['cat']>('todas');
  const [q, setQ] = useState('');
  const [abierta, setAbierta] = useState<number | null>(null);

  const lista = useMemo(() => RECETAS.filter((r) =>
    (filtro === 'todas' || r.suave) &&
    (cat === 'todas' || r.cat === cat) &&
    (!q || r.nombre.toLowerCase().includes(q.toLowerCase()))
  ), [filtro, cat, q]);

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="text-2xl font-bold">Recetas</h1>
        <span className="text-xs font-bold text-[#8A6D1C]">{RECETAS.length} recetas</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">Las 35 del kit + <b className="text-[#8A6D1C]">10 exclusivas del app ✦</b></p>

      <p className="text-xs font-semibold text-gray-500 mb-2">¿Cómo está tu estómago hoy?</p>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setFiltro('suaves')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${filtro === 'suaves' ? 'bg-[#28415E] text-white border-[#28415E]' : 'bg-white border-gray-200 text-gray-600'}`}>Sensible 🫧</button>
        <button onClick={() => setFiltro('todas')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${filtro === 'todas' ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-gray-200 text-gray-600'}`}>Normal</button>
      </div>

      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        {([['todas', 'Todas'], ['desayuno', 'Desayunos'], ['principal', 'Principales'], ['snack', 'Snacks']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setCat(v)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${cat === v ? 'bg-[#C9A035] text-white border-[#C9A035]' : 'bg-white border-gray-200 text-gray-500'}`}>{l}</button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar receta…" className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#166534]/30" />
      </div>

      {filtro === 'suaves' && (
        <p className="text-xs text-[#28415E] bg-[#EAF1FB] rounded-lg px-3 py-2 mb-3">Mostrando solo recetas suaves — ideales para el día de la dosis y estómagos sensibles.</p>
      )}

      {lista.map((r) => (
        <div key={r.id} className="card !p-0 overflow-hidden">
          <button onClick={() => setAbierta(abierta === r.id ? null : r.id)} className="w-full text-left p-4">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-sm leading-snug">{r.nombre}</h3>
              {abierta === r.id ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="tag bg-[#EAF4EC] text-[#166534]">~{r.proteina} g proteína</span>
              <span className="tag bg-[#F7F0DF] text-[#8A6D1C]">{r.min} min</span>
              <span className="tag bg-gray-100 text-gray-500">{r.porciones} porción{r.porciones > 1 ? 'es' : ''}</span>
              {r.suave && <span className="tag bg-[#EAF1FB] text-[#28415E]">Suave</span>}
              {r.exclusiva && <span className="tag bg-[#C9A035] text-white">✦ Solo App</span>}
            </div>
          </button>
          {abierta === r.id && (
            <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
              <p className="mb-1.5"><b className="text-[#1F2430]">Ingredientes:</b> {r.ing}</p>
              <p><b className="text-[#1F2430]">Preparación:</b> {r.prep}</p>
            </div>
          )}
        </div>
      ))}
      {!lista.length && (
        <div className="text-center py-10 anim-fade-up">
          <svg viewBox="0 0 80 64" className="h-16 mx-auto mb-3" fill="none" aria-hidden="true">
            <path d="M12 34 H68 A28 28 0 0 1 40 60 A28 28 0 0 1 12 34 Z" stroke="#C9A035" strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M28 24 Q31 17 28 10" stroke="#A9C0A9" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M40 26 Q43 19 40 12" stroke="#A9C0A9" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M52 24 Q55 17 52 10" stroke="#A9C0A9" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-500 font-semibold">Ninguna receta coincide</p>
          <p className="text-xs text-gray-400 mt-1">Prueba con otra palabra o quita los filtros.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Plan semanal ---------- */
const COMIDAS: { id: Comida; label: string; cats: Receta['cat'][] }[] = [
  { id: 'desayuno', label: 'Desayuno', cats: ['desayuno'] },
  { id: 'almuerzo', label: 'Almuerzo', cats: ['principal'] },
  { id: 'cena', label: 'Cena', cats: ['principal'] },
  { id: 'snack', label: 'Merienda', cats: ['snack'] },
];
const DIAS_CORTOS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function PantallaPlan({ meta, plan, setPlan, comprasHechas, toggleCompra }: {
  meta: number; plan: PlanSemanal; setPlan: (p: PlanSemanal) => void;
  comprasHechas: string[]; toggleCompra: (item: string) => void;
}) {
  const [dia, setDia] = useState(new Date().getDay());
  const [eligiendo, setEligiendo] = useState<Comida | null>(null);
  const [verCompras, setVerCompras] = useState(false);

  const planDia = plan[dia] ?? {};
  const proteinaDia = COMIDAS.reduce((s, c) => {
    const r = RECETAS.find((x) => x.id === planDia[c.id]);
    return s + (r?.proteina ?? 0);
  }, 0);
  const falta = meta - proteinaDia;

  // Lista de compras: ingredientes de todas las recetas planificadas en la semana
  const compras = useMemo(() => {
    const porReceta = new Map<string, string[]>();
    for (let d = 0; d < 7; d++) {
      for (const c of COMIDAS) {
        const r = RECETAS.find((x) => x.id === plan[d]?.[c.id]);
        if (r && !porReceta.has(r.nombre)) {
          porReceta.set(r.nombre, r.ing.replace(/\.$/, '').split(', ').map((s) => s.trim()));
        }
      }
    }
    return [...porReceta.entries()];
  }, [plan]);

  if (verCompras) {
    return (
      <div className="max-w-md mx-auto px-5 pt-8">
        <button onClick={() => setVerCompras(false)} className="text-sm font-bold text-gray-500 mb-4">← Volver al plan</button>
        <h1 className="text-2xl font-bold mb-1">Lista de compras</h1>
        <p className="text-sm text-gray-500 mb-4">Generada con las recetas de tu semana. Marca lo que ya tienes en casa.</p>
        {!compras.length && <p className="text-sm text-gray-400 py-8 text-center">Aún no planificaste ninguna comida esta semana.</p>}
        {compras.map(([receta, items]) => (
          <div key={receta} className="card">
            <p className="font-bold text-sm mb-2">{receta}</p>
            {items.map((it) => {
              const key = `${receta}::${it}`;
              const hecho = comprasHechas.includes(key);
              return (
                <button key={key} onClick={() => toggleCompra(key)} className="w-full flex items-center gap-2.5 py-1.5 text-left">
                  <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${hecho ? 'bg-[#166534] border-[#166534] anim-pop' : 'border-gray-300'}`}>
                    {hecho && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <span className={`text-sm ${hecho ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{it}</span>
                </button>
              );
            })}
          </div>
        ))}
        <p className="text-[10px] text-gray-400 text-center mt-2 mb-4">Los básicos de despensa completos están en Más → Lista de Supermercado Inteligente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold mb-1">Mi semana</h1>
      <p className="text-sm text-gray-500 mb-4">Planifica una vez y repite: tu semana tipo, siempre a mano.</p>

      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {DIAS_CORTOS.map((d, i) => {
          const tiene = Object.keys(plan[i] ?? {}).length > 0;
          return (
            <button key={i} onClick={() => setDia(i)} className={`py-2.5 rounded-xl text-sm font-bold border relative ${dia === i ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-gray-200 text-gray-500'}`}>
              {d}
              {tiene && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${dia === i ? 'bg-[#D4AF37]' : 'bg-[#166534]'}`} />}
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl px-4 py-3 mb-3 text-sm font-semibold ${falta <= 0 ? 'bg-[#EAF4EC] text-[#166534]' : proteinaDia > 0 ? 'bg-[#FDF6E3] text-[#8A6D1C]' : 'bg-gray-50 text-gray-400'}`}>
        {proteinaDia === 0 ? `Meta del día: ~${meta} g de proteína` : falta <= 0 ? `¡${DIAS[dia]} completo! ~${proteinaDia} g de proteína ✓` : `Este ${DIAS[dia].toLowerCase()} te faltan ~${falta} g de proteína`}
      </div>

      {COMIDAS.map((c) => {
        const r = RECETAS.find((x) => x.id === planDia[c.id]);
        return (
          <button key={c.id} onClick={() => setEligiendo(c.id)} className="card w-full text-left !mb-2.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#C9A035]">{c.label}</p>
              {r ? (
                <p className="text-sm font-semibold">{r.nombre} <span className="text-xs text-gray-400 font-normal">· {r.proteina} g · {r.min} min</span></p>
              ) : (
                <p className="text-sm text-gray-400">Toca para elegir…</p>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-300 shrink-0" />
          </button>
        );
      })}

      <button onClick={() => setVerCompras(true)} className="w-full mt-3 bg-[#C9A035] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow">
        <ShoppingCart className="h-4 w-4" /> Lista de compras de la semana
      </button>

      {eligiendo && (
        <SelectorReceta
          cats={COMIDAS.find((c) => c.id === eligiendo)!.cats}
          onPick={(id) => {
            setPlan({ ...plan, [dia]: { ...planDia, [eligiendo]: id } });
            setEligiendo(null);
          }}
          onQuitar={() => {
            const nuevo = { ...planDia }; delete nuevo[eligiendo];
            setPlan({ ...plan, [dia]: nuevo });
            setEligiendo(null);
          }}
          onCerrar={() => setEligiendo(null)}
        />
      )}
    </div>
  );
}

function SelectorReceta({ cats, onPick, onQuitar, onCerrar }: {
  cats: Receta['cat'][]; onPick: (id: number) => void; onQuitar: () => void; onCerrar: () => void;
}) {
  const [soloSuaves, setSoloSuaves] = useState(false);
  const lista = RECETAS.filter((r) => cats.includes(r.cat) && (!soloSuaves || r.suave));
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={onCerrar}>
      <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-5 max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">Elige la receta</h2>
          <button onClick={() => setSoloSuaves(!soloSuaves)} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${soloSuaves ? 'bg-[#28415E] text-white border-[#28415E]' : 'border-gray-200 text-gray-500'}`}>Solo suaves</button>
        </div>
        {lista.map((r) => (
          <button key={r.id} onClick={() => onPick(r.id)} className="w-full text-left py-3 border-t border-gray-100">
            <p className="text-sm font-semibold">{r.nombre}</p>
            <p className="text-xs text-gray-400">{r.proteina} g proteína · {r.min} min{r.suave ? ' · suave' : ''}</p>
          </button>
        ))}
        <button onClick={onQuitar} className="w-full mt-3 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-50">Quitar de este día</button>
      </div>
    </div>
  );
}

/* ---------- Progreso ---------- */
function PantallaProgreso({ estado, onPeso, onMedidas }: {
  estado: ReturnType<typeof useEstado>[0];
  onPeso: (kg: number) => void;
  onMedidas: (m: Medidas) => void;
}) {
  const perfil = estado.perfil!;
  const [pesoInput, setPesoInput] = useState('');
  const [med, setMed] = useState<Medidas>({ fecha: hoyISO() });
  const [verInforme, setVerInforme] = useState(false);

  const tendencia = tendenciaSemanal(estado.pesos);
  const ultimo = estado.pesos.length ? [...estado.pesos].sort((a, b) => a.fecha.localeCompare(b.fecha)).at(-1)!.kg : null;
  const delta = ultimo !== null ? Math.round((ultimo - perfil.pesoInicial) * 10) / 10 : null;

  const ultimos14 = useMemo(() => {
    const out: { fecha: string; nauseas?: number; energia?: number }[] = [];
    const d = new Date();
    for (let i = 13; i >= 0; i--) {
      const dd = new Date(d); dd.setDate(d.getDate() - i);
      const iso = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`;
      const r = estado.registros[iso];
      out.push({ fecha: iso.slice(8), nauseas: r?.nauseas, energia: r?.energia });
    }
    return out;
  }, [estado.registros]);

  if (verInforme) return <Informe estado={estado} onCerrar={() => setVerInforme(false)} />;

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold mb-4">Mi progreso</h1>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">Peso</h2>
          {delta !== null && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${delta <= 0 ? 'bg-[#EAF4EC] text-[#166534]' : 'bg-amber-50 text-amber-700'}`}>
              {delta > 0 ? '+' : ''}{delta} kg desde el inicio
            </span>
          )}
        </div>
        {tendencia.length >= 2 ? <GraficoLinea datos={tendencia} /> : (
          <div className="flex items-center gap-4 mb-3">
            <svg viewBox="0 0 72 56" className="h-14 shrink-0" fill="none" aria-hidden="true">
              <path d="M36 52 C35 42 37 34 36 26" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M36 36 Q26 33 21 38 Q28 43 36 36 Z" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
              <path d="M36 26 Q45 22 50 27 Q43 33 36 26 Z" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
              <path d="M10 20 Q28 26 40 14 Q52 4 64 8" stroke="#C9A035" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 6" />
            </svg>
            <p className="text-xs text-gray-400">Registra tu peso 2 veces por semana — aquí verás la tendencia semanal (más estable y honesta que el número diario).</p>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <input value={pesoInput} onChange={(e) => setPesoInput(e.target.value)} type="number" inputMode="decimal" placeholder={`Peso de hoy (kg)`} className="inp flex-1 !mb-0" />
          <button
            onClick={() => { const v = Number(pesoInput); if (v >= 30 && v <= 300) { onPeso(v); setPesoInput(''); } }}
            className="bg-[#166534] text-white font-bold px-5 rounded-xl text-sm"
          >Guardar</button>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">Náuseas y energía · últimos 14 días</h2>
        {ultimos14.some((d) => d.nauseas !== undefined || d.energia !== undefined) ? (
          <>
            <GraficoBarras datos={ultimos14} />
            <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Náuseas</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Energía</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400">Registra náuseas y energía en la pestaña Hoy — en pocos días verás aquí tu patrón (y cómo mejora).</p>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold mb-1 flex items-center gap-2"><Ruler className="h-4 w-4 text-[#C9A035]" /> Medidas del mes</h2>
        <p className="text-[11px] text-gray-400 mb-3">Una vez al mes, en ayunas. La cinta no miente: si la cintura baja con peso estable, estás perdiendo grasa y conservando músculo.</p>
        <div className="grid grid-cols-2 gap-2">
          {([['cintura', 'Cintura'], ['cadera', 'Cadera'], ['brazo', 'Brazo'], ['muslo', 'Muslo']] as const).map(([k, l]) => (
            <input key={k} type="number" inputMode="decimal" placeholder={`${l} (cm)`} value={med[k] ?? ''} onChange={(e) => setMed({ ...med, [k]: e.target.value ? Number(e.target.value) : undefined })} className="inp !mb-0" />
          ))}
        </div>
        <button onClick={() => { onMedidas({ ...med, fecha: hoyISO() }); setMed({ fecha: hoyISO() }); }} className="w-full mt-3 bg-[#166534] text-white font-bold py-3 rounded-xl text-sm">Guardar medidas</button>
        {estado.medidas.length > 0 && (
          <div className="mt-3 text-xs text-gray-600 space-y-1">
            {[...estado.medidas].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3).map((m) => (
              <p key={m.fecha}><b>{m.fecha}</b> — {m.cintura ? `cintura ${m.cintura}` : ''}{m.cadera ? ` · cadera ${m.cadera}` : ''}{m.brazo ? ` · brazo ${m.brazo}` : ''}{m.muslo ? ` · muslo ${m.muslo}` : ''} cm</p>
            ))}
          </div>
        )}
      </div>

      <FotosProgreso />

      <button onClick={() => setVerInforme(true)} className="w-full bg-[#C9A035] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow mb-4">
        <Printer className="h-4 w-4" /> Informe para mi médico
      </button>
    </div>
  );
}

function FotosProgreso() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [cargado, setCargado] = useState(false);
  const [grande, setGrande] = useState<Foto | null>(null);

  React.useEffect(() => {
    listarFotos().then((f) => { setFotos(f); setCargado(true); }).catch(() => setCargado(true));
  }, []);

  const agregar = async (file: File) => {
    const data = await comprimirImagen(file);
    const foto = { fecha: new Date().toISOString(), data };
    await guardarFoto(foto);
    setFotos((f) => [foto, ...f]);
  };

  return (
    <div className="card">
      <h2 className="font-bold mb-1 flex items-center gap-2"><Camera className="h-4 w-4 text-[#C9A035]" /> Fotos de progreso</h2>
      <p className="text-[11px] text-gray-400 mb-3">100% privadas: se guardan solo en tu teléfono, nunca salen de él. Una al mes, misma ropa, misma luz — el espejo del que sí te puedes fiar.</p>
      <label className="block w-full text-center bg-[#EAF4EC] border border-[#CBE3D1] text-[#166534] font-bold py-3 rounded-xl text-sm cursor-pointer">
        + Agregar foto de hoy
        <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) agregar(f); e.target.value = ''; }} />
      </label>
      {cargado && fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {fotos.map((f) => (
            <button key={f.fecha} onClick={() => setGrande(f)} className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100">
              <img src={f.data} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] font-semibold py-0.5 text-center">{f.fecha.slice(0, 10)}</span>
            </button>
          ))}
        </div>
      )}
      {grande && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setGrande(null)}>
          <img src={grande.data} alt="" className="max-h-[75vh] rounded-2xl" />
          <p className="text-white/70 text-xs mt-3">{grande.fecha.slice(0, 10)}</p>
          <button
            onClick={(e) => { e.stopPropagation(); borrarFoto(grande.fecha).then(() => { setFotos((f) => f.filter((x) => x.fecha !== grande.fecha)); setGrande(null); }); }}
            className="mt-3 text-red-400 text-sm font-bold bg-white/10 rounded-xl px-5 py-2.5"
          >Eliminar esta foto</button>
        </div>
      )}
    </div>
  );
}

function GraficoLinea({ datos }: { datos: { etiqueta: string; kg: number }[] }) {
  const W = 320, H = 120, P = 24;
  const min = Math.min(...datos.map((d) => d.kg)) - 0.5;
  const max = Math.max(...datos.map((d) => d.kg)) + 0.5;
  const x = (i: number) => P + (i * (W - 2 * P)) / Math.max(1, datos.length - 1);
  const y = (v: number) => H - P - ((v - min) * (H - 2 * P)) / (max - min);
  const pts = datos.map((d, i) => `${x(i)},${y(d.kg)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <polyline points={pts} fill="none" stroke="#166534" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {datos.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.kg)} r="3.5" fill="#166534" />
          <text x={x(i)} y={y(d.kg) - 8} textAnchor="middle" fontSize="9" fill="#1F2430" fontWeight="700">{d.kg}</text>
          <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">{d.etiqueta}</text>
        </g>
      ))}
    </svg>
  );
}

function GraficoBarras({ datos }: { datos: { fecha: string; nauseas?: number; energia?: number }[] }) {
  const W = 320, H = 90, bw = W / datos.length;
  const y = (v: number) => 70 - (v / 3) * 55;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {datos.map((d, i) => (
        <g key={i}>
          {d.nauseas !== undefined && <rect x={i * bw + 3} y={y(d.nauseas)} width={(bw - 8) / 2} height={70 - y(d.nauseas) + 2} rx="1.5" fill="#DC2626" opacity=".85" />}
          {d.energia !== undefined && <rect x={i * bw + 3 + (bw - 8) / 2 + 2} y={y(d.energia)} width={(bw - 8) / 2} height={70 - y(d.energia) + 2} rx="1.5" fill="#16A34A" opacity=".85" />}
          {i % 2 === 0 && <text x={i * bw + bw / 2} y={84} textAnchor="middle" fontSize="7.5" fill="#9CA3AF">{d.fecha}</text>}
        </g>
      ))}
      <line x1="0" y1="72" x2={W} y2="72" stroke="#E5E7EB" />
    </svg>
  );
}

/* ---------- Informe médico ---------- */
function Informe({ estado, onCerrar }: { estado: ReturnType<typeof useEstado>[0]; onCerrar: () => void }) {
  const perfil = estado.perfil!;
  const regs = (Object.values(estado.registros) as RegistroDia[]).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-30);
  const prom = (k: 'nauseas' | 'energia') => {
    const v = regs.map((r) => r[k]).filter((x): x is number => x !== undefined);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—';
  };
  const nivel3 = regs.filter((r) => r.nauseas === 3).length;
  const pesos = [...estado.pesos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const medidas = [...estado.medidas].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div className="max-w-md mx-auto px-5 pt-8 print:pt-2">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <button onClick={onCerrar} className="text-sm font-bold text-gray-500">← Volver</button>
        <button onClick={() => window.print()} className="bg-[#166534] text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2"><Printer className="h-4 w-4" /> Imprimir / PDF</button>
      </div>
      <div className="card">
        <p className="text-[#C9A035] font-bold text-[10px] uppercase tracking-widest">Guía GLP-1 Inteligente</p>
        <h1 className="text-xl font-bold mb-1">Informe para consulta médica</h1>
        <p className="text-xs text-gray-500 mb-4">{perfil.nombre} · {perfil.medicamento} · dosis los {DIAS[perfil.diaDosis].toLowerCase()}s · generado el {new Date().toLocaleDateString('es-419')}</p>

        <h2 className="font-bold text-sm mb-2">Últimos 30 días de registro</h2>
        <table className="w-full text-xs mb-4">
          <tbody>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Náuseas (promedio 0–3)</td><td className="text-right font-bold">{prom('nauseas')}</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Días con náuseas nivel 3</td><td className="text-right font-bold">{nivel3}</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Energía (promedio 0–3)</td><td className="text-right font-bold">{prom('energia')}</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Días registrados</td><td className="text-right font-bold">{regs.length}</td></tr>
          </tbody>
        </table>

        <h2 className="font-bold text-sm mb-2">Peso</h2>
        <table className="w-full text-xs mb-4">
          <tbody>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Inicial</td><td className="text-right font-bold">{perfil.pesoInicial} kg</td></tr>
            <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Actual</td><td className="text-right font-bold">{pesos.at(-1)?.kg ?? '—'} kg</td></tr>
            {perfil.objetivo && <tr className="border-t border-gray-100"><td className="py-1.5 text-gray-500">Objetivo</td><td className="text-right font-bold">{perfil.objetivo} kg</td></tr>}
          </tbody>
        </table>

        {regs.some((r) => r.nota?.trim()) && (<>
          <h2 className="font-bold text-sm mb-2">Notas del diario (últimas)</h2>
          <div className="text-xs mb-4">
            {regs.filter((r) => r.nota?.trim()).slice(-7).map((r) => (
              <p key={r.fecha} className="border-t border-gray-100 py-1.5"><b>{r.fecha}</b> — {r.nota}</p>
            ))}
          </div>
        </>)}

        {medidas.length > 0 && (<>
          <h2 className="font-bold text-sm mb-2">Medidas (cm)</h2>
          <table className="w-full text-xs mb-4">
            <thead><tr className="text-gray-400 text-left"><th className="font-semibold py-1">Fecha</th><th className="font-semibold">Cintura</th><th className="font-semibold">Cadera</th><th className="font-semibold">Brazo</th><th className="font-semibold">Muslo</th></tr></thead>
            <tbody>{medidas.map((m) => (
              <tr key={m.fecha} className="border-t border-gray-100"><td className="py-1.5">{m.fecha}</td><td>{m.cintura ?? '—'}</td><td>{m.cadera ?? '—'}</td><td>{m.brazo ?? '—'}</td><td>{m.muslo ?? '—'}</td></tr>
            ))}</tbody>
          </table>
        </>)}
        <p className="text-[10px] text-gray-400">Registro personal del o de la paciente vía app Guía GLP-1 Inteligente. No constituye historial clínico.</p>
      </div>
    </div>
  );
}

/* ---------- Más (menú) ---------- */
function PantallaMas({ estado, setEstado }: {
  estado: ReturnType<typeof useEstado>[0]; setEstado: ReturnType<typeof useEstado>[1];
}) {
  const [vista, setVista] = useState<'menu' | 'guia' | 'cuerpo' | 'salida' | 'super' | 'respaldo'>('menu');

  if (vista === 'guia') return <ConVolver onVolver={() => setVista('menu')}><PantallaGuia /></ConVolver>;
  if (vista === 'cuerpo') return <ConVolver onVolver={() => setVista('menu')}><CuerpoFirme estado={estado} setEstado={setEstado} /></ConVolver>;
  if (vista === 'salida') return <ConVolver onVolver={() => setVista('menu')}><PlanSalida estado={estado} setEstado={setEstado} /></ConVolver>;
  if (vista === 'super') return <ConVolver onVolver={() => setVista('menu')}><PantallaSuper estado={estado} setEstado={setEstado} /></ConVolver>;
  if (vista === 'respaldo') return <ConVolver onVolver={() => setVista('menu')}><CopiaSeguridad estado={estado} setEstado={setEstado} /></ConVolver>;

  const items = [
    { id: 'guia' as const, icon: <BookOpen className="h-5 w-5 text-[#C9A035]" />, titulo: 'Guía completa', sub: 'El método entero, capítulo por capítulo, offline' },
    { id: 'super' as const, icon: <ShoppingBag className="h-5 w-5 text-[#C9A035]" />, titulo: 'Lista de Supermercado Inteligente', sub: 'Qué sí llevar y qué no — con el porqué de cada uno' },
    { id: 'cuerpo' as const, icon: <Flame className="h-5 w-5 text-[#C9A035]" />, titulo: 'Cuerpo Firme', sub: 'Rutinas de 12–15 min en casa, con cronómetro' },
    { id: 'salida' as const, icon: <Sparkles className="h-5 w-5 text-[#C9A035]" />, titulo: 'Plan de Salida', sub: estado.salida ? `Activo · semana ${semanaSalida(estado.salida)} de 12` : '12 semanas contra el rebote — cuando llegue el momento' },
    { id: 'respaldo' as const, icon: <ShieldCheck className="h-5 w-5 text-[#C9A035]" />, titulo: 'Copia de seguridad', sub: 'Respalda o restaura tus datos — todo queda contigo' },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold mb-4">Más herramientas</h1>
      {items.map((it) => (
        <button key={it.id} onClick={() => setVista(it.id)} className="card w-full text-left flex items-center gap-4">
          <span className="h-11 w-11 rounded-xl bg-[#F7F0DF] flex items-center justify-center shrink-0">{it.icon}</span>
          <span>
            <span className="font-bold text-sm block">{it.titulo}</span>
            <span className="text-xs text-gray-500">{it.sub}</span>
          </span>
        </button>
      ))}
      <p className="text-[10px] text-gray-400 text-center mt-4">
        Recurso educativo · no sustituye a tu equipo de salud · soporte@guiaglp1.com
      </p>
    </div>
  );
}

function ConVolver({ children, onVolver }: { children: React.ReactNode; onVolver: () => void }) {
  return (
    <div>
      <div className="max-w-md mx-auto px-5 pt-5">
        <button onClick={onVolver} className="text-sm font-bold text-gray-500">← Más herramientas</button>
      </div>
      {children}
    </div>
  );
}

/* ---------- Cuerpo Firme ---------- */
function CuerpoFirme({ estado, setEstado }: {
  estado: ReturnType<typeof useEstado>[0]; setEstado: ReturnType<typeof useEstado>[1];
}) {
  const [activa, setActiva] = useState<Rutina | null>(null);
  const hoy = hoyISO();
  const semanaCount = estado.rutinasHechas.filter((r) => {
    const [fecha] = r.split(':');
    const d = new Date(fecha + 'T12:00:00');
    const dif = (Date.now() - d.getTime()) / 86400000;
    return dif >= 0 && dif < 7;
  }).length;

  if (activa) {
    return (
      <TimerRutina
        rutina={activa}
        onFin={() => {
          setEstado((e) => ({ ...e, rutinasHechas: [...e.rutinasHechas, `${hoy}:${activa.id}`] }));
          setActiva(null);
        }}
        onSalir={() => setActiva(null)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-4">
      <h1 className="text-2xl font-bold mb-1">Cuerpo Firme</h1>
      <p className="text-sm text-gray-500 mb-3">Proteger tu músculo es proteger tu metabolismo. 2–3 rutinas por semana, en casa, sin equipamiento.</p>
      <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-semibold ${semanaCount >= 2 ? 'bg-[#EAF4EC] text-[#166534]' : 'bg-[#FDF6E3] text-[#8A6D1C]'}`}>
        {semanaCount >= 2 ? `¡${semanaCount} rutinas esta semana! Meta cumplida ✓` : `${semanaCount} de 2 rutinas esta semana`}
      </div>
      {RUTINAS.map((r) => (
        <div key={r.id} className="card">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#C9A035]">{r.foco}</p>
          <p className="font-bold mb-1">{r.nombre}</p>
          <p className="text-xs text-gray-500 mb-3">{r.ejercicios.map((e) => e.nombre).join(' · ')}</p>
          <button onClick={() => setActiva(r)} className="w-full bg-[#166534] text-white font-bold py-3 rounded-xl text-sm">Empezar rutina ▶</button>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 mt-1 mb-4">Consulta a tu médico antes de empezar ejercicio, especialmente si tienes limitaciones físicas. Detente si sientes mareo o dolor.</p>
    </div>
  );
}

function TimerRutina({ rutina, onFin, onSalir }: { rutina: Rutina; onFin: () => void; onSalir: () => void }) {
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState<'trabajo' | 'descanso'>('trabajo');
  const [seg, setSeg] = useState(rutina.ejercicios[0].seg);
  const [pausa, setPausa] = useState(false);

  React.useEffect(() => {
    if (pausa) return;
    const id = setInterval(() => setSeg((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [pausa, fase, idx]);

  React.useEffect(() => {
    if (seg > 0) return;
    if (navigator.vibrate) navigator.vibrate(200);
    if (fase === 'trabajo') {
      if (idx === rutina.ejercicios.length - 1) { onFin(); return; }
      setFase('descanso'); setSeg(20);
    } else {
      setIdx((i) => i + 1); setFase('trabajo'); setSeg(rutina.ejercicios[idx + 1].seg);
    }
  }, [seg]);

  const ej = rutina.ejercicios[idx];
  const siguiente = rutina.ejercicios[idx + 1];
  const total = fase === 'trabajo' ? ej.seg : 20;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0A2A18] to-[#17452A] text-white flex flex-col items-center justify-center p-8 text-center">
      <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">{rutina.nombre} · {idx + 1} de {rutina.ejercicios.length}</p>
      <h2 className="text-2xl font-bold mb-2">{fase === 'trabajo' ? ej.nombre : 'Descansa 💨'}</h2>
      <p className="text-sm text-green-100/70 mb-6 max-w-xs">{fase === 'trabajo' ? ej.nota : siguiente ? `Siguiente: ${siguiente.nombre}` : ''}</p>
      <div className="relative h-52 w-52 mb-8">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,.12)" strokeWidth="7" fill="none" />
          <circle
            cx="100" cy="100" r="88" stroke="#D4AF37" strokeWidth="7" fill="none" strokeLinecap="round"
            pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, seg) / total}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <p className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold tabular-nums" style={{ color: fase === 'trabajo' ? '#fff' : '#D4AF37' }}>{seg}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setPausa(!pausa)} className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 font-bold text-sm">{pausa ? 'Continuar ▶' : 'Pausa ⏸'}</button>
        <button onClick={onSalir} className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 font-bold text-sm text-white/60">Salir</button>
      </div>
    </div>
  );
}

/* ---------- Plan de Salida interactivo ---------- */
function PlanSalida({ estado, setEstado }: {
  estado: ReturnType<typeof useEstado>[0]; setEstado: ReturnType<typeof useEstado>[1];
}) {
  const salida = estado.salida;

  if (!salida) {
    return (
      <div className="max-w-md mx-auto px-5 pt-4">
        <h1 className="text-2xl font-bold mb-1">Plan de Salida</h1>
        <p className="text-sm text-gray-500 mb-4">Las 12 semanas que convierten tu resultado en tu nueva normalidad — para cuando tú y tu médico decidan finalizar el tratamiento.</p>
        <div className="rounded-2xl bg-gradient-to-br from-[#0D3320] to-[#17452A] text-white p-6 mb-4">
          <Lock className="h-8 w-8 text-[#D4AF37] mb-3" />
          <p className="font-bold mb-1">Este plan se activa cuando llegue tu momento</p>
          <p className="text-xs text-green-100/70 mb-4">La mayoría recupera el peso al dejar el GLP-1 porque nunca construyó el sistema que lo reemplace. Tú vas a tener el sistema.</p>
          {FASES_SALIDA.map((f) => (
            <p key={f.nombre} className="text-xs text-white/60 py-1 border-t border-white/10">🔒 {f.semanas} — {f.nombre}</p>
          ))}
        </div>
        <button
          onClick={() => {
            if (confirm('¿Tu médico y tú decidieron finalizar o reducir el tratamiento? El plan de 12 semanas empieza hoy.')) {
              setEstado((e) => ({ ...e, salida: { inicio: hoyISO(), checks: [] } }));
            }
          }}
          className="w-full bg-[#C9A035] text-white font-bold py-4 rounded-xl"
        >
          Mi médico y yo decidimos terminar — activar el plan
        </button>
        <p className="text-[10px] text-gray-400 mt-2 mb-4">Nunca suspendas ni modifiques tu dosis por cuenta propia. Este plan acompaña la decisión médica — no la sustituye.</p>
      </div>
    );
  }

  const semana = semanaSalida(salida);
  const faseActual = semana <= 4 ? 0 : semana <= 8 ? 1 : 2;
  const toggle = (key: string) =>
    setEstado((e) => ({
      ...e,
      salida: { ...salida, checks: salida.checks.includes(key) ? salida.checks.filter((x) => x !== key) : [...salida.checks, key] },
    }));

  return (
    <div className="max-w-md mx-auto px-5 pt-4">
      <h1 className="text-2xl font-bold mb-1">Plan de Salida</h1>
      <p className="text-sm text-gray-500 mb-3">Empezaste el {new Date(salida.inicio + 'T12:00:00').toLocaleDateString('es-419')}.</p>
      <div className="rounded-xl bg-[#F7F0DF] border border-[#E5D7B2] px-4 py-3 mb-4">
        <p className="font-bold text-[#8A6D1C] text-sm">Semana {semana} de 12</p>
        <div className="h-2 bg-white rounded-full mt-1.5"><div className="h-full bg-[#C9A035] rounded-full" style={{ width: `${(semana / 12) * 100}%` }} /></div>
      </div>
      {FASES_SALIDA.map((f, fi) => (
        <div key={f.nombre} className={`card ${fi === faseActual ? 'ring-2 ring-[#C9A035]' : fi < faseActual ? 'opacity-70' : 'opacity-50'}`}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#C9A035]">{f.semanas}{fi === faseActual ? ' · estás aquí' : fi < faseActual ? ' · completada' : ''}</p>
          <p className="font-bold text-sm mb-2">{f.nombre}</p>
          {f.items.map((it) => {
            const key = `f${fi}:${it.slice(0, 30)}`;
            const hecho = salida.checks.includes(key);
            return (
              <button key={key} onClick={() => toggle(key)} className="w-full flex items-start gap-2.5 py-1.5 text-left">
                <span className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${hecho ? 'bg-[#166534] border-[#166534] anim-pop' : 'border-gray-300'}`}>
                  {hecho && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className={`text-xs leading-snug ${hecho ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{it}</span>
              </button>
            );
          })}
        </div>
      ))}
      <button
        onClick={() => { if (confirm('¿Desactivar el plan? Tu progreso de checks se perderá.')) setEstado((e) => ({ ...e, salida: undefined })); }}
        className="w-full py-3 text-xs font-bold text-gray-400 mb-4"
      >Desactivar el plan</button>
    </div>
  );
}

/* ---------- Módulo 3: Lista de Supermercado Inteligente ---------- */
function PantallaSuper({ estado, setEstado }: {
  estado: ReturnType<typeof useEstado>[0]; setEstado: ReturnType<typeof useEstado>[1];
}) {
  const [tab, setTab] = useState<'si' | 'no'>('si');
  const hechos = estado.despensaHecha;
  const total = LISTA_SUPER.reduce((s, c) => s + c.items.length, 0);
  const toggle = (key: string) =>
    setEstado((e) => ({
      ...e,
      despensaHecha: e.despensaHecha.includes(key) ? e.despensaHecha.filter((x) => x !== key) : [...e.despensaHecha, key],
    }));

  return (
    <div className="max-w-md mx-auto px-5 pt-4">
      <h1 className="text-2xl font-bold mb-1">Lista de Supermercado</h1>
      <p className="text-sm text-gray-500 mb-4">Si el 80% de tu carrito sale de esta lista, la mitad del trabajo está hecho antes de cocinar.</p>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('si')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 ${tab === 'si' ? 'bg-[#166534] text-white border-[#166534]' : 'bg-white border-gray-200 text-gray-600'}`}>
          <Check className="h-4 w-4" /> Sí llevar
        </button>
        <button onClick={() => setTab('no')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 ${tab === 'no' ? 'bg-[#8C2F2F] text-white border-[#8C2F2F]' : 'bg-white border-gray-200 text-gray-600'}`}>
          <X className="h-4 w-4" /> Mejor no
        </button>
      </div>

      {tab === 'si' ? (
        <>
          <div className="rounded-xl bg-[#EAF4EC] border border-[#CBE3D1] px-4 py-3 mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#166534]">{hechos.length} de {total} en tu despensa</p>
            {hechos.length > 0 && (
              <button onClick={() => setEstado((e) => ({ ...e, despensaHecha: [] }))} className="text-xs font-bold text-[#166534]/60">Desmarcar todo</button>
            )}
          </div>
          {LISTA_SUPER.map((c) => (
            <div key={c.categoria} className="card">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#C9A035] mb-1.5">{c.categoria}</p>
              {c.items.map((it) => {
                const key = `${c.categoria}::${it}`;
                const hecho = hechos.includes(key);
                return (
                  <button key={key} onClick={() => toggle(key)} className="w-full flex items-center gap-2.5 py-1.5 text-left">
                    <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${hecho ? 'bg-[#166534] border-[#166534] anim-pop' : 'border-gray-300'}`}>
                      {hecho && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className={`text-sm ${hecho ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{it}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">No es prohibición — es información. Estos son los que más síntomas provocan con GLP-1, y el porqué:</p>
          {ALIMENTOS_EVITAR.map((a) => (
            <div key={a.nombre} className="card !border-[#F0D9D9] bg-[#FDF8F8]">
              <p className="font-bold text-sm text-[#8C2F2F] flex items-start gap-2"><X className="h-4 w-4 mt-0.5 shrink-0" />{a.nombre}</p>
              <p className="text-xs text-gray-600 mt-1 ml-6 leading-relaxed">{a.razon}</p>
            </div>
          ))}
          <p className="text-[10px] text-gray-400 text-center mt-2 mb-4">Regla 80/20: si el 80% viene de la lista Sí, el 20% tiene espacio sin culpa.</p>
        </>
      )}
    </div>
  );
}

/* ---------- Copia de seguridad ---------- */
function CopiaSeguridad({ estado, setEstado }: {
  estado: ReturnType<typeof useEstado>[0]; setEstado: ReturnType<typeof useEstado>[1];
}) {
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const restaurar = async (file: File) => {
    try {
      const nuevo = await importarDatos(file);
      if (confirm('¿Restaurar este respaldo? Reemplazará los datos actuales del app en este dispositivo.')) {
        setEstado(() => nuevo);
        setMsg({ tipo: 'ok', texto: 'Respaldo restaurado correctamente ✓' });
      }
    } catch {
      setMsg({ tipo: 'error', texto: 'No se pudo leer el archivo. Verifica que sea un respaldo del app (.json).' });
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-4">
      <h1 className="text-2xl font-bold mb-1">Copia de seguridad</h1>
      <p className="text-sm text-gray-500 mb-4">Tus datos viven solo en este dispositivo — esa es tu privacidad. Un respaldo te protege si cambias de teléfono o borras el navegador.</p>

      <div className="card">
        <p className="font-bold text-sm mb-1 flex items-center gap-2"><Download className="h-4 w-4 text-[#C9A035]" /> Descargar respaldo</p>
        <p className="text-xs text-gray-500 mb-3">Registros, pesos, medidas, plan semanal y progreso — en un archivo que guardas donde quieras. (Las fotos no se incluyen: son demasiado pesadas.)</p>
        <button onClick={() => { exportarDatos(estado); setMsg({ tipo: 'ok', texto: 'Respaldo descargado ✓' }); }} className="w-full bg-[#166534] text-white font-bold py-3 rounded-xl text-sm">
          Descargar mi respaldo
        </button>
      </div>

      <div className="card">
        <p className="font-bold text-sm mb-1 flex items-center gap-2"><Upload className="h-4 w-4 text-[#C9A035]" /> Restaurar respaldo</p>
        <p className="text-xs text-gray-500 mb-3">En tu teléfono nuevo: activa el app con tu código y restaura aquí tu archivo de respaldo.</p>
        <label className="block w-full text-center bg-[#F7F0DF] border border-[#E5D7B2] text-[#8A6D1C] font-bold py-3 rounded-xl text-sm cursor-pointer">
          Elegir archivo de respaldo…
          <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) restaurar(f); e.target.value = ''; }} />
        </label>
      </div>

      {msg && (
        <p className={`text-sm font-semibold text-center rounded-xl px-4 py-3 mb-3 ${msg.tipo === 'ok' ? 'bg-[#EAF4EC] text-[#166534]' : 'bg-red-50 text-red-600'}`}>{msg.texto}</p>
      )}

      {estado.codigoUsado && (
        <div className="card flex items-center gap-3">
          <KeyRound className="h-4 w-4 text-[#C9A035] shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Tu código de activación (guárdalo para soporte)</p>
            <p className="font-bold text-sm tracking-widest">{estado.codigoUsado}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Guía ---------- */
function PantallaGuia() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto px-5 pt-4">
      <h1 className="text-2xl font-bold mb-1">Tu guía completa</h1>
      <p className="text-sm text-gray-500 mb-4">
        Los {GUIA_CAPITULOS.length} capítulos del método, siempre contigo y sin conexión. Consulta lo que necesites, cuando lo necesites.
      </p>

      {GUIA_CAPITULOS.map((c, i) => (
        <div key={i} className="card !p-0 overflow-hidden">
          <button onClick={() => setAbierto(abierto === i ? null : i)} className="w-full flex justify-between items-center text-left p-4">
            <span className="font-bold text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#C9A035] shrink-0" />{c.titulo}</span>
            {abierto === i ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>
          {abierto === i && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600 leading-relaxed">{c.texto}</p>
            </div>
          )}
        </div>
      ))}

      <p className="text-[10px] text-gray-400 text-center mt-4 mb-2">
        El Plan de Salida interactivo está en Más herramientas → Plan de Salida.
      </p>
    </div>
  );
}

/* ---------- Tab bar ---------- */
function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'hoy', icon: <Home className="h-5 w-5" />, label: 'Hoy' },
    { id: 'recetas', icon: <Utensils className="h-5 w-5" />, label: 'Recetas' },
    { id: 'plan', icon: <Calendar className="h-5 w-5" />, label: 'Semana' },
    { id: 'progreso', icon: <LineChart className="h-5 w-5" />, label: 'Progreso' },
    { id: 'mas', icon: <Sparkles className="h-5 w-5" />, label: 'Más' },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t-2 border-[#ECE7DD] print:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-md mx-auto grid grid-cols-5 px-2 py-1.5">
        {items.map((it) => {
          const activo = tab === it.id;
          return (
            <button key={it.id} onClick={() => setTab(it.id)} className="flex flex-col items-center gap-0.5 py-1.5">
              <span className={`flex items-center justify-center h-9 w-14 rounded-2xl transition-colors ${activo ? 'bg-[#E7F6EC] text-[#16A34A]' : 'text-gray-400'}`}>
                {it.icon}
              </span>
              <span className={`text-[10px] font-extrabold ${activo ? 'text-[#16A34A]' : 'text-gray-400'}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
