import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  Star,
  Activity,
  Lock,
  Sparkles,
  ShoppingCart,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  Globe,
  Smartphone,
  Award,
  UtensilsCrossed,
  ChefHat,
  LineChart,
  Syringe
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const CHECKOUT_URL = 'https://pay.hotmart.com/O106207568V?checkoutMode=10';

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

/* Eyebrow editorial: rótulo entre finas reglas verdes — la firma visual de la página */
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 mb-5 ${className}`}>
      <span className="h-px w-7 bg-brand-green-vibrant/50" aria-hidden="true" />
      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-green">{children}</span>
      <span className="h-px w-7 bg-brand-green-vibrant/50" aria-hidden="true" />
    </span>
  );
}

/* Teléfono fotorrealista con la pantalla real del app compuesta sobre la pantalla. */
function TelefonoReal({ className = '', screen = '/hero/screen-hoy.webp', alt = 'La app del Método Proteína Primero en el teléfono', shadow = 'drop-shadow(0 24px 32px rgba(11,90,52,0.22))' }: {
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

/* Navegación de pasos numéricos del quiz */
function QuizNav({ onBack, onNext, nextDisabled }: { onBack: () => void; onNext: () => void; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-[#7A8378] hover:text-[#22312A] px-3 py-2">Atrás</button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        Continuar <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* Quiz de plan personalizado — calcula calorías y proteína (Mifflin-St Jeor)
   con los datos del visitante y lo lleva al checkout. */
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
      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${active ? 'border-brand-green-vibrant bg-brand-green-vibrant/5 ring-1 ring-brand-green-vibrant' : 'border-[#E3DED2] hover:border-brand-green-vibrant/60 hover:bg-brand-green-vibrant/[0.04]'}`}
    >
      <span className="font-semibold text-[#22312A] text-[15px]">{label}</span>
      {sub && <span className="block text-xs text-[#7A8378] mt-0.5">{sub}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-[#22312A]/45 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#EFEBE0] shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green-vibrant text-white p-1 rounded-md"><Activity className="h-4 w-4" /></div>
            <span className="font-bold text-sm text-[#22312A]">Tu plan personalizado</span>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-[#9AA39B] hover:text-[#22312A] p-1"><X className="h-5 w-5" /></button>
        </div>

        {step < TOTAL && (
          <div className="h-1 bg-[#F0EDE4] shrink-0">
            <div className="h-full bg-brand-green-vibrant transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">Empecemos. ¿Cuál es tu sexo biológico?</h3>
              <p className="text-sm text-[#7A8378] !mt-1 mb-1">Lo usamos para calcular tus calorías y proteína con precisión.</p>
              <Opt label="Mujer" active={d.sexo === 'mujer'} onClick={() => pick({ sexo: 'mujer' })} />
              <Opt label="Hombre" active={d.sexo === 'hombre'} onClick={() => pick({ sexo: 'hombre' })} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">¿Qué edad tienes?</h3>
              <input
                type="number" inputMode="numeric" placeholder="Ej. 42" value={d.edad ?? ''}
                onChange={(e) => set({ edad: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="w-full rounded-xl border border-[#E3DED2] bg-white px-4 py-3 text-lg text-[#22312A] focus:border-brand-green-vibrant focus:ring-1 focus:ring-brand-green-vibrant outline-none"
              />
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.edad, 16, 90)} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">Tu peso y estatura actuales</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#5C665E]">Unidad de peso:</span>
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnidadPeso(u)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${unidadPeso === u ? 'border-brand-green-vibrant bg-brand-green-vibrant/10 text-brand-green' : 'border-[#E3DED2] text-[#7A8378] hover:border-brand-green-vibrant/50'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium text-[#5C665E] block">Peso ({unidadPeso})
                  <input
                    type="number" inputMode="numeric" placeholder={unidadPeso === 'kg' ? '80' : '176'} value={d.peso ?? ''}
                    onChange={(e) => set({ peso: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#E3DED2] bg-white px-4 py-3 text-lg text-[#22312A] focus:border-brand-green-vibrant focus:ring-1 focus:ring-brand-green-vibrant outline-none"
                  />
                </label>
                <label className="text-sm font-medium text-[#5C665E] block">Estatura (cm)
                  <input
                    type="number" inputMode="numeric" placeholder="165" value={d.altura ?? ''}
                    onChange={(e) => set({ altura: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#E3DED2] bg-white px-4 py-3 text-lg text-[#22312A] focus:border-brand-green-vibrant focus:ring-1 focus:ring-brand-green-vibrant outline-none"
                  />
                </label>
              </div>
              <QuizNav onBack={back} onNext={next} nextDisabled={!numOk(d.peso, unidadPeso === 'kg' ? 40 : 88, unidadPeso === 'kg' ? 250 : 550) || !numOk(d.altura, 120, 220)} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">¿Usas algún medicamento GLP-1?</h3>
              <p className="text-sm text-[#7A8378] !mt-1 mb-1">Si usas uno, la app activa el modo GLP-1 y adapta tu plan.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {['Ozempic', 'Mounjaro', 'Wegovy', 'Rybelsus', 'Zepbound', 'No uso medicación'].map((m) => (
                  <Opt key={m} label={m} active={d.med === m} onClick={() => pick({ med: m })} />
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">¿Cuál es tu objetivo principal?</h3>
              <Opt label="Perder grasa" sub="Bajar de peso de forma sostenida" active={d.objetivo === 'perder'} onClick={() => pick({ objetivo: 'perder' })} />
              <Opt label="Ganar músculo" sub="Subir masa o proteger tu tono al adelgazar" active={d.objetivo === 'muscular'} onClick={() => pick({ objetivo: 'muscular' })} />
              <Opt label="Mantener y comer mejor" sub="Estabilizar tu peso con hábitos reales" active={d.objetivo === 'mantener'} onClick={() => pick({ objetivo: 'mantener' })} />
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-bold text-[#22312A]">¿Qué es lo que más te cuesta hoy?</h3>
              <Opt label="No sé qué comer" active={d.problema === 'comer'} onClick={() => pick({ problema: 'comer' })} />
              <Opt label="Miedo a perder músculo" active={d.problema === 'musculo'} onClick={() => pick({ problema: 'musculo' })} />
              <Opt label="Miedo al efecto rebote" active={d.problema === 'rebote'} onClick={() => pick({ problema: 'rebote' })} />
              <Opt label="Náuseas o poco apetito" active={d.problema === 'nauseas'} onClick={() => pick({ problema: 'nauseas' })} />
            </div>
          )}
          {step === 6 && (
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green bg-brand-green-vibrant/10 rounded-full px-3 py-1 mb-3"><CheckCircle2 className="h-3.5 w-3.5" /> Plan listo</span>
              <h3 className="font-display text-2xl font-bold text-[#22312A] mb-1">Tu plan está listo</h3>
              <p className="text-sm text-[#7A8378] mb-4">Calculado con tus datos{d.med && d.med !== 'No uso medicación' ? ` y tu tratamiento con ${d.med}` : ' y tu objetivo'}.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl bg-brand-green-vibrant/5 border border-brand-green-vibrant/20 p-4">
                  <div className="text-3xl font-black text-brand-green tabular-nums">{kcal}</div>
                  <div className="text-[11px] font-semibold text-[#7A8378] uppercase tracking-wide">kcal / día</div>
                </div>
                <div className="rounded-2xl bg-brand-green-vibrant/5 border border-brand-green-vibrant/20 p-4">
                  <div className="text-3xl font-black text-brand-green tabular-nums">{prot} g</div>
                  <div className="text-[11px] font-semibold text-[#7A8378] uppercase tracking-wide">proteína / día</div>
                </div>
              </div>
              {d.problema && <p className="text-sm text-[#5C665E] leading-relaxed mb-1">{problemaLinea[d.problema]}</p>}
              <p className="text-sm text-[#5C665E] leading-relaxed mb-5">Dentro de la app tienes tu menú día a día con estos números, <strong className="text-[#22312A]">35 recetas altas en proteína</strong>{d.med && d.med !== 'No uso medicación' ? ' y la guía de tu medicamento' : ' y tus macros de cada día'}.</p>
              <a
                href={CHECKOUT_URL}
                onClick={onCheckout}
                className="cta-buy animate-pulse-green w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover font-bold text-center text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Desbloquear mi plan completo — US$ 9.90 <ArrowRight className="h-5 w-5" />
              </a>
              <p className="text-[11px] text-[#7A8378] mt-2.5 flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-brand-green" /> Pago único, sin suscripción</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-brand-green" /> 7 días de garantía</span>
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
    let targetUrl = e.currentTarget.href || CHECKOUT_URL;

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

  const faqs: [string, string][] = [
    [
      'No uso Ozempic ni ningún medicamento. ¿Sirve para mí?',
      'Sí. El corazón del método es tu menú diario con calorías y proteína calculadas para tu objetivo — perder grasa, ganar músculo o comer mejor. El modo GLP-1 es una función opcional: si no usas esos medicamentos, nunca lo verás.',
    ],
    [
      '¿Cuándo recibo el acceso?',
      'Inmediatamente. Al confirmarse el pago, Hotmart te envía un correo con tu acceso. La app se abre desde el navegador y se instala en tu pantalla de inicio en 2 minutos — sin tiendas de aplicaciones. Incluimos la guía paso a paso.',
    ],
    [
      'El precio está en dólares. ¿Puedo pagar en mi moneda?',
      'Sí. El checkout detecta tu país y te muestra el monto exacto en tu moneda local antes de confirmar. Puedes pagar con tarjeta y, según tu país, con métodos locales como Mercado Pago.',
    ],
    [
      '¿Y si no es para mí?',
      'Tienes 7 días de garantía total. Prueba la app y el plan; si no sientes diferencia, escribe un correo y te devolvemos el 100% — sin preguntas ni formularios.',
    ],
  ];

  return (
    <div className="min-h-screen bg-premium-wellness text-neutral-dark font-sans selection:bg-brand-green-vibrant/15 selection:text-brand-green overflow-x-hidden antialiased">

      <PlanQuiz open={quizOpen} onClose={() => setQuizOpen(false)} onCheckout={triggerCheckout} />

      {/* Header */}
      <header className="border-b border-[#ECE7DB] py-3.5 px-6 sticky top-0 bg-[#FDFBF7]/92 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-green-vibrant p-1.5 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-[#1B2620]">Método Proteína Primero</span>
              <span className="text-[11px] text-brand-green font-semibold block -mt-1">Tu plan de comidas · 21 días</span>
            </div>
          </div>

          <a
            href={CHECKOUT_URL}
            onClick={triggerCheckout}
            className="cta-buy bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-sm font-bold px-4 min-h-[42px] rounded-xl transition-all duration-200 hover:scale-[1.03] shadow-sm flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
          >
            Comprar — US$ 9.90
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-14 md:pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <Eyebrow>Método Proteína Primero</Eyebrow>

              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold font-display text-[#1B2620] tracking-tight leading-[1.1] mb-5">
                Sabes exactamente <span className="text-brand-green">qué comer</span>, cada día.
              </h1>

              <p className="text-lg md:text-xl text-[#4A554D] leading-relaxed mb-8 max-w-xl">
                Una app con tu plan de 21 días: menú diario, calorías y proteína calculadas para <strong className="text-[#1B2620]">perder grasa, ganar músculo o comer mejor</strong>. ¿Usas Ozempic o similar? Modo GLP-1 incluido.
              </p>

              <div className="w-full sm:max-w-md">
                <a
                  id="hero-cta-btn"
                  href={CHECKOUT_URL}
                  onClick={triggerCheckout}
                  className="cta-buy group w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover font-bold text-center text-lg py-5 px-8 rounded-2xl animate-pulse-green transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green-vibrant/40"
                >
                  Empezar mi plan — US$ 9.90
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={() => setQuizOpen(true)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-hover underline underline-offset-4 decoration-brand-green-vibrant/40 py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-vibrant/60 rounded"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  o descubre tu plan gratis en 60 segundos
                </button>

                <div className="flex items-center justify-center gap-5 mt-4 text-xs text-[#5C665E] font-medium flex-wrap">
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-brand-green-vibrant stroke-[3px]" /> Acceso inmediato
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-brand-green-vibrant" /> Pago único
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-brand-green-vibrant" /> Garantía 7 días
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative mx-auto w-full max-w-[290px]">
                <div className="absolute inset-0 rounded-full bg-brand-green-vibrant/10 blur-3xl -z-10 scale-90" />
                <TelefonoReal className="mx-auto w-full" alt="La app del Método Proteína Primero abierta en el teléfono" />
                <p className="text-xs text-[#7A8378] font-medium mt-4 text-center">Tu plan del día, siempre en tu bolsillo</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lo que recibes */}
      <FadeIn>
      <section className="py-16 px-6 bg-gray-soft border-y border-[#ECE7DB]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Acceso inmediato</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#1B2620] mb-2">
              Esto es lo que recibes hoy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              [UtensilsCrossed, 'Tu menú de cada día', 'Calorías, proteína y macros ya calculados según tu peso y objetivo. Cambias cualquier plato con un toque.'],
              [ChefHat, '35 recetas altas en proteína', 'Con la proteína de cada plato lista — sin pesar nada ni pensarlo.'],
              [LineChart, 'Tu progreso en gráficos', 'Peso, IMC y medidas, listos para enseñar a tu médico o nutricionista.'],
              [Syringe, 'Modo GLP-1 opcional', '¿Ozempic, Wegovy o Mounjaro? Actívalo y la app se adapta a tu tratamiento.'],
            ].map(([Icon, t, d]: any) => (
              <div key={t} className="bg-white rounded-2xl border border-[#ECE7DB] p-6 shadow-luxe">
                <div className="h-10 w-10 mb-4 rounded-xl bg-brand-green-vibrant/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand-green-vibrant" />
                </div>
                <h3 className="font-bold text-[#1B2620] text-base mb-1.5">{t}</h3>
                <p className="text-sm text-[#5C665E] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2.5 bg-white border border-[#ECE7DB] rounded-2xl p-4 max-w-2xl mx-auto">
            <Award className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <p className="text-sm text-[#4A554D] leading-relaxed">
              Incluye además el <strong className="text-[#1B2620]">plan anti-rebote de 12 semanas</strong> y 4 guías en PDF. <strong className="text-[#1B2620]">Sin mensualidad</strong> — pagas una sola vez y es tuyo para siempre.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a
              href={CHECKOUT_URL}
              onClick={triggerCheckout}
              className="cta-buy inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover font-bold text-lg py-4 px-8 rounded-2xl animate-pulse-green transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green-vibrant/30"
            >
              Empezar mi plan — US$ 9.90 <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Testimonios */}
      <FadeIn>
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Resultados reales</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#1B2620]">
              Lo que dicen quienes ya lo usan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ['MJ', 'María José G.', 'Guadalajara, México · Perder peso', 5, 'Abro la app y ya sé qué comer, con la proteína calculada. En 8 semanas bajé 7 kilos sin pasar hambre.'],
              ['CB', 'Carolina B.', 'Buenos Aires, Argentina · Wegovy', 5, 'Mi médica me recetó Wegovy y solo me dijo "come menos". Con el método entendí exactamente qué poner en mi plato. Bajé 11 kg en 2 meses.'],
              ['AP', 'Andrés P.', 'Bogotá, Colombia · Ganar músculo', 4, 'Con el plan ajustado a ganar músculo por fin veo resultados: más fuerza y menos grasa en 6 semanas.'],
            ].map(([ini, nombre, lugar, stars, quote]: any) => (
              <div key={nombre} className="bg-white rounded-2xl p-6 border border-[#ECE7DB] shadow-luxe flex flex-col">
                <div className="flex items-center gap-0.5 mb-3" aria-label={`${stars} de 5 estrellas`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 fill-current ${i < stars ? 'text-amber-500' : 'text-[#DBD5C7]'}`} />
                  ))}
                </div>
                <p className="text-sm text-[#4A554D] leading-relaxed mb-5 italic flex-1">"{quote}"</p>
                <div className="flex items-center gap-3 border-t border-[#F0EDE4] pt-4 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-brand-green-vibrant/10 border-2 border-brand-green-vibrant/30 flex items-center justify-center text-[11px] font-bold text-brand-green">{ini}</div>
                  <div>
                    <p className="text-xs font-bold text-[#1B2620]">{nombre}</p>
                    <p className="text-[10px] text-[#7A8378]">{lugar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Oferta */}
      <FadeIn>
      <section className="py-16 px-6 bg-gray-mint border-y border-[#E2EFE6]">
        <div className="max-w-lg mx-auto">
          <div className="frame-certificate rounded-3xl bg-white shadow-luxe overflow-hidden">
            <div className="bg-brand-green text-center py-3 px-4">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/90 flex items-center justify-center gap-2">
                <Smartphone className="h-3.5 w-3.5" /> Acceso completo · Pago único
              </span>
            </div>

            <div className="p-8 md:p-10 text-center">
              <h2 className="font-bold font-display text-[#1B2620] text-2xl mb-6">
                Método Proteína Primero
              </h2>

              <ul className="space-y-3 mb-7 text-left text-sm text-[#4A554D]">
                {[
                  'App del plan de 21 días — menú, calorías, proteína y progreso',
                  '35 recetas altas en proteína + lista de compras',
                  'Plan anti-rebote de 12 semanas',
                  '4 guías completas en PDF de regalo',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-brand-green-vibrant shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col items-center mb-6">
                <span className="text-xs text-[#9AA39B] line-through tracking-wide">Valor total: US$ 89.90</span>
                <div className="flex items-baseline justify-center gap-1.5 mt-1">
                  <span className="text-2xl text-brand-green font-bold">US$</span>
                  <span className="text-6xl font-black text-[#1B2620] tracking-tight tabular-nums">9.90</span>
                </div>
                <span className="text-[11px] font-bold text-brand-green uppercase tracking-widest mt-2 bg-brand-green-vibrant/10 px-3 py-1 rounded-full">
                  Un solo pago · sin mensualidades
                </span>
              </div>

              <a
                id="oferta-cta-purchase-trigger"
                href={CHECKOUT_URL}
                onClick={triggerCheckout}
                className="cta-buy w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-center font-bold py-5 px-6 rounded-2xl text-lg animate-pulse-green transition-all duration-300 mb-5 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green-vibrant/40"
              >
                <ShoppingCart className="h-5 w-5 shrink-0" />
                <span>Quiero mi acceso ahora</span>
              </a>

              <div className="flex items-start gap-2.5 bg-gray-soft border border-[#ECE7DB] rounded-2xl p-4 text-left mb-4">
                <Award className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-xs text-[#4A554D] leading-relaxed">
                  <strong className="text-[#1B2620]">Garantía de 7 días.</strong> Si no sientes diferencia, te devolvemos el 100% — sin preguntas.
                </p>
              </div>

              <p className="text-[11px] text-[#7A8378] flex items-center justify-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-brand-green shrink-0" />
                Pagas en tu moneda local · Pago seguro (VISA, Mastercard, AMEX, PayPal)
              </p>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* FAQ */}
      <FadeIn>
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>¿Dudas?</Eyebrow>
            <h2 className="text-3xl font-bold font-display tracking-tight text-[#1B2620]">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map(([q, a], i) => (
              <div key={q} className="border border-[#ECE7DB] rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-gray-soft/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green-vibrant transition-colors duration-150"
                >
                  <span className="font-bold text-[#1B2620] text-sm md:text-base pr-4">{q}</span>
                  {activeFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-brand-green shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#9AA39B] shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#F0EDE4]"
                    >
                      <div className="p-5 bg-gray-soft/50 text-sm text-[#4A554D] leading-relaxed">
                        <p>{a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={CHECKOUT_URL}
              onClick={triggerCheckout}
              className="cta-buy inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover font-bold py-4 px-10 rounded-2xl animate-pulse-green transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Empezar mi plan — US$ 9.90</span>
            </a>
            <p className="text-xs text-[#7A8378] mt-3">Acceso inmediato · Garantía 7 días · Pago único sin mensualidades</p>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Footer */}
      <footer className="bg-gray-soft text-[#5C665E] py-14 pb-32 md:pb-14 px-6 text-center border-t border-[#ECE7DB]">
        <div className="max-w-4xl mx-auto space-y-7">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-green-vibrant" />
              <span className="font-bold tracking-tight text-lg text-[#1B2620]">Método Proteína Primero</span>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-6 text-xs font-semibold">
            <button onClick={() => setActiveModal('terms')} className="text-[#5C665E] hover:text-[#1B2620] hover:underline transition-colors duration-150 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-vibrant">Términos de Uso</button>
            <span className="text-[#C9C3B4]" aria-hidden="true">|</span>
            <button onClick={() => setActiveModal('privacy')} className="text-[#5C665E] hover:text-[#1B2620] hover:underline transition-colors duration-150 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-vibrant">Políticas de Privacidad</button>
            <span className="text-[#C9C3B4]" aria-hidden="true">|</span>
            <a href="mailto:soporte@guiaglp1.com" className="text-[#5C665E] hover:text-[#1B2620] hover:underline transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-vibrant">Contacto Soporte</a>
          </div>

          <div className="text-xs text-[#7A8378] border-t border-[#E3DED2] pt-7">
            <p>© 2026 Método Proteína Primero. Todos los derechos reservados.</p>
          </div>

          <div className="max-w-3xl mx-auto text-[11px] leading-relaxed text-[#6B756D] bg-white p-5 rounded-2xl border border-[#ECE7DB] text-left">
            <strong className="text-[#4A554D]">Aviso de Exención de Responsabilidad Médica Obligatoria:</strong> Este producto no sustituye de ninguna manera el consejo, diagnóstico o tratamiento médico profesional del paciente. Siempre asesórese de forma presencial con su médico de cabecera especializado en endocrinología o medicina metabólica antes de iniciar cambios nutricionales drásticos o ajustes de dosis en fármacos inyectables como Ozempic®, Wegovy®, Mounjaro® u otros análogos. No retarde ni descuide el acompañamiento integral de su nutricionista clínico por la lectura de material digital complementario. Las marcas registradas mencionadas son propiedad de sus respectivos dueños exclusivos y se utilizan con meros fines de identificación orientadores.
          </div>
        </div>
      </footer>

      {/* Botón fijo mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#ECE7DB] px-3 pt-3 pb-2 shadow-[0_-12px_32px_rgba(11,90,52,0.12)]">
        <a
          href={CHECKOUT_URL}
          onClick={triggerCheckout}
          className="cta-buy w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Empezar mi plan — US$ 9.90</span>
        </a>
        <p className="text-center text-[10px] text-[#7A8378] font-medium mt-1.5 flex items-center justify-center gap-1">
          <Globe className="h-3 w-3 text-brand-green shrink-0" aria-hidden="true" />
          Pagas en tu moneda local · Garantía de 7 días
        </p>
      </div>

      {/* Modales legales */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#22312A]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative block overflow-y-auto max-h-[85vh] border border-[#ECE7DB]">
              <button onClick={() => setActiveModal(null)} aria-label="Cerrar ventana" className="absolute top-4 right-4 bg-gray-soft rounded-full p-1.5 hover:bg-[#EDE9DE] text-[#7A8378] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-vibrant">
                <XCloseIcon className="h-5 w-5" />
              </button>
              {activeModal === 'terms' ? (
                <div>
                  <h3 className="text-xl font-bold text-[#1B2620] mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-green" /> Terminos y Condiciones de Uso</h3>
                  <div className="space-y-4 text-xs text-[#5C665E] leading-relaxed text-justify">
                    <p>Bienvenido a Método Proteína Primero, comercializado con fines divulgativos de estilo de vida saludable.</p>
                    <p><strong>1. Propiedad Intelectual:</strong> Todo el material contenido en el producto está protegido por leyes de derechos de autor. Queda terminantemente prohibida su comercialización, reventa o redistribución no autorizada.</p>
                    <p><strong>2. Uso del Contenido:</strong> El material se vende como material educativo suplementario y no constituye un canal terapéutico presencial.</p>
                    <p><strong>3. Políticas de Envío:</strong> Los archivos PDF se entregan automáticamente por correo tras procesarse el pago de US$ 9.90.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-[#1B2620] mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-green" /> Políticas de Privacidad y Consentimiento</h3>
                  <div className="space-y-4 text-xs text-[#5C665E] leading-relaxed text-justify">
                    <p>Su privacidad es nuestra máxima prioridad.</p>
                    <p><strong>1. Recopilación de Datos:</strong> Solo recopilamos su correo y nombre para el despacho del producto digital.</p>
                    <p><strong>2. Seguridad:</strong> No almacenamos números de tarjetas. Todas las operaciones pasan por gateways PCI-DSS.</p>
                    <p><strong>3. Cancelaciones:</strong> Puede solicitar la eliminación de sus datos en cualquier momento por email.</p>
                  </div>
                </div>
              )}
              <button onClick={() => setActiveModal(null)} className="w-full mt-6 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white py-3 rounded-xl font-bold text-sm transition">Entendido, Cerrar Ventana</button>
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
