import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  Utensils,
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
  HelpCircle,
  X,
  Globe,
  Thermometer,
  TrendingDown,
  ZapOff,
  RotateCcw,
  Smartphone,
  LineChart,
  Syringe
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
  const text = tone === 'green' ? 'text-brand-green' : 'text-brand-gold';
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
      <div className="absolute inset-[9px] rounded-full bg-gradient-to-b from-[#1c3d28] to-[#0A2016] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center px-1.5 ring-1 ring-black/20">
        <Smartphone className="h-4 w-4 text-brand-gold mb-1" strokeWidth={2.25} />
        <span className="text-[7.5px] font-black uppercase tracking-[0.1em] text-brand-gold leading-[1.15]">
          App<br />Completa
        </span>
      </div>
    </div>
  );
}

/* Mockup multi-dispositivo: notebook + tablet + teléfono con las pantallas reales de la app */
function MockupDispositivos() {
  // Teléfono fotorrealista con la pantalla real de la app compuesta sobre el área de la pantalla.
  return (
    <div className="relative mx-auto w-full max-w-[290px]" style={{ aspectRatio: '1536 / 2048' }}>
      {/* Marco fotorrealista del teléfono */}
      <img
        src="/hero/phone-real.png"
        alt="La app Guía GLP-1 abierta en el teléfono"
        className="relative z-0 w-full block select-none pointer-events-none"
        style={{ filter: 'drop-shadow(0 24px 32px rgba(0,0,0,0.42))' }}
      />
      {/* Pantalla real compuesta sobre el área de la pantalla */}
      <div
        className="absolute z-10 overflow-hidden"
        style={{ left: '26.82%', top: '11.04%', width: '46.35%', height: '73.93%', borderRadius: '9% / 6%' }}
      >
        <img src="/hero/screen-hoy.webp" alt="Pantalla de la app: tu plan del día" className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
    </div>
  );
}

/* Navegación de pasos numéricos del quiz */
function QuizNav({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-gray-800 px-3 py-2">Atrás</button>
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
  const [d, setD] = useState<Partial<{
    sexo: 'mujer' | 'hombre'; edad: number; peso: number; altura: number;
    med: string; objetivo: 'perder' | 'muscular' | 'mantener'; problema: string;
  }>>({});

  useEffect(() => { if (open) { setStep(0); setD({}); } }, [open]);

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

  const peso = d.peso || 0, altura = d.altura || 0, edad = d.edad || 0;
  const bmr = d.sexo === 'hombre'
    ? 10 * peso + 6.25 * altura - 5 * edad + 5
    : 10 * peso + 6.25 * altura - 5 * edad - 161;
  const tdee = bmr * 1.375;
  const kcalRaw = d.objetivo === 'perder' ? tdee - 500 : d.objetivo === 'muscular' ? tdee - 250 : tdee;
  const kcal = Math.max(1200, Math.round(kcalRaw / 10) * 10);
  const prot = Math.round((peso * 1.85) / 5) * 5;

  const numOk = (v: number | undefined, min: number, max: number) => typeof v === 'number' && v >= min && v <= max;

  const problemaLinea: Record<string, string> = {
    nauseas: 'Priorizamos recetas suaves y anti-náusea para tus días más sensibles.',
    comer: 'Cada día te decimos exactamente qué comer, sin que tengas que pensarlo.',
    musculo: 'Ajustamos tu proteína para que pierdas grasa, no músculo.',
    rebote: 'Incluye el plan de salida de 12 semanas para que no recuperes el peso.',
  };

  const Opt = ({ label, sub, onClick, active }: { label: string; sub?: string; onClick: () => void; active?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${active ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green' : 'border-gray-200 hover:border-brand-green/60 hover:bg-brand-green/[0.03]'}`}
    >
      <span className="font-semibold text-neutral-dark text-[15px]">{label}</span>
      {sub && <span className="block text-xs text-gray-500 mt-0.5">{sub}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-neutral-dark/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green text-white p-1 rounded-md"><Activity className="h-4 w-4 text-brand-gold" /></div>
            <span className="font-bold text-sm text-neutral-dark">Tu plan personalizado</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 p-1"><X className="h-5 w-5" /></button>
        </div>

        {step < TOTAL && (
          <div className="h-1 bg-gray-100 shrink-0">
            <div className="h-full bg-brand-green transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">Empecemos. ¿Cuál es tu sexo biológico?</h3>
              <p className="text-sm text-gray-500 !mt-1 mb-1">Lo usamos para calcular tus calorías y proteína con precisión.</p>
              <Opt label="Mujer" active={d.sexo === 'mujer'} onClick={() => pick({ sexo: 'mujer' })} />
              <Opt label="Hombre" active={d.sexo === 'hombre'} onClick={() => pick({ sexo: 'hombre' })} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">¿Qué edad tienes?</h3>
              <input
                type="number" inputMode="numeric" placeholder="Ej. 42" value={d.edad ?? ''}
                onChange={(e) => set({ edad: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
              />
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.edad, 16, 90)} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">Tu peso y estatura actuales</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium text-gray-600 block">Peso (kg)
                  <input
                    type="number" inputMode="numeric" placeholder="80" value={d.peso ?? ''}
                    onChange={(e) => set({ peso: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-gray-600 block">Estatura (cm)
                  <input
                    type="number" inputMode="numeric" placeholder="165" value={d.altura ?? ''}
                    onChange={(e) => set({ altura: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-lg focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none"
                  />
                </label>
              </div>
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.peso, 40, 250) || !numOk(d.altura, 120, 220)} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">¿Qué medicamento usas?</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {['Ozempic', 'Mounjaro', 'Wegovy', 'Rybelsus', 'Zepbound', 'Aún no empiezo'].map((m) => (
                  <Opt key={m} label={m} active={d.med === m} onClick={() => pick({ med: m })} />
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">¿Cuál es tu objetivo principal?</h3>
              <Opt label="Perder grasa" sub="Bajar de peso de forma sostenida" active={d.objetivo === 'perder'} onClick={() => pick({ objetivo: 'perder' })} />
              <Opt label="Cuidar mi músculo" sub="No perder tono mientras adelgazo" active={d.objetivo === 'muscular'} onClick={() => pick({ objetivo: 'muscular' })} />
              <Opt label="Mantener mi peso" sub="Estabilizar y comer mejor" active={d.objetivo === 'mantener'} onClick={() => pick({ objetivo: 'mantener' })} />
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-neutral-dark">¿Qué es lo que más te cuesta hoy?</h3>
              <Opt label="Las náuseas" active={d.problema === 'nauseas'} onClick={() => pick({ problema: 'nauseas' })} />
              <Opt label="No sé qué comer" active={d.problema === 'comer'} onClick={() => pick({ problema: 'comer' })} />
              <Opt label="Miedo a perder músculo" active={d.problema === 'musculo'} onClick={() => pick({ problema: 'musculo' })} />
              <Opt label="Miedo al efecto rebote" active={d.problema === 'rebote'} onClick={() => pick({ problema: 'rebote' })} />
            </div>
          )}
          {step === 6 && (
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 rounded-full px-3 py-1 mb-3"><CheckCircle2 className="h-3.5 w-3.5" /> Plan listo</span>
              <h3 className="font-display text-2xl font-bold text-neutral-dark mb-1">Tu plan personalizado está listo</h3>
              <p className="text-sm text-gray-500 mb-4">Calculado con tus datos{d.med && d.med !== 'Aún no empiezo' ? ` y tu tratamiento con ${d.med}` : ''}.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl bg-brand-green/5 border border-brand-green/15 p-4">
                  <div className="text-3xl font-black text-brand-green tabular-nums">{kcal}</div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">kcal / día</div>
                </div>
                <div className="rounded-2xl bg-brand-green/5 border border-brand-green/15 p-4">
                  <div className="text-3xl font-black text-brand-green tabular-nums">{prot} g</div>
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">proteína / día</div>
                </div>
              </div>
              {d.problema && <p className="text-sm text-gray-600 leading-relaxed mb-1">{problemaLinea[d.problema]}</p>}
              <p className="text-sm text-gray-600 leading-relaxed mb-5">Dentro de la app tienes tu menú día a día con estos números, <strong className="text-neutral-dark">35 recetas anti-náusea</strong> y la guía de tu medicamento.</p>
              <a
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={onCheckout}
                className="animate-pulse-green w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold text-center text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Desbloquear mi plan completo — US$ 9.90 <ArrowRight className="h-5 w-5" />
              </a>
              <p className="text-[11px] text-gray-400 mt-2.5 flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-brand-gold" /> Pago único, sin suscripción</span>
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
    <div className="min-h-screen bg-premium-wellness text-neutral-dark font-sans selection:bg-brand-green/10 selection:text-brand-green overflow-x-hidden antialiased">

      <PlanQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onCheckout={triggerCheckout} />

      <div className="bg-brand-green text-white text-xs font-semibold tracking-wider text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-gold" />
        <span className="uppercase font-sans tracking-widest text-[10px] md:text-xs">
          Guía nutricional completa para usuarios de Ozempic, Wegovy y Mounjaro — porque el medicamento solo no es suficiente
        </span>
      </div>

      <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green text-white p-1.5 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-neutral-dark">Guía GLP-1</span>
              <span className="text-xs text-brand-green font-semibold block -mt-1">Inteligente</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="text-white bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-sm font-bold px-4 min-h-[44px] rounded-lg transition-all duration-200 hover:scale-105 shadow-sm shadow-brand-green-vibrant/20 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
      </header>

      <section className="relative pt-0 pb-20 px-6 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-[#0D3320]">
        
        <div className="bg-black/15 border-b border-brand-gold/20 py-3 px-4 mb-8 -mx-6 text-center">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-xs md:text-sm">
            <span className="h-px w-6 bg-brand-gold/50 hidden sm:block" aria-hidden="true" />
            <span className="select-none flex items-center gap-2.5 flex-wrap justify-center text-green-100/85 font-medium tracking-wide">
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
              <p className="text-base md:text-lg text-green-200/80 mb-4 font-medium tracking-wide italic max-w-2xl">
                Mientras otros luchan con náuseas y no saben qué comer…
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.12] mb-6">
                Aprovecha al máximo tu tratamiento con <span className="text-brand-gold">Ozempic, Wegovy y Mounjaro</span>.
              </h1>

              <p className="text-lg md:text-xl text-green-50 font-normal leading-relaxed mb-6 max-w-2xl">
                Aprende <strong className="text-brand-gold">exactamente qué comer cada día</strong> — sin náuseas, sin perder músculo y sin efecto rebote. Solo abres la app y sigues el plan del día: un reto guiado de 21 días.
              </p>

              <div className="mb-6 flex items-center gap-2 flex-wrap justify-center lg:justify-start text-xs text-green-100 font-semibold">
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">Plan día a día · 21 días</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">Calorías y proteína a tu medida</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">Compatible con todos los GLP-1</span>
                <span className="bg-brand-gold/15 border border-brand-gold/40 text-brand-gold rounded-full px-3 py-1.5">Un solo pago · sin suscripción</span>
              </div>

              <div className="w-full sm:max-w-md">
                <a
                  id="hero-cta-btn"
                  href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                  onClick={triggerCheckout}
                  className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold text-center text-lg md:text-xl py-5 px-8 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl animate-pulse-green relative overflow-hidden flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Empezar mi Reto de 21 días — US$ 9.90
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </a>

                <div className="flex items-center justify-center gap-6 mt-3 text-xs text-green-200 font-medium">
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

                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuizOpen(true)}
                    className="group w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-brand-gold/60 bg-brand-gold/10 hover:bg-brand-gold/20 text-white font-bold text-base md:text-lg py-4 px-6 transition-colors"
                  >
                    <Sparkles className="h-5 w-5 text-brand-gold shrink-0" />
                    Arma tu plan personalizado — gratis
                    <ArrowRight className="h-5 w-5 text-brand-gold group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                  <p className="text-center text-[11px] text-green-200/70 mt-2">Test de 1 minuto · sin tarjeta · resultado al instante</p>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-green/25 to-brand-gold/25 blur-3xl opacity-70 -z-10 scale-90" />

                <MockupDispositivos />

                <div className="mt-6 text-center">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-brand-gold/30">
                    <Check className="h-3 w-3" /> App completa + Biblioteca de 4 Guías
                  </span>
                  <p className="text-xs text-green-100/70 font-medium mt-2">Tu plan del día, siempre en tu bolsillo</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lo que recibes hoy — respuesta inmediata a "¿qué estoy comprando?" */}
      <FadeIn>
      <section className="py-16 px-6 bg-[#FAF8F2] border-b border-green-100/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow>Acceso inmediato tras la compra</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-2">
              Esto es lo que recibes hoy
            </h2>
            <p className="text-gray-500">Todo junto, en un solo acceso — sin esperas y sin envíos.</p>
          </div>

          {/* Producto principal: la app, presentada como el héroe del entregable */}
          <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-gradient-to-br from-[#134029] via-brand-green to-[#0D3320] ring-1 ring-brand-gold/30 shadow-[0_20px_50px_-24px_rgba(13,51,32,0.7)]">
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative flex items-center gap-4 md:gap-6">
              {/* miniatura real de la app dentro de un marco de teléfono */}
              <div className="shrink-0 w-[76px] md:w-[96px] rounded-[1.1rem] bg-[#0A2016] p-1.5 ring-1 ring-white/10 shadow-lg">
                <div className="rounded-[0.8rem] overflow-hidden bg-white">
                  <img src="/hero/screen-hoy.webp" alt="Pantalla Hoy de la app del Reto GLP-1" className="w-full block" loading="lazy" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-brand-gold bg-white/10 border border-brand-gold/30 rounded-full px-2.5 py-1 mb-2">
                  <Smartphone className="h-3 w-3" /> Producto principal · App
                </span>
                <h3 className="text-white font-bold font-display text-xl md:text-2xl leading-tight">App del Reto de 21 días</h3>
                <p className="text-green-100/90 text-sm md:text-base leading-snug mt-1">
                  Tu plan día a día con menús inteligentes por calorías y proteína, estadísticas de tu progreso y la guía de tu medicamento — todo en un solo lugar.
                </p>
              </div>
              <AppSeal size={72} rotate={-6} className="hidden md:block -mr-1" />
            </div>
          </div>

          {/* Lo que viene incluido dentro de la app — sección única de entregables */}
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green/80 mt-8 mb-3 text-center">
            Y todo esto, incluido dentro de la app
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
            {[
              { t: 'Guía nutricional completa', s: 'El método entero, capítulo por capítulo' },
              { t: '35 recetas anti-náusea', s: 'Con la proteína de cada plato ya calculada' },
              { t: 'Lista de compras inteligente', s: 'Qué sí llevar y qué evitar en el súper' },
              { t: 'Plan de salida anti-rebote', s: '12 semanas para no recuperar el peso' },
              { t: 'Diario alimentario', s: 'Registra cómo te sientes y descubre tus patrones' },
              { t: 'Actualizaciones futuras', s: 'Nuevas recetas y mejoras, sin costo extra' },
            ].map((it) => (
              <div key={it.t} className="flex items-start gap-3 py-3 border-b border-green-100/70">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-brand-green stroke-[3px]" />
                </span>
                <div>
                  <p className="font-bold text-neutral-dark text-[15px] leading-tight">{it.t}</p>
                  <p className="text-sm text-gray-600 leading-snug">{it.s}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-5 flex items-center justify-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-brand-gold shrink-0" />
            Las 4 guías también las descargas en PDF, para leer o imprimir cuando quieras.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-brand-green-vibrant/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green-vibrant/30"
            >
              Quiero todo esto — US$ 9.90 <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-4">
              <span className="inline-flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-brand-gold" /> Pago 100% seguro</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-brand-gold" /> 7 días de garantía</span>
            </p>
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <div className="border-y border-green-100 bg-green-50 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 divide-x divide-gray-100">
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-green tabular-nums">4</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">módulos completos<br className="hidden md:block" /> con acceso inmediato</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-dark tabular-nums">35</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">recetas anti-náusea<br className="hidden md:block" /> con proteína calculada</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-gold tabular-nums">12</p>
            <p className="text-xs text-gray-600 mt-1 leading-snug">semanas de plan de salida<br className="hidden md:block" /> contra el efecto rebote</p>
          </div>
        </div>
      </div>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-[#0B1C13] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow tone="dark">El problema que nadie te contó</Eyebrow>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-display text-white tracking-tight leading-[1.1] mb-4">
              Nadie te avisó que el medicamento<br className="hidden md:block" /> viene con 5 problemas que nadie resuelve.
            </h2>
            <p className="text-green-200/70 text-base max-w-xl mx-auto">
              No es que el GLP-1 no funciona. El problema es que te dieron la mitad de la ecuación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <Thermometer className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Náuseas y malestar constante</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                El GLP-1 reduce el vaciado gástrico. Comer lo incorrecto antes o después de la inyección convierte días normales en jornadas de reflujo, mareos y fatiga que te dejan sin querer hacer nada.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-amber-900/40 flex items-center justify-center border border-amber-800/30">
                <HelpCircle className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">"No sé qué comer. Nadie me explicó nada."</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Tu médico te recetó el medicamento en 10 minutos. Pero no te dijo qué estructura debe tener tu plato, qué alimentos agravan los síntomas ni cuánto comer. El resultado: improvisas todos los días.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Pérdida de músculo silenciosa</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                El GLP-1 suprime el apetito de forma tan drástica que terminas comiendo poco de todo — incluyendo la proteína que mantiene tus músculos firmes. La piel se va aflojando sin que notes cuándo empezó.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200">
              <div className="h-10 w-10 mb-4 rounded-xl bg-amber-900/40 flex items-center justify-center border border-amber-800/30">
                <ZapOff className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Sin energía para vivir el día</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Comes poco, no sabes si estás comiendo lo correcto, y el cuerpo entra en modo ahorro. El resultado es una fatiga que no se va con dormir — porque el problema no es el sueño, es la nutrición.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-400/30 hover:bg-red-950/20 transition-all duration-200 md:col-span-2 lg:col-span-1">
              <div className="h-10 w-10 mb-4 rounded-xl bg-red-900/40 flex items-center justify-center border border-red-800/30">
                <RotateCcw className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Miedo al rebote cuando termines el tratamiento</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                El 80% de las personas que dejan el GLP-1 recuperan el peso en menos de 12 meses. Sin un metabolismo protegido y hábitos alimentarios reales, el rebote no es una posibilidad — es casi una certeza.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <p className="text-white/80 text-base font-semibold mb-2">
              Estos 5 problemas tienen una causa en común:
            </p>
            <p className="text-brand-gold font-bold text-xl md:text-2xl font-display mb-4">
              Nadie te enseñó a comer mientras usas el GLP-1.
            </p>
            <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
              Inviertes hasta <strong className="text-white">US$ 1,200 al mes</strong> en el medicamento. Este sistema cuesta <strong className="text-brand-gold">menos del 1% de eso</strong> — y hace que cada dólar del tratamiento trabaje completo.
            </p>

            <div className="max-w-xl mx-auto mb-10 text-left">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">Lo que cuesta hacerlo bien</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-white/90 text-sm font-semibold">El medicamento GLP-1</p>
                    <p className="text-white/40 text-xs">Hace su parte — pero no te enseña a comer</p>
                  </div>
                  <span className="text-white/70 font-bold text-sm whitespace-nowrap tabular-nums">$800–1,200<span className="text-white/40 font-normal">/mes</span></span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-white/90 text-sm font-semibold">Consulta nutricional privada</p>
                    <p className="text-white/40 text-xs">Útil, pero cara y puntual</p>
                  </div>
                  <span className="text-white/70 font-bold text-sm whitespace-nowrap tabular-nums">$40–80<span className="text-white/40 font-normal">/sesión</span></span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-white/90 text-sm font-semibold">Improvisar por tu cuenta</p>
                    <p className="text-white/40 text-xs">Náuseas, pérdida de músculo y efecto rebote</p>
                  </div>
                  <span className="text-red-400/80 font-bold text-sm whitespace-nowrap">El más caro</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-brand-green-vibrant/15 border-2 border-brand-gold/50 px-4 py-3.5 relative">
                  <span className="absolute -top-2.5 left-4 bg-brand-gold text-neutral-dark text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">La opción inteligente</span>
                  <div>
                    <p className="text-white text-sm font-bold">Guía GLP-1 Inteligente</p>
                    <p className="text-brand-gold/90 text-xs">El protocolo completo — para siempre</p>
                  </div>
                  <span className="text-white font-extrabold text-lg whitespace-nowrap tabular-nums">US$ 9.90</span>
                </div>
              </div>
              <p className="text-center text-white/40 text-xs mt-3">Un pago único · acceso inmediato · en tu moneda local</p>
            </div>

            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 cursor-pointer text-sm shadow-lg shadow-brand-green-vibrant/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <span>Ver el protocolo completo — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-[#FAF8F2]">
        <div className="max-w-6xl mx-auto rounded-3xl p-8 md:p-12 bg-white border border-green-100/70 shadow-[0_1px_40px_-12px_rgba(22,101,52,0.12)]">

          <div className="text-center mb-14">
            <Eyebrow>Tu reto, guiado día a día</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Tu Reto de 21 días vive en una app
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Nada de adivinar. La app genera tu menú por tus calorías y proteína, te muestra estadísticas de tu progreso, incluye la guía de tu medicamento y toda la biblioteca de guías — y avanzas día a día.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-14">

            {/* Mockup del app: plan día a día */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] rounded-[2.2rem] bg-[#0D3320] p-3 shadow-2xl shadow-brand-green/30 ring-1 ring-black/10">
                <div className="rounded-[1.7rem] overflow-hidden bg-[#0D3320]">
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-brand-gold" />
                        </div>
                        <span className="text-white font-bold text-sm">Reto GLP-1</span>
                      </div>
                      <span className="text-[10px] font-bold text-brand-gold bg-white/10 px-2 py-1 rounded-full tabular-nums">Día 7 / 21</span>
                    </div>

                    <div className="flex justify-between mt-4">
                      {['L','M','X','J','V','S','D'].map((d, i) => (
                        <div key={d + i} className={`h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${i < 3 ? 'bg-brand-green-vibrant text-white' : i === 3 ? 'bg-brand-gold text-[#0D3320] ring-2 ring-white/40' : 'bg-white/10 text-white/50'}`}>
                          {i < 3 ? <Check className="h-3.5 w-3.5 stroke-[3px]" /> : d}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-t-[1.4rem] px-5 pt-5 pb-6 space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Plan de hoy</p>

                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                      <Utensils className="h-4 w-4 text-brand-green shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Desayuno</p>
                        <p className="text-xs font-bold text-neutral-dark truncate">Huevos revueltos + avena</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                      <Utensils className="h-4 w-4 text-brand-green shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Almuerzo</p>
                        <p className="text-xs font-bold text-neutral-dark truncate">Pollo + puré de calabaza</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-black text-brand-green tabular-nums leading-none">102g</p>
                        <p className="text-[9px] text-gray-500 font-semibold mt-1">Proteína meta</p>
                      </div>
                      <div className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-black text-brand-green tabular-nums leading-none">6/8</p>
                        <p className="text-[9px] text-gray-500 font-semibold mt-1">Vasos de agua</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-2.5">
                      <Thermometer className="h-4 w-4 text-brand-gold shrink-0" />
                      <span className="text-[11px] font-bold text-[#0D3320]">Hoy toca inyección — protocolo anti-náusea activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Qué hace la app */}
            <div className="lg:col-span-7">
              <ul className="space-y-4">
                {[
                  ['Plan alimentario inteligente', 'Con tu peso, altura y objetivo genera tu día completo — con las calorías y la proteína ya calculadas. Cambias cualquier plato con un toque.'],
                  ['El menú de hoy y 35 recetas a un toque', 'Sabes exactamente qué comer, con la proteína de cada plato lista para cuando casi no tienes hambre.'],
                  ['Guía de tu medicamento', 'Cómo aplicarlo, efectos y alimentación de Ozempic, Wegovy, Mounjaro, Zepbound y Rybelsus — con tu tratamiento destacado.'],
                  ['Estadísticas de todo tu progreso', 'Peso, IMC, cintura, agua, proteína, calorías y síntomas — en gráficos claros que puedes llevar a tu médico.'],
                  ['Registro diario en segundos', 'Síntomas, energía y agua; con el tiempo descubres qué te cae bien y qué no.'],
                  ['Plan de salida de 12 semanas', 'Ves tu avance y evitas el efecto rebote cuando reduces la dosis.'],
                  ['Funciona sin conexión y se instala en tu pantalla de inicio', 'Como una app normal — pero sin descargarla de ninguna tienda.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-green-vibrant/15 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-brand-green-vibrant" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-dark text-base">{t}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-start gap-2 bg-green-50 border border-green-200/60 rounded-xl p-4">
                <Award className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-dark leading-relaxed">
                  <strong>Sin mensualidad.</strong> Apps como BetterMe cobran cada mes. Aquí pagas <strong>una sola vez</strong> y el Reto es tuyo para siempre.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-100 pt-8">
            <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2 max-w-xl mx-auto">
              <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" />
              <span>Adentro también viven las <strong className="text-neutral-dark">4 guías completas</strong>, y una guía paso a paso para instalar el app en tu celular en 2 minutos.</span>
            </p>
          </div>

          <div className="text-center mt-10">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Empezar mi Reto — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      {/* Posicionamiento: la app como nutricionista digital especializado */}
      <FadeIn>
      <section className="py-20 px-6 bg-[#FAF8F2]">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#0D3320] via-brand-green to-[#0B2417] ring-1 ring-brand-gold/25 shadow-[0_30px_80px_-40px_rgba(13,51,32,0.85)]">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand-green-vibrant/10 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative p-8 md:p-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Eyebrow tone="dark">Tu app, tu especialista</Eyebrow>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-display text-white tracking-tight leading-[1.12] mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
                Tu nutricionista digital,<br className="hidden md:block" /> especializado en GLP‑1
              </h2>
              <p className="text-green-100/80 text-base md:text-lg leading-relaxed">
                Un nutricionista que de verdad entiende el GLP‑1 cobra <strong className="text-white">US$ 40–80 por sesión</strong> — y lo ves una vez al mes. Este te acompaña <strong className="text-brand-gold">cada día, dentro de la app</strong>, por un pago único.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 max-w-3xl mx-auto">
              {[
                [Activity, 'Calcula tus números', 'Con tu peso, altura y objetivo define tus calorías y proteína del día — como en una primera consulta.'],
                [Utensils, 'Arma tu menú del día', 'Desayuno, almuerzo, cena y merienda que cumplen tus metas. ¿No te gusta un plato? Lo cambias con un toque.'],
                [LineChart, 'Vigila tu progreso', 'Peso, IMC, cintura, agua, proteína, calorías y síntomas en gráficos claros — para ver qué funciona.'],
                [Syringe, 'Conoce tu medicamento', 'Cómo aplicarlo, qué comer y qué esperar de Ozempic, Wegovy, Mounjaro, Zepbound o Rybelsus.'],
                [ShieldCheck, 'Te cuida el día de la dosis', 'Te guía paso a paso antes y después de la inyección para evitar las náuseas.'],
                [RotateCcw, 'Te prepara para el después', 'El plan de salida de 12 semanas para que el resultado se quede cuando termines el tratamiento.'],
              ].map(([Icon, t, d]: any) => (
                <div key={t} className="flex items-start gap-4 py-4 border-b border-white/10">
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-gold" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-[15px] mb-0.5">{t}</h3>
                    <p className="text-sm text-green-100/70 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-semibold text-green-100/70 mb-6">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-gold" /> Un pago único, sin mensualidad</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-gold" /> 100% offline, en tu bolsillo</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-gold" /> Acceso inmediato</span>
              </div>
              <a
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={triggerCheckout}
                className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D3320] focus-visible:ring-brand-gold"
              >
                <span>Tener mi nutricionista digital — US$ 9.90</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-[#0B1C13] border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <Eyebrow tone="dark">El método</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-white mb-4">
              ¿Por qué este método es diferente?
            </h2>
            <p className="text-green-200/70 text-lg leading-relaxed max-w-2xl mx-auto">
              Perder peso no tiene por qué significar arruinar tu tono muscular y vivir con náuseas crónicas. Ponemos la ciencia de tu lado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">

            <div className="lg:col-span-6 space-y-6">

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/15 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg mb-1">
                    Diseñado específicamente para los 3 problemas que nadie menciona
                  </h4>
                  <p className="text-sm text-white/60">
                    Náuseas, confusión alimentaria y pérdida muscular silenciosa. Cada receta, cada indicación y cada protocolo fue construido sobre la fisiología real del GLP-1 — no es una dieta genérica con el logo del Ozempic pegado encima.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/15 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg mb-1">
                    35 recetas anti-náusea para cuando casi no tienes hambre ni ganas de cocinar
                  </h4>
                  <p className="text-sm text-white/60">
                    Mientras otras guías simplemente te dicen "come menos", este kit te da las recetas exactas que funcionan cuando el estómago está sensible — y que aun así te dan toda la proteína que necesitas para no perder músculo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/15 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg mb-1">
                    El plan de salida que tu médico no te dio
                  </h4>
                  <p className="text-sm text-white/60">
                    El 80% de las personas que dejan el GLP-1 recuperan el peso en 12 meses. El kit incluye el protocolo de salida de 12 semanas — la diferencia entre mantener tu resultado y empezar de cero.
                  </p>
                </div>
              </div>

            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-brand-green text-white p-5 text-center">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-green-300 block mb-1">Análisis Comparativo</span>
                  <h4 className="font-bold font-display text-lg">¿Cómo planeas tu transformación?</h4>
                </div>

                <div className="grid grid-cols-2 divide-x divide-white/10">
                  <div className="p-6 bg-red-950/20 text-center">
                    <span className="text-xs font-bold text-red-400 tracking-wide uppercase block mb-3">GLP-1 sin protocolo</span>
                    <ul className="space-y-4 text-xs text-left text-white/70">
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-400 stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Náuseas sin fin:</strong> Comes lo de siempre, el medicamento lo rechaza, y sufres sin saber por qué.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-400 stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Improvisas cada día:</strong> "¿Puedo comer esto? ¿En qué cantidad?" — sin respuestas, sin guía.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-400 stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Músculo perdido:</strong> Piel floja en brazos, glúteos y rostro — el temido efecto "cara Ozempic".</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-400 stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Rebote garantizado:</strong> Sin metabolismo protegido, el peso regresa en cuanto dejas el medicamento.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-emerald-950/20 text-center relative">
                    <div className="absolute top-2 right-2 bg-brand-green text-[9px] text-white font-bold tracking-wider py-0.5 px-2 rounded-full">RECOMENDADO</div>
                    <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase block mb-3">GLP-1 + Sistema de 4 Módulos</span>
                    <ul className="space-y-4 text-xs text-left text-white/70">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-brand-green-vibrant stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Sin náuseas:</strong> Sabes exactamente qué comer antes y después de la inyección para evitar el malestar.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-brand-green-vibrant stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Claridad total:</strong> Estructura de platos, lista de compras, recetas — sin adivinar, sin ansiedad.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-brand-green-vibrant stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Músculo y tono preservados:</strong> Alta proteína sin esfuerzo, incluso cuando casi no tienes hambre.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-brand-green-vibrant stroke-[3px] shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong className="text-white/90">Resultado duradero:</strong> Metabolismo protegido — el peso se queda afuera cuando termina el tratamiento.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="text-center">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <span>Quiero el protocolo completo — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-green-50/40 border-t border-green-100/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Resultados reales</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
              Pacientes que ya combinan su tratamiento GLP-1 con el Sistema de 4 Módulos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic flex-1">
                "Llevaba semanas con náuseas terribles después de cada inyección. Mi médico me dijo 'es normal'. Con el recetario del kit entendí que estaba comiendo exactamente los alimentos que empeoran el malestar. <strong className="text-neutral-dark">En 10 días las náuseas casi desaparecieron. Bajé 9 kilos y por primera vez estoy disfrutando el proceso.</strong>"
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-emerald-600 border-2 border-green-100 flex items-center justify-center text-[11px] font-bold text-white">VM</div>
                <div>
                  <p className="text-xs font-bold text-neutral-dark">Valentina M.</p>
                  <p className="text-[10px] text-gray-400">Monterrey, México · Ozempic 1mg</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic flex-1">
                "Mi médica me recetó Wegovy y me dijo 'come menos'. Eso fue todo. No saber qué comer me generaba una ansiedad enorme. Con la guía de alimentación entendí la estructura exacta de mi plato. <strong className="text-neutral-dark">Sin adivinar. Sin ansiedad. En 2 meses bajé 11 kg y mi piel sigue firme.</strong>"
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-teal-600 border-2 border-green-100 flex items-center justify-center text-[11px] font-bold text-white">CB</div>
                <div>
                  <p className="text-xs font-bold text-neutral-dark">Carolina B.</p>
                  <p className="text-[10px] text-gray-400">Buenos Aires, Argentina · Wegovy</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(4)].map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-current" />))}
                <Star className="h-4 w-4 text-gray-200 fill-current" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic flex-1">
                "Me sentía sin energía todo el día — pensé que era el medicamento. En realidad era que comía muy poco y sin los nutrientes correctos. Con las recetas del kit empecé a comer bien aunque no tuviera hambre. <strong className="text-neutral-dark">En 6 semanas recuperé la energía y perdí 7 kg de grasa.</strong> Le doy 4 estrellas porque me hubiera gustado más recetas de desayuno, pero el resto es excelente."
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-green-700 border-2 border-green-100 flex items-center justify-center text-[11px] font-bold text-white">DR</div>
                <div>
                  <p className="text-xs font-bold text-neutral-dark">Daniela R.</p>
                  <p className="text-[10px] text-gray-400">Santiago, Chile · Mounjaro</p>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Quiero los mismos resultados — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-xs text-gray-500 mt-3">4 módulos · 35 recetas · Garantía 7 días · Acceso inmediato</p>
          </div>

        </div>
      </section>
      </FadeIn>

      {/* Segundo acceso al quiz — atrapa a quien bajó hasta aquí sin decidir */}
      <FadeIn>
      <section className="px-6 pt-4 pb-2">
        <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#0D3320] to-[#17452A] p-7 md:p-9 text-center ring-1 ring-brand-gold/25 shadow-[0_20px_50px_-24px_rgba(13,51,32,0.7)]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Gratis · 1 minuto
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            ¿Todavía lo dudas? Ve tu plan primero.
          </h3>
          <p className="text-green-100/80 text-sm md:text-base mb-6 max-w-md mx-auto leading-relaxed">
            Responde 6 preguntas y recibe <strong className="text-white">tus calorías y proteína exactas</strong> — sin tarjeta, al instante.
          </p>
          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-brand-gold/60 bg-brand-gold/10 hover:bg-brand-gold/20 text-white font-bold text-base md:text-lg py-4 px-8 transition-colors"
          >
            <Sparkles className="h-5 w-5 text-brand-gold shrink-0" />
            Arma tu plan personalizado
            <ArrowRight className="h-5 w-5 text-brand-gold group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-green-50/30">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <Eyebrow>Oferta especial de lanzamiento</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Tu medicamento hace su parte.<br className="hidden md:block" /> Este kit hace la tuya.
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Gastas entre $800 y $1,200 al mes en el GLP-1. Sin el protocolo correcto, sigues con náuseas, sin saber qué comer y perdiendo músculo — haciendo que cada dólar invertido en el tratamiento trabaje a medias. La Guía GLP-1 Inteligente completa la ecuación que tu médico dejó incompleta.
            </p>
          </div>

          <div className="frame-certificate rounded-2xl shadow-xl relative overflow-hidden max-w-lg mx-auto text-white bg-gradient-to-b from-[#155230] via-brand-green to-[#0E3520]">
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
                  Guía GLP-1 Inteligente Completo
                </h3>
              </div>

              <div className="space-y-3 mt-4 mb-6 text-left border-b border-white/10 pb-6 text-white/90">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tu app principal</p>
                <div className="flex items-center gap-3 text-xs bg-white/10 border border-brand-gold/30 rounded-xl px-3 py-3">
                  <span className="h-8 w-8 shrink-0 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-brand-gold" />
                  </span>
                  <span><strong className="text-white">App del Reto GLP-1 de 21 días</strong> — plan inteligente por calorías y proteína, estadísticas y guía de medicamentos <span className="text-white/50 font-medium">(Valor $39.90)</span></span>
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
                <span className="text-sm font-semibold text-white/70 mt-1">Un pago único</span>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mt-2 bg-white/5 border border-brand-gold/20 px-3 py-1 rounded-full">
                  Sin mensualidades ni cobros ocultos
                </span>
              </div>

              <a
                id="oferta-cta-purchase-trigger"
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={triggerCheckout}
                className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white text-center font-bold py-5 px-6 rounded-2xl text-lg md:text-xl shadow-xl shadow-brand-green-vibrant/40 transition-all duration-300 transform hover:-translate-y-1 animate-pulse-green mb-4 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                <ShoppingCart className="h-5 w-5 text-white shrink-0" />
                <span>Quiero el protocolo completo</span>
              </a>

              <p className="text-xs text-green-100/80 leading-relaxed font-medium mb-6 flex items-center justify-center gap-1.5 max-w-sm mx-auto">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                Empieza hoy y llega a tu próxima inyección con el plan correcto desde el primer día.
              </p>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-center gap-2 mb-5 bg-white/5 border border-brand-gold/30 rounded-xl px-4 py-3 max-w-md mx-auto">
                  <Globe className="h-4 w-4 text-brand-gold shrink-0" />
                  <span className="text-[11px] md:text-xs font-semibold text-white/90 leading-snug text-left">
                    Paga en <strong className="text-brand-gold">tu moneda local</strong> — la conversión se hace automáticamente en el checkout, sin complicaciones.
                  </span>
                </div>
                <div className="flex justify-center items-center gap-3 opacity-80 mb-2">
                  <span className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">PAGO ENCRIPTADO SSL DE ALTA SEGURIDAD</span>
                </div>
                <div className="flex justify-center items-center gap-2.5">
                  <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-bold text-white/80">VISA</span>
                  <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-bold text-white/80">MASTERCARD</span>
                  <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-bold text-white/80">AMEX</span>
                  <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-bold text-white/80">PAYPAL</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-16 px-6 bg-green-50/40 border-t border-green-100/50">
        <div className="max-w-4xl mx-auto bg-white border border-green-200/40 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden">
          
          <div className="absolute right-0 top-0 h-40 w-40 bg-brand-gold/10 rounded-full blur-3xl -z-10" />

          <div className="shrink-0 relative group">
            <div className="absolute inset-x-0 h-28 w-28 bg-brand-gold/30 rounded-full blur-xl group-hover:bg-brand-gold/40 transition duration-300" />
            <div className="h-28 w-28 rounded-full border-4 border-brand-gold bg-white relative z-10 flex flex-col items-center justify-center text-center p-2 shadow-xl animate-pulse-gold">
              <Award className="h-10 w-10 text-brand-gold mb-1" />
              <span className="text-[10px] font-black leading-none text-brand-gold-dark tracking-wide uppercase">100% GARANTIZADO</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-bold font-display text-neutral-dark text-xl md:text-2xl mb-3">
              Garantía "Léelo Todo" — 7 días, sin preguntas.
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Descarga los 4 módulos, prueba 3 recetas y sigue el protocolo en tu próxima inyección. Si al final de los 7 días no sientes diferencia, escribe un correo y te devolvemos el 100% — sin preguntas, sin formularios, sin esperas. Todo el riesgo lo tomamos nosotros.
            </p>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-[#0B1C13] border-t border-white/5">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3 inline-block">
              ¿Tienes Dudas?
            </span>
            <h2 className="text-3xl font-bold font-display tracking-tight text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-green-200/70 text-sm leading-relaxed max-w-lg mx-auto">
              Todo lo que necesitas saber antes de asegurar tu acceso a la Guía GLP-1 Inteligente.
            </p>
          </div>

          <div className="space-y-4">
            
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
                        Sí — y es uno de los problemas más frecuentes que resuelve el kit. La mayoría de las náuseas con GLP-1 no son inevitables: son el resultado de comer los alimentos incorrectos en el momento incorrecto. El recetario anti-náuseas del kit incluye qué comer antes de la inyección, qué evitar las primeras 24 horas y qué texturas tolera mejor el estómago durante el tratamiento. Las pacientes que aplican este protocolo reportan una reducción notable del malestar en los primeros 7-10 días.
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
                  No sé absolutamente nada de nutrición. ¿Este kit es para mí o necesito conocimientos previos?
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
                        Es exactamente para ti. El kit fue diseñado asumiendo que nadie te explicó nada — porque eso es lo que le pasa a la gran mayoría de las personas que empiezan con GLP-1. La Guía de Alimentación usa lenguaje claro, con ejemplos visuales de platos y porciones. Sin términos médicos complicados ni conteo de macros. Solo instrucciones concretas: qué comer, cuánto, cuándo. Si sabes agarrar un tenedor, puedes aplicar este protocolo desde el primer día.
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
                        La información suelta, sí. Lo que no encontrarás gratis es el sistema: qué comer exactamente el día de la inyección, 35 recetas con la proteína ya calculada para tu objetivo, la lista de compras que evita los alimentos que agravan los síntomas y el plan de salida de 12 semanas — todo organizado, verificado y en un solo lugar. Pagas por no tener que armar el rompecabezas tú misma, con tu salud, entre miles de artículos que se contradicen.
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
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Quiero mi Kit GLP-1 — US$ 9.90</span>
            </a>
            <p className="text-xs text-white/40 mt-3">Acceso inmediato · Garantía 7 días · Pago único sin mensualidades</p>
          </div>

        </div>
      </section>
      </FadeIn>

      <footer className="bg-[#0B1C13] text-white/70 py-16 pb-32 md:pb-16 px-6 text-center border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-brand-gold" />
              <span className="font-bold tracking-tight text-xl text-white">Guía GLP-1 Inteligente</span>
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
            <p>© 2026 Guía GLP-1 Inteligente. Todos los derechos reservados.</p>
          </div>

          <div className="max-w-4xl mx-auto text-xs leading-relaxed text-white/75 bg-white/5 p-5 rounded-2xl border border-white/10 text-left">
            <strong className="text-white">Aviso de Exención de Responsabilidad Médica Obligatoria:</strong> Este producto no sustituye de ninguna manera el consejo, diagnóstico o tratamiento médico profesional del paciente. Siempre asesórese de forma presencial con su médico de cabecera especializado en endocrinología o medicina metabólica antes de iniciar cambios nutricionales drásticos o ajustes de dosis en fármacos inyectables como Ozempic®, Wegovy®, Mounjaro® u otros análogos. No retarde ni descuide el acompañamiento integral de su nutricionista clínico por la lectura de material digital complementario. Las marcas registradas mencionadas son propiedad de sus respectivos dueños exclusivos y se utilizan con meros fines de identificación orientadores.
          </div>
        </div>
      </footer>

      {/* Botón fijo mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-3 pt-3 pb-2 shadow-2xl">
        <a
          href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
          onClick={triggerCheckout}
          className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-green-vibrant/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Comprar Ahora — US$ 9.90</span>
          <Lock className="h-3.5 w-3.5 opacity-70" />
        </a>
        <p className="text-center text-[10px] text-gray-500 font-medium mt-1.5 flex items-center justify-center gap-1">
          <Globe className="h-3 w-3 text-brand-green shrink-0" aria-hidden="true" />
          Pagas en tu moneda local · Garantía de 7 días
        </p>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative block overflow-y-auto max-h-[85vh] border border-gray-100">
              <button onClick={() => setActiveModal(null)} aria-label="Cerrar ventana" className="absolute top-4 right-4 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green">
                <XCloseIcon className="h-5 w-5" />
              </button>
              {activeModal === 'terms' ? (
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-green" /> Terminos y Condiciones de Uso</h3>
                  <div className="space-y-4 text-xs text-gray-600 leading-relaxed text-justify">
                    <p>Bienvenido a Guía GLP-1 Inteligente, comercializado con fines divulgativos de estilo de vida saludable.</p>
                    <p><strong>1. Propiedad Intelectual:</strong> Todo el material contenido en el Kit está protegido por leyes de derechos de autor. Queda terminantemente prohibida su comercialización, reventa o redistribución no autorizada.</p>
                    <p><strong>2. Uso del Contenido:</strong> El material se vende como material educativo suplementario y no constituye un canal terapéutico presencial.</p>
                    <p><strong>3. Políticas de Envío:</strong> Los archivos PDF se entregan automáticamente por correo tras procesarse el pago de US$ 9.90.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-green" /> Políticas de Privacidad y Consentimiento</h3>
                  <div className="space-y-4 text-xs text-gray-600 leading-relaxed text-justify">
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