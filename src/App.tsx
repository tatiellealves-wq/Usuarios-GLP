import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  Star,
  Award,
  Activity,
  ShieldAlert,
  Lock,
  Sparkles,
  ShoppingCart,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  X,
  Globe,
  Thermometer,
  TrendingDown,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

/* Eyebrow editorial: rótulo entre finas reglas doradas — la firma visual de la página */
function Eyebrow({ children, tone = 'green', className = '' }: {
  children: React.ReactNode; tone?: 'green' | 'gold' | 'dark'; className?: string;
}) {
  const text = tone === 'green' ? 'text-brand-gold' : 'text-brand-gold';
  const rule = tone === 'dark' ? 'bg-brand-gold/50' : 'bg-brand-gold/70';
  return (
    <span className={`inline-flex items-center gap-3 mb-5 ${className}`}>
      <span className={`h-px w-7 ${rule}`} aria-hidden="true" />
      <span className={`text-[11px] font-bold uppercase tracking-[0.24em] ${text}`}>{children}</span>
      <span className={`h-px w-7 ${rule}`} aria-hidden="true" />
    </span>
  );
}

/* Sello insignia "App Completa" — el elemento de firma de la página: certifica que el producto es la app, no solo PDFs */
function AppSeal({ size = 88, rotate = -7, className = '' }: { size?: number; rotate?: number; className?: string }) {
  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full border border-brand-gold/50" />
      <div className="absolute inset-[5px] rounded-full border border-dashed border-brand-gold/35 seal-shine" />
      <div className="absolute inset-[9px] rounded-full bg-gradient-to-b from-[#232227] to-[#0E0D0B] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center px-1.5 ring-1 ring-black/20">
        <Smartphone className="h-4 w-4 text-brand-gold mb-1" strokeWidth={2.25} />
        <span className="text-[7.5px] font-black uppercase tracking-[0.1em] text-brand-gold leading-[1.15]">
          App<br />Completa
        </span>
      </div>
    </div>
  );
}

/* Mockup multi-dispositivo: notebook + tablet + teléfono con las pantallas reales de la app */
// Teléfono fotorrealista con la pantalla real del app compuesta sobre la pantalla. Reutilizable.
function TelefonoReal({ className = '', screen = '/hero/screen-hoy.webp', alt = 'La app del Método Proteína Primero en el teléfono', shadow = 'drop-shadow(0 24px 32px rgba(0,0,0,0.42))' }: {
  className?: string; screen?: string; alt?: string; shadow?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '1536 / 2048' }}>
      <img
        src="/hero/phone-real.png"
        alt={alt}
        className="relative z-0 w-full block select-none pointer-events-none"
        style={{ filter: shadow }}
      />
      <div
        className="absolute z-10 overflow-hidden"
        style={{ left: '26.82%', top: '11.04%', width: '46.35%', height: '73.93%', borderRadius: '9% / 6%' }}
      >
        <img src={screen} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
    </div>
  );
}

function MockupDispositivos() {
  return <TelefonoReal className="mx-auto w-full max-w-[290px]" alt="La app del Método Proteína Primero abierta en el teléfono" />;
}

/* Navegación de pasos numéricos del quiz */
function QuizNav({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-[#9E998C] hover:text-[#F3EFE7] px-3 py-2">Atrás</button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 bg-brand-green hover:bg-brand-green-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        Continuar <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* Quiz de plan personalizado — el funnel del competidor, pero termina en la oferta.
   Calcula calorías y proteína (Mifflin-St Jeor) con los datos del visitante y lo lleva al checkout. */
function PlanQuiz({ open, onClose, onCheckout }: {
  open: boolean;
  onClose: () => void;
  onCheckout: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [unidadPeso, setUnidadPeso] = useState<'kg' | 'lb'>('kg');
  const [d, setD] = useState<Partial<{
    sexo: 'mujer' | 'hombre'; edad: number; peso: number; altura: number;
    med: string; objetivo: 'perder' | 'muscular' | 'mantener'; problema: string;
  }>>({});

  useEffect(() => { if (open) { setStep(0); setD({}); setUnidadPeso('kg'); } }, [open]);

  useEffect(() => {
    if (open && step === 6 && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'Quiz Plan GLP-1' });
    }
  }, [open, step]);

  if (!open) return null;

  const TOTAL = 6;
  const set = (patch: Partial<typeof d>) => setD((p) => ({ ...p, ...patch }));
  const pick = (patch: Partial<typeof d>) => { set(patch); window.setTimeout(() => setStep((s) => s + 1), reduce ? 0 : 160); };
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const pesoKg = (d.peso || 0) * (unidadPeso === 'lb' ? 0.453592 : 1);
  const altura = d.altura || 0, edad = d.edad || 0;
  const bmr = d.sexo === 'hombre'
    ? 10 * pesoKg + 6.25 * altura - 5 * edad + 5
    : 10 * pesoKg + 6.25 * altura - 5 * edad - 161;
  const tdee = bmr * 1.375;
  const kcalRaw = d.objetivo === 'perder' ? tdee - 500 : d.objetivo === 'muscular' ? tdee - 250 : tdee;
  const kcal = Math.max(1200, Math.round(kcalRaw / 10) * 10);
  const prot = Math.round((pesoKg * 1.85) / 5) * 5;

  const numOk = (v: number | undefined, min: number, max: number) => typeof v === 'number' && v >= min && v <= max;

  const problemaLinea: Record<string, string> = {
    nauseas: 'Priorizamos recetas suaves y anti-náusea para tus días más sensibles.',
    comer: 'Cada día te decimos exactamente qué comer, sin que tengas que pensarlo.',
    musculo: 'Ajustamos tu proteína para que pierdas grasa, no músculo.',
    rebote: 'Incluye el plan de salida de 12 semanas para que no recuperes el peso.',
  };

  const Opt: React.FC<{ label: string; sub?: string; onClick: () => void; active?: boolean }> = ({ label, sub, onClick, active }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${active ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green' : 'border-[#2E2E33] hover:border-brand-green/60 hover:bg-brand-green/[0.03]'}`}
    >
      <span className="font-semibold text-[#F3EFE7] text-[15px]">{label}</span>
      {sub && <span className="block text-xs text-[#9E998C] mt-0.5">{sub}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-neutral-dark/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-md bg-[#1A1A1C] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#242428] shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green text-white p-1 rounded-md"><Activity className="h-4 w-4 text-brand-gold" /></div>
            <span className="font-bold text-sm text-[#F3EFE7]">Tu protocolo personalizado</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-[#7E7A6E] hover:text-[#D8D2C4] p-1"><X className="h-5 w-5" /></button>
        </div>

        {step < TOTAL && (
          <div className="h-1 bg-[#1E1E22] shrink-0">
            <div className="h-full bg-brand-green transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">Empecemos. ¿Cuál es tu sexo biológico?</h3>
              <p className="text-sm text-[#9E998C] !mt-1 mb-1">Lo usamos para calcular tus calorías y proteína con precisión.</p>
              <Opt label="Mujer" active={d.sexo === 'mujer'} onClick={() => pick({ sexo: 'mujer' })} />
              <Opt label="Hombre" active={d.sexo === 'hombre'} onClick={() => pick({ sexo: 'hombre' })} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">¿Qué edad tienes?</h3>
              <input
                type="number" inputMode="numeric" placeholder="Ej. 42" value={d.edad ?? ''}
                onChange={(e) => set({ edad: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-full rounded-xl border border-[#2E2E33] px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
              />
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.edad, 16, 90)} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">Tu peso y estatura actuales</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#B7B1A3]">Unidad de peso:</span>
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnidadPeso(u)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${unidadPeso === u ? 'border-brand-gold bg-brand-gold/15 text-brand-gold' : 'border-[#2E2E33] text-[#9E998C] hover:border-brand-gold/50'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium text-[#B7B1A3] block">Peso ({unidadPeso})
                  <input
                    type="number" inputMode="numeric" placeholder={unidadPeso === 'kg' ? '80' : '176'} value={d.peso ?? ''}
                    onChange={(e) => set({ peso: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#2E2E33] px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-[#B7B1A3] block">Estatura (cm)
                  <input
                    type="number" inputMode="numeric" placeholder="165" value={d.altura ?? ''}
                    onChange={(e) => set({ altura: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#2E2E33] px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </label>
              </div>
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.peso, unidadPeso === 'kg' ? 40 : 88, unidadPeso === 'kg' ? 250 : 550) || !numOk(d.altura, 120, 220)} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">¿Usas algún medicamento GLP-1?</h3>
              <p className="text-sm text-[#9E998C] !mt-1 mb-1">Si usas uno, la app activa el modo GLP-1 y adapta tu plan.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {['Ozempic', 'Mounjaro', 'Wegovy', 'Rybelsus', 'Zepbound', 'No uso medicación'].map((m) => (
                  <Opt key={m} label={m} active={d.med === m} onClick={() => pick({ med: m })} />
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">¿Cuál es tu objetivo principal?</h3>
              <Opt label="Perder grasa" sub="Bajar de peso de forma sostenida" active={d.objetivo === 'perder'} onClick={() => pick({ objetivo: 'perder' })} />
              <Opt label="Ganar músculo" sub="Subir masa o proteger tu tono al adelgazar" active={d.objetivo === 'muscular'} onClick={() => pick({ objetivo: 'muscular' })} />
              <Opt label="Mantener y comer mejor" sub="Estabilizar tu peso con hábitos reales" active={d.objetivo === 'mantener'} onClick={() => pick({ objetivo: 'mantener' })} />
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7]">¿Qué es lo que más te cuesta hoy?</h3>
              <Opt label="No sé qué comer" active={d.problema === 'comer'} onClick={() => pick({ problema: 'comer' })} />
              <Opt label="Miedo a perder músculo" active={d.problema === 'musculo'} onClick={() => pick({ problema: 'musculo' })} />
              <Opt label="Miedo al efecto rebote" active={d.problema === 'rebote'} onClick={() => pick({ problema: 'rebote' })} />
              <Opt label="Náuseas o poco apetito" active={d.problema === 'nauseas'} onClick={() => pick({ problema: 'nauseas' })} />
            </div>
          )}
          {step === 6 && (
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 rounded-full px-3 py-1 mb-3"><CheckCircle2 className="h-3.5 w-3.5" /> Plan listo</span>
              <h3 className="font-display text-2xl font-bold text-[#F3EFE7] mb-1">Tu protocolo está listo</h3>
              <p className="text-sm text-[#9E998C] mb-4">Calculado con tus datos{d.med && d.med !== 'No uso medicación' ? ` y tu tratamiento con ${d.med}` : ' y tu objetivo'}.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl bg-brand-green/5 border border-brand-green/15 p-4">
                  <div className="text-3xl font-black text-brand-gold tabular-nums">{kcal}</div>
                  <div className="text-[11px] font-semibold text-[#9E998C] uppercase tracking-wide">kcal / día</div>
                </div>
                <div className="rounded-2xl bg-brand-green/5 border border-brand-green/15 p-4">
                  <div className="text-3xl font-black text-brand-gold tabular-nums">{prot} g</div>
                  <div className="text-[11px] font-semibold text-[#9E998C] uppercase tracking-wide">proteína / día</div>
                </div>
              </div>
              {d.problema && <p className="text-sm text-[#B7B1A3] leading-relaxed mb-1">{problemaLinea[d.problema]}</p>}
              <p className="text-sm text-[#B7B1A3] leading-relaxed mb-5">Dentro de la app tienes tu menú día a día con estos números, <strong className="text-[#F3EFE7]">35 recetas altas en proteína</strong>{d.med && d.med !== 'No uso medicación' ? ' y la guía de tu medicamento' : ' y tus macros de cada día'}.</p>
              <a
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={onCheckout}
                className="animate-pulse-green w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold text-center text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Desbloquear mi plan completo — US$ 9.90 <ArrowRight className="h-5 w-5" />
              </a>
              <p className="text-[11px] text-[#7E7A6E] mt-2.5 flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-brand-gold" /> Acceso inmediato</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-brand-gold" /> 7 días de garantía</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Guia GLP-1 Inteligente',
        value: 9.9,
        currency: 'USD',
      });
    }
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const triggerCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let targetUrl = e.currentTarget.href || 'https://pay.hotmart.com/O106207568V?checkoutMode=10';
    
    if (typeof window !== 'undefined' && window.location.search) {
      const currentSearchParams = new URLSearchParams(window.location.search);
      if (currentSearchParams.toString()) {
        try {
          const parsedUrl = new URL(targetUrl);
          currentSearchParams.forEach((value, key) => {
            if (!parsedUrl.searchParams.has(key)) {
              parsedUrl.searchParams.set(key, value);
            }
          });
          targetUrl = parsedUrl.toString();
        } catch (err) {
          console.error("Error parsing target URL:", err);
        }
      }
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Guia GLP-1 Inteligente',
        value: 9.9,
        currency: 'USD',
      });
    }

    window.location.href = targetUrl;
  };

  return (
    <div className="min-h-screen bg-premium-wellness text-[#F3EFE7] font-sans selection:bg-brand-gold/10 selection:text-brand-gold overflow-x-hidden antialiased">

      <PlanQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onCheckout={triggerCheckout} />

      <div className="bg-[#0E0E10] text-[#F3EFE7] text-xs font-semibold tracking-wider text-center py-2 px-4 border-b border-brand-gold/15 flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-gold" />
        <span className="uppercase font-sans tracking-[0.14em] text-[10px] md:text-xs whitespace-nowrap">
          Dieta · Gym · Usuarios GLP-1 (Ozempic, Wegovy…)
        </span>
      </div>

      <header className="border-b border-white/10 py-4 px-6 sticky top-0 bg-[#141416]/95 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#1E1E22] ring-1 ring-brand-gold/30 p-1.5 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-[#F3EFE7]">Método Proteína Primero</span>
              <span className="text-xs text-brand-gold font-semibold block -mt-1">Nutrición inteligente · 21 días</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="text-[#1A1712] bg-brand-gold hover:bg-[#c9a233] text-sm font-bold px-4 min-h-[44px] rounded-lg transition-all duration-200 hover:scale-105 shadow-sm shadow-black/30 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gold"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
      </header>

      <section className="relative pt-0 pb-20 px-6 overflow-hidden bg-gradient-to-br from-[#0B0B0C] via-[#141416] to-[#1A1712]">
        
        <div className="bg-black/15 border-b border-brand-gold/20 py-3 px-4 mb-8 -mx-6 text-center">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-xs md:text-sm">
            <span className="h-px w-6 bg-brand-gold/50 hidden sm:block" aria-hidden="true" />
            <span className="select-none flex items-center gap-2.5 flex-wrap justify-center text-[#E7E1D3]/85 font-medium tracking-wide">
              <span className="uppercase text-[10px] md:text-xs tracking-[0.22em] text-brand-gold/90 font-semibold">Precio de lanzamiento</span>
              <span className="text-brand-gold tabular-nums text-sm md:text-base font-semibold">
                US$&nbsp;9.90 <span className="text-white/45 line-through ml-1 font-normal">US$&nbsp;19.90</span>
              </span>
            </span>
            <span className="h-px w-6 bg-brand-gold/50 hidden sm:block" aria-hidden="true" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <p className="text-base md:text-lg text-[#C4BEB0]/80 mb-4 font-medium tracking-wide italic max-w-2xl">
                Mientras otros adivinan qué comer y abandonan en la primera semana…
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.12] mb-6">
                El <span className="text-brand-gold">Método Proteína Primero</span>: el plan que te dice exactamente qué comer para lograr tu objetivo.
              </h1>

              <p className="text-lg md:text-xl text-[#F3EFE7] font-normal leading-relaxed mb-6 max-w-2xl">
                No es una dieta más. Es un <strong className="text-brand-gold">protocolo de 21 días</strong> con tu menú diario —calorías, proteína y macros calculados para ti— para perder grasa sin perder músculo, ganar masa o simplemente comer mejor. ¿Usas Ozempic, Wegovy o Mounjaro? La app incluye un <strong className="text-brand-gold">modo GLP-1</strong> que se adapta a tu tratamiento.
              </p>

              <div className="mb-6 flex items-center gap-2 flex-wrap justify-center lg:justify-start text-xs text-[#E7E1D3] font-semibold">
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">🔥 Perder peso</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">💪 Ganar músculo</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">❤️ Comer más saludable</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">💉 Modo GLP-1</span>
                <span className="bg-brand-gold/15 border border-brand-gold/40 text-brand-gold rounded-full px-3 py-1.5">Precio de lanzamiento</span>
              </div>

              <div className="w-full sm:max-w-md">
                <button
                  id="hero-cta-btn"
                  type="button"
                  onClick={() => setQuizOpen(true)}
                  className="group w-full bg-gradient-to-b from-[#E4C35A] to-[#C9A233] hover:to-[#b8922c] text-[#17140C] font-bold text-center text-lg md:text-xl py-5 px-8 rounded-2xl shadow-[0_10px_30px_-8px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 shrink-0" />
                    Descubre tu protocolo — gratis
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </span>
                </button>
                <p className="text-center text-[11px] text-[#C4BEB0]/80 mt-2">6 preguntas · 60 segundos · sin tarjeta · resultado al instante</p>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                    onClick={triggerCheckout}
                    className="group w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-brand-gold/60 bg-brand-gold/10 hover:bg-brand-gold/20 text-white font-bold text-base md:text-lg py-4 px-6 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                  >
                    Empezar mi protocolo — US$ 9.90
                    <ArrowRight className="h-5 w-5 text-brand-gold group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-6 mt-3 text-xs text-[#C4BEB0] font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-brand-gold stroke-[3px]" /> Acceso inmediato
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-brand-gold" /> Pago 100% seguro
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-brand-gold" /> 7 Días de Garantía
                  </span>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 blur-3xl opacity-70 -z-10 scale-90" />

                <MockupDispositivos />

                <div className="mt-6 text-center">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-brand-gold/30">
                    <Check className="h-3 w-3" /> App completa + Biblioteca de 4 Guías
                  </span>
                  <p className="text-xs text-[#E7E1D3]/70 font-medium mt-2">Tu plan del día, siempre en tu bolsillo</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <FadeIn>
      <section className="py-14 px-6 bg-[#0E0E10] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow tone="dark">El problema que nadie te contó</Eyebrow>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-display text-white tracking-tight leading-[1.1] mb-4">
              El esfuerzo lo pones tú.<br className="hidden md:block" /> Estos 3 problemas los resuelve un método — o nadie.
            </h2>
            <p className="text-[#C4BEB0]/70 text-base max-w-xl mx-auto">
              No es falta de disciplina. Es que te dijeron cuánto bajar — pero nadie te enseñó cómo comer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <Thermometer className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">No sabes qué comer — y adivinar agota</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Mil dietas que se contradicen, apps que solo cuentan calorías y ningún plan concreto. "Come menos" no es un método. Y si usas GLP-1, comer lo incorrecto además significa náuseas, reflujo y días perdidos.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Pérdida de músculo silenciosa</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Al comer menos —por dieta o porque el medicamento apaga tu apetito— la proteína es lo primero que falta. Bajas de peso en la báscula, pero pierdes el músculo que te mantiene firme, fuerte y con energía.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <RotateCcw className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">El efecto rebote que borra tu progreso</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                El 80% de las personas que bajan de peso —con dieta o al dejar el GLP-1— lo recuperan en menos de 12 meses. Sin hábitos reales y un metabolismo protegido, el rebote no es una posibilidad: es casi una certeza.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <p className="text-white/80 text-base font-semibold mb-2">
              Estos 3 problemas tienen una causa en común:
            </p>
            <p className="text-brand-gold font-bold text-xl md:text-2xl font-display mb-4">
              Nadie te dijo exactamente qué comer para tu objetivo.
            </p>
            <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
              Inviertes en gimnasio, suplementos — o hasta <strong className="text-white">US$ 1,200 al mes</strong> si usas GLP-1. Este sistema cuesta <strong className="text-brand-gold">menos del 1% de eso</strong> — y es la parte que hace que todo lo demás funcione.
            </p>

            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold py-3.5 px-8 rounded-xl transition-all duration-200 cursor-pointer text-sm shadow-lg shadow-brand-green-vibrant/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <span>Empezar mi protocolo — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      {/* Lo que recibes hoy — respuesta inmediata a "¿qué estoy comprando?" */}
      <FadeIn>
      <section className="py-16 px-6 bg-[#141416] border-b border-[#2A2A2E]/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow>Acceso inmediato tras la compra</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#F3EFE7] mb-2">
              Esto es lo que recibes hoy
            </h2>
            <p className="text-[#9E998C]">Todo junto, en un solo acceso — sin esperas y sin envíos.</p>
          </div>

          {/* Producto principal: la app, presentada como el héroe del entregable */}
          <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-gradient-to-br from-[#1E1B15] via-brand-green to-[#1A1712] ring-1 ring-brand-gold/30 shadow-[0_20px_50px_-24px_rgba(13,51,32,0.7)]">
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative flex items-center gap-4 md:gap-6">
              {/* teléfono fotorrealista con la pantalla real */}
              <TelefonoReal className="shrink-0 w-[88px] md:w-[112px]" shadow="drop-shadow(0 12px 18px rgba(0,0,0,0.45))" alt="Pantalla Hoy de la app del Reto de 21 días" />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-brand-gold bg-white/10 border border-brand-gold/30 rounded-full px-2.5 py-1 mb-2">
                  <Smartphone className="h-3 w-3" /> Producto principal · App
                </span>
                <h3 className="text-white font-bold font-display text-xl md:text-2xl leading-tight">App del Reto de 21 días</h3>
                <p className="text-[#E7E1D3]/90 text-sm md:text-base leading-snug mt-1">
                  Tu plan día a día con menús inteligentes por calorías, proteína y macros, IMC y estadísticas de tu progreso — con modo GLP-1 y guía de medicamentos si los usas.
                </p>
              </div>
              <AppSeal size={72} rotate={-6} className="hidden md:block -mr-1" />
            </div>
          </div>

          {/* Lo que viene incluido dentro de la app — sección única de entregables */}
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold/80 mt-8 mb-3 text-center">
            Y todo esto, incluido dentro de la app
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
            {[
              { t: 'Guía nutricional completa', s: 'El método entero, capítulo por capítulo' },
              { t: '35 recetas altas en proteína', s: 'Con los macros de cada plato ya calculados — incluye opciones suaves anti-náusea' },
              { t: 'Lista de compras inteligente', s: 'Qué sí llevar y qué evitar en el súper' },
              { t: 'Plan de salida anti-rebote', s: '12 semanas para no recuperar el peso' },
              { t: 'Diario alimentario', s: 'Registra cómo te sientes y descubre tus patrones' },
              { t: 'Actualizaciones futuras', s: 'Nuevas recetas y mejoras, sin costo extra' },
            ].map((it) => (
              <div key={it.t} className="flex items-start gap-3 py-3 border-b border-[#2A2A2E]/70">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-brand-gold/10 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-brand-gold stroke-[3px]" />
                </span>
                <div>
                  <p className="font-bold text-[#F3EFE7] text-[15px] leading-tight">{it.t}</p>
                  <p className="text-sm text-[#B7B1A3] leading-snug">{it.s}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#9E998C] mt-5 flex items-center justify-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-brand-gold shrink-0" />
            Las 4 guías también las descargas en PDF, para leer o imprimir cuando quieras.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-brand-green-vibrant/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green-vibrant/30"
            >
              Empezar mi protocolo — US$ 9.90 <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-xs text-[#7E7A6E] mt-3 flex items-center justify-center gap-4">
              <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-brand-gold" /> Pago 100% seguro</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-brand-gold" /> 7 días de garantía</span>
            </p>
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <div className="border-y border-[#2A2A2E] bg-[#141416] py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 divide-x divide-[#242428]">
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-gold tabular-nums">4</p>
            <p className="text-xs text-[#B7B1A3] mt-1 leading-snug">módulos completos<br className="hidden md:block" /> con acceso inmediato</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-[#F3EFE7] tabular-nums">35</p>
            <p className="text-xs text-[#B7B1A3] mt-1 leading-snug">recetas altas en proteína<br className="hidden md:block" /> con macros calculados</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-gold tabular-nums">12</p>
            <p className="text-xs text-[#B7B1A3] mt-1 leading-snug">semanas de plan anti-rebote<br className="hidden md:block" /> para mantener tu resultado</p>
          </div>
        </div>
      </div>
      </FadeIn>

      <FadeIn>
      <section className="py-14 px-6 bg-[#141416]">
        <div className="max-w-6xl mx-auto rounded-3xl p-8 md:p-12 bg-[#1A1A1C] border border-[#2A2A2E]/70 shadow-[0_1px_40px_-12px_rgba(22,101,52,0.12)]">

          <div className="text-center mb-10">
            <Eyebrow>Tu reto, guiado día a día</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#F3EFE7] mb-4">
              Tu Reto de 21 días vive en una app
            </h2>
            <p className="text-[#B7B1A3] text-lg leading-relaxed max-w-2xl mx-auto">
              Es tu nutricionista digital de bolsillo: genera tu menú con calorías, proteína y macros ya calculados, se adapta a tu objetivo —perder, ganar músculo o mantener— y avanzas día a día.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-10">

            {/* Qué hace la app */}
            <div>
              <ul className="space-y-4">
                {[
                  ['Plan alimentario inteligente', 'Con tu peso, altura y objetivo genera tu día completo — calorías, proteína, carbohidratos y grasas ya calculados. Cambias cualquier plato con un toque.'],
                  ['El menú de hoy y 35 recetas a un toque', 'Sabes exactamente qué comer, con la proteína de cada plato lista — sin pensarlo ni pesar nada.'],
                  ['Elige tu objetivo y la app se ajusta', 'Perder peso, ganar músculo, mantener o comer más saludable — tus metas de proteína y calorías se recalculan solas.'],
                  ['Estadísticas de todo tu progreso', 'Peso, IMC, cintura, agua, proteína, macros y energía — en gráficos claros que puedes llevar a tu médico o nutricionista.'],
                  ['Modo GLP-1 (si lo usas)', '¿Ozempic, Wegovy, Mounjaro, Zepbound o Rybelsus? Actívalo y tienes la guía de tu medicamento, tu día de dosis y registro de síntomas.'],
                  ['Plan de salida de 12 semanas', 'Consolida tu resultado y evita el efecto rebote al terminar el reto o el tratamiento.'],
                  ['Funciona sin conexión y se instala en tu pantalla de inicio', 'Como una app normal — pero sin descargarla de ninguna tienda.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-green-vibrant/15 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#F3EFE7] text-base">{t}</h3>
                      <p className="text-sm text-[#B7B1A3] leading-relaxed">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-start gap-2 bg-[#141416] border border-[#33333A]/60 rounded-xl p-4">
                <Award className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-sm text-[#F3EFE7] leading-relaxed">
                  <strong>Empieza hoy mismo.</strong> En 2 minutos instalas la app en tu celular y ya estás en el Día 1 de tu reto — sin esperas ni envíos.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A2A2E] pt-8">
            <p className="text-center text-sm text-[#B7B1A3] flex items-center justify-center gap-2 max-w-xl mx-auto">
              <CheckCircle2 className="h-4 w-4 text-brand-gold shrink-0" />
              <span>Adentro también viven las <strong className="text-[#F3EFE7]">4 guías completas</strong>, y una guía paso a paso para instalar el app en tu celular en 2 minutos.</span>
            </p>
          </div>

          <div className="text-center mt-10">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Empezar mi protocolo — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>



      <FadeIn>
      <section className="py-14 px-6 bg-[#141416]/40 border-t border-[#2A2A2E]/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Resultados reales</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#F3EFE7] mb-4">
              Lo que dicen nuestras usuarias
            </h2>
            <p className="text-[#B7B1A3] text-sm leading-relaxed max-w-lg mx-auto">
              Personas reales que ya siguen el Método Proteína Primero — muchas combinándolo con su tratamiento GLP-1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2E2E33] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
              </div>
              <p className="text-sm text-[#B7B1A3] leading-relaxed mb-5 italic flex-1">
                "Llevaba semanas con náuseas terribles después de cada inyección. Mi médico me dijo 'es normal'. Con el recetario del kit entendí que estaba comiendo exactamente los alimentos que empeoran el malestar. <strong className="text-[#F3EFE7]">En 10 días las náuseas casi desaparecieron. Bajé 9 kilos y por primera vez estoy disfrutando el proceso.</strong>"
              </p>
              <div className="flex items-center gap-3 border-t border-[#242428] pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-[#2A2416] border-2 border-brand-gold/40 flex items-center justify-center text-[11px] font-bold text-brand-gold">VM</div>
                <div>
                  <p className="text-xs font-bold text-[#F3EFE7]">Valentina M.</p>
                  <p className="text-[10px] text-[#7E7A6E]">Monterrey, México · Ozempic 1mg</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2E2E33] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
              </div>
              <p className="text-sm text-[#B7B1A3] leading-relaxed mb-5 italic flex-1">
                "Mi médica me recetó Wegovy y me dijo 'come menos'. Eso fue todo. No saber qué comer me generaba una ansiedad enorme. Con la guía de alimentación entendí la estructura exacta de mi plato. <strong className="text-[#F3EFE7]">Sin adivinar. Sin ansiedad. En 2 meses bajé 11 kg y mi piel sigue firme.</strong>"
              </p>
              <div className="flex items-center gap-3 border-t border-[#242428] pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-[#2A2416] border-2 border-brand-gold/40 flex items-center justify-center text-[11px] font-bold text-brand-gold">CB</div>
                <div>
                  <p className="text-xs font-bold text-[#F3EFE7]">Carolina B.</p>
                  <p className="text-[10px] text-[#7E7A6E]">Buenos Aires, Argentina · Wegovy</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2E2E33] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(4)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
                <Star className="h-4 w-4 text-[#C4BEB0] fill-current" />
              </div>
              <p className="text-sm text-[#B7B1A3] leading-relaxed mb-5 italic flex-1">
                "Me sentía sin energía todo el día — pensé que era el medicamento. En realidad era que comía muy poco y sin los nutrientes correctos. Con las recetas del kit empecé a comer bien aunque no tuviera hambre. <strong className="text-[#F3EFE7]">En 6 semanas recuperé la energía y perdí 7 kg de grasa.</strong> Le doy 4 estrellas porque me hubiera gustado más recetas de desayuno, pero el resto es excelente."
              </p>
              <div className="flex items-center gap-3 border-t border-[#242428] pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-[#2A2416] border-2 border-brand-gold/40 flex items-center justify-center text-[11px] font-bold text-brand-gold">DR</div>
                <div>
                  <p className="text-xs font-bold text-[#F3EFE7]">Daniela R.</p>
                  <p className="text-[10px] text-[#7E7A6E]">Santiago, Chile · Mounjaro</p>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Quiero los mismos resultados — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-xs text-[#9E998C] mt-3">4 módulos · 35 recetas · Garantía 7 días · Acceso inmediato</p>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-14 px-6 bg-[#141416]/30">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <Eyebrow>Oferta especial de lanzamiento</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#F3EFE7] mb-4">
              Tú pones el esfuerzo.<br className="hidden md:block" /> Este método pone el plan.
            </h2>
            <p className="text-[#B7B1A3] text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Inviertes en gimnasio, suplementos — o hasta $1,200 al mes si usas GLP-1. Sin el plan correcto sigues adivinando qué comer, perdiendo músculo y volviendo a empezar cada lunes. El Método Proteína Primero completa la ecuación que nadie te dio.
            </p>
          </div>

          <div className="frame-certificate rounded-2xl shadow-xl relative overflow-hidden max-w-lg mx-auto text-white bg-gradient-to-b from-[#242222] via-brand-green to-[#141210]">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-black/15 border-b border-brand-gold/20 text-center py-3.5 px-4 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-brand-gold/50" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-gold/90 flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5" /> Pack digital · Acceso inmediato
              </span>
              <span className="h-px w-6 bg-brand-gold/50" aria-hidden="true" />
            </div>

            <div className="relative p-8 md:p-10 text-center">
              <div className="flex flex-col items-center mb-2">
                <AppSeal size={64} rotate={0} className="mb-3" />
                <h3 className="font-extrabold text-brand-gold text-base uppercase tracking-widest">
                  Método Proteína Primero — Acceso Completo
                </h3>
              </div>

              <div className="space-y-3 mt-4 mb-6 text-left border-b border-white/10 pb-6 text-white/90">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tu app principal</p>
                <div className="flex items-center gap-3 text-xs bg-white/10 border border-brand-gold/30 rounded-xl px-3 py-3">
                  <span className="h-8 w-8 shrink-0 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-brand-gold" />
                  </span>
                  <span><strong className="text-white">App del Reto de 21 días</strong> — plan inteligente por calorías, proteína y macros, IMC, estadísticas y modo GLP-1 incluido <span className="text-white/50 font-medium">(Valor $39.90)</span></span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold pt-2">+ 4 Bonos gratis, dentro de la app</p>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Guía Médica de Estructuración de Platos <span className="text-white/50 font-medium">(Valor $19.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Recetario Anti-Náusea de Alta Proteína <span className="text-white/50 font-medium">(Valor $14.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Lista de Supermercado Inteligente <span className="text-white/50 font-medium">(Valor $9.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Diario de Síntomas y Progreso GLP-1 <span className="text-white/50 font-medium">(Valor $5.20)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Guía de instalación del app paso a paso <span className="text-brand-gold/80 font-medium">(Gratis)</span></span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-xs text-white/50 line-through tracking-wide">
                  Valor Total: US$ 89.90
                </span>
                <div className="flex items-baseline justify-center gap-1.5 mt-1">
                  <span className="text-3xl text-brand-gold font-bold align-super">US$</span>
                  <span className="text-6xl md:text-7xl font-black text-white tracking-tight glow-gold tabular-nums">
                    9.90
                  </span>
                </div>
                <span className="text-sm font-semibold text-white/70 mt-1">Acceso completo</span>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mt-2 bg-white/5 border border-brand-gold/20 px-3 py-1 rounded-full">
                  Precio especial de lanzamiento
                </span>
              </div>

              <a
                id="oferta-cta-purchase-trigger"
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={triggerCheckout}
                className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] text-center font-bold py-5 px-6 rounded-2xl text-lg md:text-xl shadow-xl shadow-brand-green-vibrant/40 transition-all duration-300 transform hover:-translate-y-1 animate-pulse-green mb-4 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                <ShoppingCart className="h-5 w-5 text-white shrink-0" />
                <span>Quiero el protocolo completo</span>
              </a>

              <p className="text-xs text-[#E7E1D3]/80 leading-relaxed font-medium mb-6 flex items-center justify-center gap-1.5 max-w-sm mx-auto">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                Empieza hoy y llega a tu próxima comida con un plan exacto — desde el primer día.
              </p>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-center gap-2 mb-4 bg-white/5 border border-brand-gold/30 rounded-xl px-4 py-3 max-w-md mx-auto">
                  <Globe className="h-4 w-4 text-brand-gold shrink-0" />
                  <span className="text-[11px] md:text-xs font-semibold text-white/90 leading-snug text-left">
                    Paga en <strong className="text-brand-gold">tu moneda local</strong> — la conversión es automática en el checkout.
                  </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/40 mr-1"><Lock className="h-3 w-3" /> Pago seguro</span>
                  {['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL'].map((bandeira) => (
                    <span key={bandeira} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-white/75">{bandeira}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-16 px-6 bg-[#141416]/40 border-t border-[#2A2A2E]/50">
        <div className="max-w-4xl mx-auto bg-[#1A1A1C] border border-[#33333A]/40 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden">
          
          <div className="absolute right-0 top-0 h-40 w-40 bg-brand-gold/10 rounded-full blur-3xl -z-10" />

          <div className="shrink-0 relative group">
            <div className="absolute inset-x-0 h-28 w-28 bg-brand-gold/30 rounded-full blur-xl group-hover:bg-brand-gold/40 transition duration-300" />
            <div className="h-28 w-28 rounded-full border-4 border-brand-gold bg-[#1A1A1C] relative z-10 flex flex-col items-center justify-center text-center p-2 shadow-xl animate-pulse-gold">
              <Award className="h-10 w-10 text-brand-gold mb-1" />
              <span className="text-[10px] font-black leading-none text-brand-gold-dark tracking-wide uppercase">100% GARANTIZADO</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-bold font-display text-[#F3EFE7] text-xl md:text-2xl mb-3">
              Garantía "Léelo Todo" — 7 días, sin preguntas.
            </h3>
            <p className="text-sm text-[#B7B1A3] leading-relaxed">
              Descarga los 4 módulos, prueba 3 recetas y sigue el protocolo durante una semana. Si al final de los 7 días no sientes diferencia, escribe un correo y te devolvemos el 100% — sin preguntas, sin formularios, sin esperas. Todo el riesgo lo tomamos nosotros.
            </p>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-14 px-6 bg-[#0E0E10] border-t border-white/5">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3 inline-block">
              ¿Tienes Dudas?
            </span>
            <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-[#C4BEB0]/70 text-sm leading-relaxed max-w-lg mx-auto">
              Todo lo que necesitas saber antes de asegurar tu acceso al Método Proteína Primero.
            </p>
          </div>

          <div className="space-y-4">

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(6)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  No uso Ozempic ni ningún medicamento. ¿El método sirve para mí?
                </span>
                {activeFaq === 6 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 6 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed">
                      <p>
                        Sí, completamente. El corazón del método es la nutrición proteína-primero: tu menú diario con calorías, proteína y macros calculados para tu objetivo — perder grasa, ganar músculo, mantener tu peso o simplemente comer más saludable. En la app eliges tu objetivo y todo se ajusta a ti. El modo GLP-1 es solo una función opcional para quienes usan esos medicamentos; si no los usas, nunca lo verás.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  Tengo muchas náuseas con el medicamento. ¿Esta guía puede ayudarme a reducirlas?
                </span>
                {activeFaq === 1 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {activeFaq === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed space-y-2">
                      <p>
                        Sí — y es uno de los problemas más frecuentes que resuelve el método. La mayoría de las náuseas con GLP-1 no son inevitables: son el resultado de comer los alimentos incorrectos en el momento incorrecto. El recetario anti-náuseas del método incluye qué comer antes de la inyección, qué evitar las primeras 24 horas y qué texturas tolera mejor el estómago durante el tratamiento. Las usuarias que aplican este protocolo reportan una reducción notable del malestar en los primeros 7-10 días.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  Pagué, ¿y ahora qué? ¿Cuánto tiempo hasta que puedo usarlo?
                </span>
                {activeFaq === 2 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed">
                      <p>
                        Inmediatamente. En el momento en que se confirma tu pago, Hotmart te envía un correo con el acceso al app del Reto y a los 4 PDFs. El app no se descarga de ninguna tienda: se abre desde tu navegador y se instala en la pantalla de inicio en 2 minutos — incluimos una guía paso a paso para hacerlo. En menos de 3 minutos ya estás en el Día 1 del Reto.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(3)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  No sé absolutamente nada de nutrición. ¿Este método es para mí o necesito conocimientos previos?
                </span>
                {activeFaq === 3 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed">
                      <p>
                        Es exactamente para ti. El método fue diseñado asumiendo que nadie te explicó nada — porque eso es lo que le pasa a la gran mayoría de las personas que intentan cambiar su alimentación. La Guía de Alimentación usa lenguaje claro, con ejemplos visuales de platos y porciones, y la app calcula las calorías y los macros por ti. Solo instrucciones concretas: qué comer, cuánto, cuándo. Si sabes agarrar un tenedor, puedes aplicar este protocolo desde el primer día.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(5)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  ¿Esto no lo encuentro gratis en Google?
                </span>
                {activeFaq === 5 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 5 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed">
                      <p>
                        La información suelta, sí. Lo que no encontrarás gratis es el sistema: tu menú exacto según tu objetivo, 35 recetas con la proteína ya calculada, la lista de compras inteligente, el plan de 12 semanas para mantener el resultado — y si usas GLP-1, qué comer exactamente el día de la inyección. Todo organizado, verificado y en un solo lugar. Pagas por no tener que armar el rompecabezas tú misma, con tu salud, entre miles de artículos que se contradicen.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleFaq(4)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-transparent hover:bg-white/5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold transition-colors duration-150"
              >
                <span className="font-bold text-white text-sm md:text-base pr-4">
                  El precio está en dólares. ¿Puedo pagar en la moneda de mi país?
                </span>
                {activeFaq === 4 ? (
                  <ChevronUp className="h-5 w-5 text-brand-gold shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/40 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 4 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-5 md:p-6 bg-white/5 text-xs md:text-sm text-white/70 leading-relaxed">
                      <p>
                        Sí. Aunque el valor se muestra en dólares (US$) para mantener un precio único en todos los países, el checkout detecta automáticamente tu ubicación y te permite pagar en tu moneda local con la conversión del día. Puedes usar tarjeta de crédito o débito, y según tu país también aparecen métodos locales como Mercado Pago, transferencia bancaria o pago en efectivo. No necesitas hacer ninguna conversión manual: el sistema te muestra el monto exacto a pagar en tu moneda antes de confirmar.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          <div className="text-center mt-12">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-[#17140C] font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Empezar mi protocolo — US$ 9.90</span>
            </a>
            <p className="text-xs text-white/40 mt-3">Acceso inmediato · Garantía de 7 días · Empieza hoy</p>
          </div>

        </div>
      </section>
      </FadeIn>

      <footer className="bg-[#0E0E10] text-white/70 py-16 pb-32 md:pb-16 px-6 text-center border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-brand-gold" />
              <span className="font-bold tracking-tight text-xl text-white">Método Proteína Primero</span>
            </div>
            <p className="text-xs text-white/70">Nutrición clínica para un cambio real y duradero.</p>
          </div>

          <div className="flex justify-center flex-wrap gap-6 text-xs font-semibold">
            <button onClick={() => setActiveModal('terms')} className="text-white/70 hover:text-white hover:underline transition-colors duration-150 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Términos de Uso</button>
            <span className="text-white/30" aria-hidden="true">|</span>
            <button onClick={() => setActiveModal('privacy')} className="text-white/70 hover:text-white hover:underline transition-colors duration-150 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Políticas de Privacidad</button>
            <span className="text-white/30" aria-hidden="true">|</span>
            <a href="mailto:soporte@guiaglp1.com" className="text-white/70 hover:text-white hover:underline transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Contacto Soporte</a>
          </div>

          <div className="text-xs text-white/60 border-t border-white/10 pt-8">
            <p>© 2026 Método Proteína Primero. Todos los derechos reservados.</p>
          </div>

          <div className="max-w-4xl mx-auto text-xs leading-relaxed text-white/75 bg-white/5 p-5 rounded-2xl border border-white/10 text-left">
            <strong className="text-white">Aviso de Exención de Responsabilidad Médica Obligatoria:</strong> Este producto no sustituye de ninguna manera el consejo, diagnóstico o tratamiento médico profesional del paciente. Siempre asesórese de forma presencial con su médico de cabecera especializado en endocrinología o medicina metabólica antes de iniciar cambios nutricionales drásticos o ajustes de dosis en fármacos inyectables como Ozempic®, Wegovy®, Mounjaro® u otros análogos. No retarde ni descuide el acompañamiento integral de su nutricionista clínico por la lectura de material digital complementario. Las marcas registradas mencionadas son propiedad de sus respectivos dueños exclusivos y se utilizan con meros fines de identificación orientadores.
          </div>
        </div>
      </footer>

      {/* Botón fijo mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#111113]/92 backdrop-blur-md border-t border-brand-gold/25 px-3 pt-3 pb-2 shadow-[0_-12px_32px_rgba(0,0,0,0.5)]">
        <a
          href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
          onClick={triggerCheckout}
          className="w-full bg-gradient-to-b from-[#E4C35A] to-[#C9A233] hover:to-[#b8922c] text-[#17140C] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/25 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113] focus-visible:ring-brand-gold"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Empezar mi protocolo — US$ 9.90</span>
          <Lock className="h-3.5 w-3.5 opacity-70" />
        </a>
        <p className="text-center text-[10px] text-[#C4BEB0] font-medium mt-1.5 flex items-center justify-center gap-1">
          <Globe className="h-3 w-3 text-brand-gold shrink-0" aria-hidden="true" />
          Pagas en tu moneda local · Garantía de 7 días
        </p>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-[#1A1A1C] rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative block overflow-y-auto max-h-[85vh] border border-[#242428]">
              <button onClick={() => setActiveModal(null)} aria-label="Cerrar ventana" className="absolute top-4 right-4 bg-[#1E1E22] rounded-full p-1.5 hover:bg-[#26262A] text-[#9E998C] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green">
                <XCloseIcon className="h-5 w-5" />
              </button>
              {activeModal === 'terms' ? (
                <div>
                  <h3 className="text-xl font-bold text-[#F3EFE7] mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-gold" /> Terminos y Condiciones de Uso</h3>
                  <div className="space-y-4 text-xs text-[#B7B1A3] leading-relaxed text-justify">
                    <p>Bienvenido a Método Proteína Primero, comercializado con fines divulgativos de estilo de vida saludable.</p>
                    <p><strong>1. Propiedad Intelectual:</strong> Todo el material contenido en el producto está protegido por leyes de derechos de autor. Queda terminantemente prohibida su comercialización, reventa o redistribución no autorizada.</p>
                    <p><strong>2. Uso del Contenido:</strong> El material se vende como material educativo suplementario y no constituye un canal terapéutico presencial.</p>
                    <p><strong>3. Políticas de Envío:</strong> Los archivos PDF se entregan automáticamente por correo tras procesarse el pago de US$ 9.90.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-[#F3EFE7] mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-gold" /> Políticas de Privacidad y Consentimiento</h3>
                  <div className="space-y-4 text-xs text-[#B7B1A3] leading-relaxed text-justify">
                    <p>Su privacidad es nuestra máxima prioridad.</p>
                    <p><strong>1. Recopilación de Datos:</strong> Solo recopilamos su correo y nombre para el despacho del producto digital.</p>
                    <p><strong>2. Seguridad:</strong> No almacenamos números de tarjetas. Todas las operaciones pasan por gateways PCI-DSS.</p>
                    <p><strong>3. Cancelaciones:</strong> Puede solicitar la eliminación de sus datos en cualquier momento por email.</p>
                  </div>
                </div>
              )}
              <button onClick={() => setActiveModal(null)} className="w-full mt-6 bg-brand-green hover:bg-brand-green-hover text-white py-3 rounded-xl font-bold text-sm transition">Entendido, Cerrar Ventana</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function XCloseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}