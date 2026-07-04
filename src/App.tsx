import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  BookOpen,
  Utensils,
  ShoppingBag,
  ClipboardList,
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
  Scale,
  Clock,
  CheckCircle2,
  HelpCircle,
  X,
  Globe,
  Thermometer,
  TrendingDown,
  ZapOff,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import mockupImage from './assets/images/glp1_guide_mockup_1781632222712.jpg';

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

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [calcWeight, setCalcWeight] = useState<number>(75);
  const [calcWeightUnit, setCalcWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [calcMed, setCalcMed] = useState<string>('Ozempic');
  const [calcCurrentProtein, setCalcCurrentProtein] = useState<string>('low');
  const [isCalced, setIsCalced] = useState(false);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

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

  const handleCalculator = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalced(true);
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
      (window as any).fbq('track', 'InitiateCheckout', { value: 9.9, currency: 'USD' });
    }

    window.location.href = targetUrl;
  };

  const weightInKg = calcWeightUnit === 'lb' ? Math.round(calcWeight * 0.453592) : calcWeight;
  const recommendedProtein = Math.round(weightInKg * 1.8);
  const estimatedCurrent = calcCurrentProtein === 'low' ? 40 : calcCurrentProtein === 'med' ? 65 : 90;
  const deficit = recommendedProtein - estimatedCurrent;
  const muscleLossRisk = deficit > 40 ? 'Crítico' : deficit > 15 ? 'Moderado' : 'Seguro';

  return (
    <div className="min-h-screen bg-premium-wellness bg-smart-grid text-neutral-dark font-sans selection:bg-brand-green/10 selection:text-brand-green overflow-x-hidden antialiased">
      
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
        
        <div className="bg-white/10 border-b border-white/10 py-3 px-4 mb-8 -mx-6 text-center">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-brand-gold text-xs md:text-sm font-semibold tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse shrink-0" />
            <span className="font-poppins-bold uppercase select-none flex items-center gap-2 flex-wrap justify-center">
              PRECIO DE LANZAMIENTO:
              <span className="bg-white/15 border border-brand-gold/40 rounded-md px-2.5 py-0.5 text-brand-gold tabular-nums normal-case text-sm">
                US$ 9.90 <span className="text-white/50 line-through ml-1">US$ 49.90</span>
              </span>
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <p className="text-sm text-green-300/70 mb-4 font-medium tracking-wide">
                El manual de alimentación que tu médico nunca te entregó
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.15] mb-6">
                Tomas Ozempic. Tienes náuseas. No sabes qué comer.<br /><span className="text-brand-gold">Este protocolo lo resuelve.</span>
              </h1>

              <p className="text-lg md:text-xl text-green-50 font-normal leading-relaxed mb-6 max-w-2xl">
                El GLP-1 funciona — pero exige un protocolo de alimentación que casi ningún médico explica. Sin él: pérdida de músculo, náuseas innecesarias y efecto rebote. <strong className="text-brand-gold">El Sistema de 4 Módulos es ese protocolo.</strong>
              </p>

              <div className="mb-6 flex items-center gap-2 flex-wrap justify-center lg:justify-start text-xs text-green-100 font-semibold">
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">4 Módulos</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">35 recetas anti-náusea</span>
                <span className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5">Plan de salida de 12 semanas</span>
              </div>

              <div className="w-full sm:max-w-md">
                <a
                  id="hero-cta-btn"
                  href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                  onClick={triggerCheckout}
                  className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold text-center text-lg md:text-xl py-5 px-8 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl animate-pulse-green relative overflow-hidden flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Quiero comer sin miedo — US$ 9.90
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 z-0 group-hover:animate-shine" />
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
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-green/20 to-brand-gold/20 blur-2xl opacity-70 group-hover:opacity-100 transition duration-1000 -z-10" />
                
                <div className="bg-white border border-white/20 shadow-2xl shadow-black/30 rounded-3xl overflow-hidden p-3">
                  <img
                    src={mockupImage}
                    alt="Kit de Sobrevivencia GLP-1 Inteligente"
                    width={900}
                    height={672}
                    fetchPriority="high"
                    className="w-full h-auto rounded-2xl shadow-md object-cover transform hover:scale-[1.02] transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 pt-4 text-center">
                    <span className="text-[10px] uppercase font-semibold tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full inline-block mb-1 border border-green-200/50">
                      Kit Digital Multidispositivo
                    </span>
                    <p className="text-xs text-gray-500 font-medium">Compatible con Celulares, Tablets y Computadoras</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
      <section className="py-20 px-6 bg-slate-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight mb-4">
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
      <section className="bg-green-50/40 py-16 px-6 border-y border-green-100/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display tracking-tight text-neutral-dark mb-3">
              ¿Cuánta proteína está perdiendo tu cuerpo?
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              La falta de proteína mientras usas GLP-1 acelera la pérdida de músculo y flacidez. Calcula tu déficit en 30 segundos:
            </p>
          </div>

          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            <form onSubmit={handleCalculator} className="p-6 md:p-8 md:col-span-7 border-r border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-green" />
                Ingresa tus datos de tratamiento
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Tu Peso Actual
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-brand-green-hover focus-within:border-transparent">
                    <input
                      type="number"
                      inputMode="numeric"
                      aria-label="Tu peso actual"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full px-4 py-3 text-gray-800 font-semibold tabular-nums focus:outline-none placeholder-gray-400"
                      placeholder="Ej. 75"
                      min="30"
                      max="250"
                      required
                    />
                    <div className="flex border-l border-gray-200 bg-gray-50 rounded-r-xl">
                      <button
                        type="button"
                        onClick={() => setCalcWeightUnit('kg')}
                        aria-pressed={calcWeightUnit === 'kg'}
                        className={`px-4 min-h-[44px] text-xs font-bold cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green ${calcWeightUnit === 'kg' ? 'bg-brand-green text-white shadow-inner' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        KG
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcWeightUnit('lb')}
                        aria-pressed={calcWeightUnit === 'lb'}
                        className={`px-4 min-h-[44px] text-xs font-bold cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green ${calcWeightUnit === 'lb' ? 'bg-brand-green text-white shadow-inner' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        LB
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Fármaco Utilizado
                  </label>
                  <select 
                    value={calcMed}
                    onChange={(e) => setCalcMed(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent text-gray-800 font-medium"
                  >
                    <option value="Ozempic">Ozempic® (Semaglutida)</option>
                    <option value="Wegovy">Wegovy® (Semaglutida)</option>
                    <option value="Mounjaro">Mounjaro® (Tirzepatida)</option>
                    <option value="Otros">Otro Análogo GLP-1 / Liraglutida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    ¿Cuánta proteína estimas comer diario?
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${calcCurrentProtein === 'low' ? 'border-brand-green bg-green-50 font-semibold text-brand-green' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                      <input 
                        type="radio" 
                        name="protein" 
                        value="low"
                        checked={calcCurrentProtein === 'low'}
                        onChange={() => setCalcCurrentProtein('low')}
                        className="text-brand-green focus:ring-brand-green h-4 w-4"
                      />
                      <span className="text-xs">Baja (Solo carne/huevos en 1 comida de tamaño pequeño - ~40g)</span>
                    </label>
                    
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${calcCurrentProtein === 'med' ? 'border-brand-green bg-green-50 font-semibold text-brand-green' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                      <input 
                        type="radio" 
                        name="protein" 
                        value="med"
                        checked={calcCurrentProtein === 'med'}
                        onChange={() => setCalcCurrentProtein('med')}
                        className="text-brand-green focus:ring-brand-green h-4 w-4"
                      />
                      <span className="text-xs">Moderada (Proteínas en 2 comidas en porciones normales - ~65g)</span>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${calcCurrentProtein === 'high' ? 'border-brand-green bg-green-50 font-semibold text-brand-green' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                      <input 
                        type="radio" 
                        name="protein" 
                        value="high"
                        checked={calcCurrentProtein === 'high'}
                        onChange={() => setCalcCurrentProtein('high')}
                        className="text-brand-green focus:ring-brand-green h-4 w-4"
                      />
                      <span className="text-xs">Alta (Proteína dosificada en todas las comidas conscientes - ~90g)</span>
                    </label>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-3.5 px-6 min-h-[44px] rounded-xl transition-colors duration-200 shadow-lg shadow-brand-green-vibrant/20 flex items-center justify-center gap-2 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
              >
                <Activity className="h-4 w-4 text-brand-gold" />
                VER MI DIAGNÓSTICO METABÓLICO
              </button>
            </form>

            <div className="bg-green-50/40 p-6 md:p-8 md:col-span-5 flex flex-col justify-center text-center md:text-left relative">
              <AnimatePresence mode='wait'>
                {!isCalced ? (
                  <motion.div 
                    key="not-calculated"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-10"
                  >
                    <HelpCircle className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-xs text-gray-500 max-w-[220px] text-center font-medium">
                      Completa los datos de la izquierda para generar tu diagnóstico de riesgo.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="calculated"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                      Resultado Personalizado
                    </span>

                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Tu requerimiento diario mínimo con GLP-1:
                      </p>
                      <h4 className="text-3xl font-extrabold text-neutral-dark flex items-baseline gap-1 tabular-nums">
                        {recommendedProtein} <span className="text-sm font-medium text-gray-500">gramos</span>
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Tu Déficit Proteico Estimado:
                      </p>
                      <h4 className={`text-2xl font-extrabold tabular-nums ${deficit > 15 ? 'text-red-600' : 'text-emerald-600'} flex items-baseline gap-1`}>
                        {deficit <= 0 ? 0 : deficit} <span className="text-sm font-medium text-gray-500">g de déficit / día</span>
                      </h4>
                    </div>

                    <div className="border-t border-gray-200/80 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-500 uppercase">Riesgo de Flacidez &amp; Catabolismo:</span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          muscleLossRisk === 'Crítico' ? 'bg-red-100 text-red-700 animate-pulse' : 
                          muscleLossRisk === 'Moderado' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {muscleLossRisk}
                        </span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            muscleLossRisk === 'Crítico' ? 'bg-red-600' : 
                            muscleLossRisk === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(15, (deficit / 100) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {muscleLossRisk === 'Crítico' ? (
                        <strong className="text-red-700 flex items-center gap-1">
                          <ShieldAlert className="h-4 w-4 shrink-0" /> Alerta: Estás degradando músculo activo.
                        </strong>
                      ) : (
                        <span className="text-gray-700">Tu masa muscular necesita estimulación diaria.</span>
                      )}{" "}
                      Para proteger tu elasticidad cutánea y acelerar el gasto calórico basal en reposo, debes incorporar los protocolos de nuestro <strong>Recetario de Alta Proteína</strong> de inmediato.
                    </p>

                    <a
                      href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                      onClick={triggerCheckout}
                      className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover shadow-lg shadow-brand-green-vibrant/25 text-white text-xs font-bold py-3.5 px-4 min-h-[44px] rounded-xl transition-colors duration-200 flex items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green-vibrant"
                    >
                      <span>Cubrir mis {deficit > 0 ? deficit : 0}g de déficit — US$ 9.90</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto rounded-2xl p-8 md:p-12 bg-green-50/25 border border-green-100/60">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              El Sistema de 4 Módulos: una respuesta para cada problema real
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Cada pieza del kit ataca uno de los 5 problemas que el GLP-1 trae sin advertencia. No es una guía genérica — es la respuesta específica a lo que estás viviendo ahora mismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  1. Guía Médica de Alimentación
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Resuelve el "¿qué como hoy?" para siempre. Te da la estructura exacta de platos que funciona con la fisiología del GLP-1: qué comer, en qué momento, en qué cantidad — para que nunca más improvises.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  <Check className="h-4 w-4 stroke-[3px] shrink-0" aria-hidden="true" /> Resuelve: "No sé qué comer"
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <Utensils className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  2. Recetario Anti-Náusea de Alta Proteína
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  35 recetas diseñadas para cuando casi no tienes hambre y cualquier olor puede disparar el malestar. Fáciles, rápidas (15 min), con los alimentos específicos que el GLP-1 tolera mejor — y que preservan tu músculo.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  <Check className="h-4 w-4 stroke-[3px] shrink-0" aria-hidden="true" /> Resuelve: náuseas + pérdida de músculo
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  3. Lista de Supermercado Inteligente
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lo que sí llevar y lo que NO. Los alimentos que disparan el reflujo y los que agravan la náusea ya no entran a tu casa. Lista lista para imprimir o llevar en el celular — sin pensar, sin dudar.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  <Check className="h-4 w-4 stroke-[3px] shrink-0" aria-hidden="true" /> Resuelve: alimentos que empeoran los síntomas
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  4. Diario de Síntomas y Progreso
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Registra qué comiste, cómo te sentiste y tu nivel de energía día a día. Identifica qué alimentos te caen bien y cuáles no — y lleva evidencia real a tu próxima consulta médica para ajustar el tratamiento.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  <Check className="h-4 w-4 stroke-[3px] shrink-0" aria-hidden="true" /> Resuelve: fatiga y falta de control sobre el proceso
                </span>
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
              <span>Quiero el protocolo completo — US$ 9.90</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      <FadeIn>
      <section className="py-20 px-6 bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
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
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-green-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
              Resultados Reales
            </span>
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

      <FadeIn>
      <section className="py-20 px-6 bg-green-50/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-green-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
              Oferta Especial de Lanzamiento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Tu medicamento hace su parte.<br className="hidden md:block" /> Este kit hace la tuya.
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Gastas entre $800 y $1,200 al mes en el GLP-1. Sin el protocolo correcto, sigues con náuseas, sin saber qué comer y perdiendo músculo — haciendo que cada dólar invertido en el tratamiento trabaje a medias. La Guía GLP-1 Inteligente completa la ecuación que tu médico dejó incompleta.
            </p>
          </div>

          <div className="bg-brand-green rounded-2xl shadow-xl relative overflow-hidden max-w-lg mx-auto text-white ring-1 ring-white/10">
            <div className="bg-white/10 border-b border-white/5 text-white text-center py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-gold animate-pulse" />
                ¡PACK DIGITAL CON ACCESO INMEDIATO!
              <Sparkles className="h-4 w-4 text-brand-gold animate-pulse" />
            </div>

            <div className="p-8 md:p-10 text-center">
              <h3 className="font-extrabold text-brand-gold text-base uppercase tracking-widest mb-2">
                Guía GLP-1 Inteligente Completo
              </h3>
              
              <div className="space-y-3 mt-4 mb-6 text-left border-b border-white/10 pb-6 text-white/90">
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Guía Médica de Estructuración de Platos <span className="text-white/50 font-medium">(Valor regular $19.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Recetario Anti-Náusea de Alta Proteína <span className="text-white/50 font-medium">(Valor regular $14.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Lista de Supermercado Inteligente <span className="text-white/50 font-medium">(Valor regular $9.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Diario de Síntomas y Progreso GLP-1 <span className="text-white/50 font-medium">(Valor regular $5.20)</span></span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-xs text-white/50 line-through tracking-wide">
                  Valor Total: US$ 49.90
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl text-brand-gold font-bold align-super">US$</span>
                  <span className="text-6xl md:text-7xl font-black text-white tracking-tight glow-gold tabular-nums">
                    9.90
                  </span>
                  <span className="text-sm font-semibold text-white/70 ml-1">Un pago único</span>
                </div>
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
                <ShoppingCart className="h-5 w-5 text-white" />
                <span>Quiero el protocolo completo — US$ 9.90</span>
              </a>

              <p className="text-xs text-brand-gold leading-relaxed font-semibold mb-6 flex items-center justify-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Cada semana sin el protocolo es una semana de náuseas innecesarias, músculo perdido y confusión. El momento de actuar es ahora.
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
      <section className="py-20 px-6 bg-slate-950 border-t border-white/5">
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
                        Inmediatamente. En el momento en que se confirma tu pago, Hotmart te envía un correo con el acceso directo a los 4 PDFs. No necesitas crear cuenta, esperar revisiones ni descargar ninguna app. En menos de 3 minutos tienes el kit en tu pantalla — y puedes empezar la Guía de Alimentación esta misma noche.
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

      <footer className="bg-slate-950 text-white/70 py-16 pb-32 md:pb-16 px-6 text-center border-t border-white/5">
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