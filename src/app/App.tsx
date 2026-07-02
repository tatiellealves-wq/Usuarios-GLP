import React, { useMemo, useState } from 'react';
import {
  Activity, BookOpen, Calendar, Check, ChevronDown, ChevronUp, Droplets,
  Flame, Home, LineChart, Lock, Printer, Ruler, Search, Sparkles, Syringe, Utensils,
} from 'lucide-react';
import {
  CLAVE_ACCESO, FASES_SALIDA, GUIA_CAPITULOS, PASOS_INYECCION, RECETAS, type Receta,
} from './data';
import {
  esDiaDosis, hoyISO, lbAKg, metaProteina, racha, tendenciaSemanal, useEstado,
  type Medidas, type Perfil, type RegistroDia,
} from './store';

type Tab = 'hoy' | 'recetas' | 'progreso' | 'guia';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function App() {
  const [estado, setEstado] = useEstado();
  const [tab, setTab] = useState<Tab>('hoy');

  if (!estado.activado) {
    return <Activacion onOk={() => setEstado((e) => ({ ...e, activado: true }))} />;
  }
  if (!estado.perfil) {
    return <Onboarding onDone={(perfil) => setEstado((e) => ({ ...e, perfil }))} />;
  }

  const perfil = estado.perfil;
  const hoy = hoyISO();
  const reg: RegistroDia = estado.registros[hoy] ?? { fecha: hoy, agua: 0, proteina: false };
  const setReg = (r: Partial<RegistroDia>) =>
    setEstado((e) => ({ ...e, registros: { ...e.registros, [hoy]: { ...reg, ...r, fecha: hoy } } }));

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1F2430] font-sans pb-24">
      {tab === 'hoy' && <PantallaHoy perfil={perfil} reg={reg} setReg={setReg} registros={estado.registros} />}
      {tab === 'recetas' && <PantallaRecetas />}
      {tab === 'progreso' && (
        <PantallaProgreso
          estado={estado}
          onPeso={(kg) => setEstado((e) => ({ ...e, pesos: [...e.pesos.filter((p) => p.fecha !== hoy), { fecha: hoy, kg }] }))}
          onMedidas={(m) => setEstado((e) => ({ ...e, medidas: [...e.medidas.filter((x) => x.fecha !== m.fecha), m] }))}
        />
      )}
      {tab === 'guia' && <PantallaGuia />}
      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}

/* ---------- Activación ---------- */
function Activacion({ onOk }: { onOk: () => void }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2A18] via-[#10381F] to-[#17452A] flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[#166534] flex items-center justify-center mb-5">
          <Activity className="h-8 w-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-1">Guía GLP-1</h1>
        <p className="text-green-200/70 text-sm mb-8">Tu acompañamiento diario del tratamiento</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (clave.trim().toUpperCase() === CLAVE_ACCESO) onOk();
            else setError(true);
          }}
        >
          <label className="block text-left text-xs font-semibold text-green-100 mb-2 uppercase tracking-wider">
            Código de acceso
          </label>
          <input
            value={clave}
            onChange={(e) => { setClave(e.target.value); setError(false); }}
            placeholder="Lo recibiste por correo con tu compra"
            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3.5 text-center tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          {error && <p className="text-red-300 text-xs mt-2">Código no válido. Revisa el correo de tu compra.</p>}
          <button type="submit" className="w-full mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" /> Activar mi app
          </button>
        </form>
        <p className="text-white/40 text-[11px] mt-6">¿No encuentras tu código? Escribe a soporte@guiaglp1.com</p>
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
        <p className="text-[#C9A035] font-bold text-xs uppercase tracking-widest mb-2">Bienvenida</p>
        <h1 className="text-2xl font-bold mb-1">Personalicemos tu guía</h1>
        <p className="text-sm text-gray-500 mb-7">2 minutos — el app calcula tus metas con esto.</p>

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
  );
}

/* ---------- Hoy ---------- */
function PantallaHoy({ perfil, reg, setReg, registros }: {
  perfil: Perfil; reg: RegistroDia; setReg: (r: Partial<RegistroDia>) => void; registros: Record<string, RegistroDia>;
}) {
  const dosisHoy = esDiaDosis(perfil);
  const dias = racha(registros);
  const fecha = new Date().toLocaleDateString('es-419', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 capitalize">{fecha}</p>
          <h1 className="text-2xl font-bold">Hola, {perfil.nombre} 👋</h1>
        </div>
        {dias > 0 && (
          <div className="text-center bg-[#F7F0DF] border border-[#E5D7B2] rounded-xl px-3 py-1.5">
            <p className="text-lg font-extrabold text-[#C9A035] leading-none flex items-center gap-1"><Flame className="h-4 w-4" />{dias}</p>
            <p className="text-[10px] text-[#8A6D1C] font-semibold">días seguidos</p>
          </div>
        )}
      </div>

      {dosisHoy && <ModoInyeccion reg={reg} setReg={setReg} />}

      <div className="card">
        <h2 className="font-bold mb-3">Registro de hoy</h2>
        <Escala titulo="Náuseas" valor={reg.nauseas} onSet={(v) => setReg({ nauseas: v })} colores={['#16A34A', '#84CC16', '#F59E0B', '#DC2626']} />
        <Escala titulo="Energía" valor={reg.energia} onSet={(v) => setReg({ energia: v })} colores={['#DC2626', '#F59E0B', '#84CC16', '#16A34A']} />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-sky-500" />
            <span className="text-sm font-semibold">Agua</span>
            <span className="text-xs text-gray-400">{reg.agua} de 8 vasos</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setReg({ agua: Math.max(0, reg.agua - 1) })} className="h-9 w-9 rounded-full bg-gray-100 font-bold text-gray-600">−</button>
            <button onClick={() => setReg({ agua: Math.min(15, reg.agua + 1) })} className="h-9 w-9 rounded-full bg-sky-500 text-white font-bold">+</button>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < reg.agua ? 'bg-sky-400' : 'bg-gray-100'}`} />
          ))}
        </div>

        <button
          onClick={() => setReg({ proteina: !reg.proteina })}
          className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-colors ${reg.proteina ? 'bg-[#EAF4EC] border-[#CBE3D1] text-[#166534]' : 'bg-white border-gray-200 text-gray-500'}`}
        >
          <Check className={`h-4 w-4 ${reg.proteina ? '' : 'opacity-30'}`} />
          {reg.proteina ? `Proteína del día cumplida (~${metaProteina(perfil)} g) ✓` : `¿Cumpliste tu meta de ~${metaProteina(perfil)} g de proteína?`}
        </button>
      </div>

      {!dosisHoy && (
        <div className="card flex items-center gap-3">
          <Syringe className="h-5 w-5 text-[#C9A035] shrink-0" />
          <p className="text-sm text-gray-600">
            Tu próxima dosis: <b>{DIAS[perfil.diaDosis]}</b>. Ese día el app te guía paso a paso.
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
              <span className={`mt-0.5 h-4.5 w-4.5 min-w-4 h-4 w-4 rounded-full border flex items-center justify-center ${hechos.includes(p.id) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/40'}`}>
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
      <h1 className="text-2xl font-bold mb-4">Recetas</h1>

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
      {!lista.length && <p className="text-center text-sm text-gray-400 py-10">Ninguna receta coincide con la búsqueda.</p>}
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
          <p className="text-xs text-gray-400 mb-3">Registra tu peso 2 veces por semana — aquí verás la tendencia semanal (más estable y honesta que el número diario).</p>
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
        <GraficoBarras datos={ultimos14} />
        <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#DC2626]" /> Náuseas</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Energía</span>
        </div>
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

      <button onClick={() => setVerInforme(true)} className="w-full bg-[#C9A035] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow">
        <Printer className="h-4 w-4" /> Informe para mi médico
      </button>
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

        {medidas.length > 0 && (<>
          <h2 className="font-bold text-sm mb-2">Medidas (cm)</h2>
          <table className="w-full text-xs mb-4">
            <thead><tr className="text-gray-400 text-left"><th className="font-semibold py-1">Fecha</th><th className="font-semibold">Cintura</th><th className="font-semibold">Cadera</th><th className="font-semibold">Brazo</th><th className="font-semibold">Muslo</th></tr></thead>
            <tbody>{medidas.map((m) => (
              <tr key={m.fecha} className="border-t border-gray-100"><td className="py-1.5">{m.fecha}</td><td>{m.cintura ?? '—'}</td><td>{m.cadera ?? '—'}</td><td>{m.brazo ?? '—'}</td><td>{m.muslo ?? '—'}</td></tr>
            ))}</tbody>
          </table>
        </>)}
        <p className="text-[10px] text-gray-400">Registro personal de la paciente vía app Guía GLP-1 Inteligente. No constituye historial clínico.</p>
      </div>
    </div>
  );
}

/* ---------- Guía ---------- */
function PantallaGuia() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [verSalida, setVerSalida] = useState(false);

  return (
    <div className="max-w-md mx-auto px-5 pt-8">
      <h1 className="text-2xl font-bold mb-1">Tu guía de bolsillo</h1>
      <p className="text-sm text-gray-500 mb-4">
        Los recordatorios esenciales para consultar en segundos. El desarrollo completo — con las explicaciones, tablas y el paso a paso — está en tus <b>4 PDFs del kit</b>, que recibiste por correo.
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
              <p className="text-[10px] text-[#C9A035] font-semibold mt-2">📖 Versión resumida — el capítulo completo está en tu Guía Médica (Módulo 1)</p>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-2xl bg-gradient-to-br from-[#0D3320] to-[#17452A] text-white p-5 mt-2">
        <p className="font-bold flex items-center gap-2 mb-1"><Sparkles className="h-4 w-4 text-[#D4AF37]" /> Plan de Salida · 12 semanas</p>
        <p className="text-xs text-green-100/70 mb-3">Para cuando tú y tu médico decidan finalizar el tratamiento — el sistema para que el resultado se quede.</p>
        <button onClick={() => setVerSalida(!verSalida)} className="text-xs font-bold text-[#D4AF37]">{verSalida ? 'Ocultar el plan ↑' : 'Ver el plan completo ↓'}</button>
        {verSalida && FASES_SALIDA.map((f) => (
          <div key={f.nombre} className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">{f.semanas}</p>
            <p className="font-bold text-sm mb-1.5">{f.nombre}</p>
            <ul className="space-y-1">{f.items.map((it) => (
              <li key={it} className="text-xs text-white/80 flex gap-2"><Check className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />{it}</li>
            ))}</ul>
          </div>
        ))}
        <p className="text-[10px] text-white/40 mt-3">Nunca suspendas ni modifiques tu dosis por cuenta propia — este plan acompaña la decisión médica.</p>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-4 mb-2">
        Recurso educativo · no sustituye a tu equipo de salud · soporte@guiaglp1.com
      </p>
    </div>
  );
}

/* ---------- Tab bar ---------- */
function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'hoy', icon: <Home className="h-5 w-5" />, label: 'Hoy' },
    { id: 'recetas', icon: <Utensils className="h-5 w-5" />, label: 'Recetas' },
    { id: 'progreso', icon: <LineChart className="h-5 w-5" />, label: 'Progreso' },
    { id: 'guia', icon: <Calendar className="h-5 w-5" />, label: 'Guía' },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200 print:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map((it) => (
          <button key={it.id} onClick={() => setTab(it.id)} className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold ${tab === it.id ? 'text-[#166534]' : 'text-gray-400'}`}>
            {it.icon}{it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
