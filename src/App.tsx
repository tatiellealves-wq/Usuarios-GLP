import React, { useState } from 'react';
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
  Flame, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  Download, 
  ShoppingCart, 
  FileText, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  Clock, 
  Heart,
  CheckCircle2,
  HelpCircle,
  Copy,
  Receipt,
  User,
  CreditCard,
  Mail,
  RefreshCw,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SplineSceneBasic } from '@/components/ui/spline-section'

import mockupImage from './assets/images/glp1_guide_mockup_1781632222712.jpg';

// Reusable scroll-reveal wrapper. Animates only opacity/transform (y),
// and respects the user's reduced-motion preference by rendering a plain
// pass-through container with no animation.
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

// Main Application Component
export default function App() {
  // Get formatted date in Spanish
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return today.toLocaleDateString('es-ES', options);
  };

  // --- States ---
  // FAQ accordion active state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Checkout modal active states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'loading' | 'success'>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [hasOrderBump, setHasOrderBump] = useState(false);
  const [checkoutProgress, setCheckoutProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Calculator states
  const [calcWeight, setCalcWeight] = useState<number>(75);
  const [calcWeightUnit, setCalcWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [calcMed, setCalcMed] = useState<string>('Ozempic');
  const [calcCurrentProtein, setCalcCurrentProtein] = useState<string>('low'); // low limit (~40g), med (~65g), high (~90g)
  const [isCalced, setIsCalced] = useState(false);

  // Institution Modals
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  // Toggle FAQ Accordion
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Run Calculator Logic
  const handleCalculator = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalced(true);
  };

  // Handle Checkout Process
  const triggerCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let targetUrl = e.currentTarget.href || 'https://pay.hotmart.com/O106207568V?checkoutMode=10';
    
    // Fallback: If the target URL doesn't have UTM parameters but the current page does, let's append them.
    // This ensures tracking is preserved even if external script scanning has any delay.
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
      (window as any).fbq('track', 'InitiateCheckout');
    }
    
    // Delay navigation slightly so the Facebook Pixel request successfully executes and completes
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 400);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 'details') {
      if (!fullName || !email) {
        alert('Por favor, ingresa tu nombre completo y correo electrónico para enviar el acceso.');
        return;
      }
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert('Por favor, ingresa los datos de tu tarjeta simulada.');
        return;
      }
      setCheckoutStep('loading');
      simulatePaymentProgress();
    }
  };

  // Simulate Stripe-like security validation
  const simulatePaymentProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCheckoutProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setCheckoutStep('success');
      }
    }, 150);
  };

  // Copy simulated download link
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Calculator Outputs
  const weightInKg = calcWeightUnit === 'lb' ? Math.round(calcWeight * 0.453592) : calcWeight;
  const recommendedProtein = Math.round(weightInKg * 1.8); // 1.8g of protein per kg under GLP-1 is scientific golden standard
  const estimatedCurrent = calcCurrentProtein === 'low' ? 40 : calcCurrentProtein === 'med' ? 65 : 90;
  const deficit = recommendedProtein - estimatedCurrent;
  const muscleLossRisk = deficit > 40 ? 'Crítico' : deficit > 15 ? 'Moderado' : 'Seguro';

  return (
    <div className="min-h-screen bg-premium-wellness bg-smart-grid text-neutral-dark font-sans selection:bg-brand-green/10 selection:text-brand-green overflow-x-hidden antialiased">
      
      {/* 100% CLINICO EMERGENCY ANNOUNCEMENT TO BAR */}
      <div className="bg-brand-green text-white text-xs font-semibold tracking-wider text-center py-2 px-4 shadow-sm flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-gold" />
        <span className="uppercase font-sans tracking-widest text-[10px] md:text-xs">
          Misión Científica: Evitar la sarcopenia y la flacidez cutánea por GLP-1
        </span>
      </div>

      {/* HEADER NAV */}
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
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-brand-green-vibrant animate-pulse"></span>
              Ecosistema Autorizado
            </span>
            <a
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="text-white bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-xs font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-sm shadow-brand-green-vibrant/20 flex items-center justify-center"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
      </header>

      {/* 1. SECTOR HERO (Dobra Principal) */}
      <section className="relative pt-0 pb-20 px-6 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-[#0D3320]">
        
        {/* Full-width urgency banner at the top of Hero section */}
        <div className="bg-white/10 border-b border-white/10 py-3 px-4 mb-8 -mx-6 text-center">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-amber-300 text-xs md:text-sm font-semibold tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-poppins-bold uppercase select-none">
              OFERTA VÁLIDA SOLO HOY — {getFormattedDate()}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Copy Column */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
                <Award className="h-4 w-4 text-brand-gold" />
                <span className="text-xs font-semibold tracking-wide text-green-200">
                  Desarrollado por nutricionistas clínicas especializadas en metabolismo y farmacoterapia para GLP-1
                </span>
              </div>

              {/* Huge Headline with exact #355E2D */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.15] mb-6">
                El Ozempic puede quitarte los kilos.<br /><span className="text-brand-gold">Pero si no comes bien, también te quita el músculo.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-green-100 font-normal leading-relaxed mb-8 max-w-2xl">
                El Protocolo de Nutrición Anabólica para GLP-1: el único método que sincroniza tu alimentación con la ventana metabólica que abre el medicamento para preservar músculo, eliminar grasa y evitar el efecto rebote cuando termines el tratamiento.
              </p>

              {/* Responsive CTA Button in #00C853 */}
              <div className="w-full sm:max-w-md">
                <a
                  id="hero-cta-btn"
                  href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                  onClick={triggerCheckout}
                  className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold text-center text-lg md:text-xl py-5 px-8 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl animate-pulse-green relative overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sí, quiero perder grasa sin perder mi músculo
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 z-0 group-hover:animate-shine" />
                </a>
                
                {/* Micro support text */}
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

              {/* Direct Proof under button */}
              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6 w-full justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Usuario Ozempic" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="Usuario Wegovy" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" alt="Usuario Mounjaro" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                </div>
                <div className="text-left text-xs text-green-100">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current animate-pulse" />
                    <span className="font-bold text-white ml-1">4.9/5</span>
                  </div>
                  <p>Más de <strong className="text-white">2,450 pacientes</strong> optimizando su pérdida grasa</p>
                </div>
              </div>
            </div>

            {/* Visual Column / Interactive Calculator Box */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
                {/* Visual Glow Ornament */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-green/20 to-brand-gold/20 blur-2xl opacity-70 group-hover:opacity-100 transition duration-1000 -z-10" />
                
                {/* Book & Layout Premium Mockup Representation */}
                <div className="bg-white border border-white/20 shadow-2xl shadow-black/30 rounded-3xl overflow-hidden p-3">
                  <img 
                    src={mockupImage} 
                    alt="Kit de Sobrevivencia GLP-1 Inteligente" 
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

      {/* SOCIAL PROOF STATS BAR */}
      <FadeIn>
      <div className="border-y border-green-100 bg-green-50 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 divide-x divide-gray-100">
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-green tabular-nums">2,450+</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">pacientes optimizando<br className="hidden md:block" /> su tratamiento GLP-1</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-neutral-dark tabular-nums">4.9<span className="text-base font-bold text-gray-400">/5</span></p>
            <p className="text-xs text-gray-500 mt-0.5">valoración promedio</p>
          </div>
          <div className="text-center px-2 md:px-6">
            <p className="text-2xl md:text-3xl font-extrabold text-brand-gold tabular-nums">100%</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">garantía de devolución<br className="hidden md:block" /> en 7 días</p>
          </div>
        </div>
      </div>
      </FadeIn>

      {/* INTERACTIVE 3D SPLINE SECTION (21st.dev, brand-adapted) */}
      <section className="px-6 py-12 md:py-16 max-w-6xl mx-auto">
        <SplineSceneBasic />
      </section>

      {/* ADDITIONAL INTERACTIVE POWER TOOL: CLINICAL PROTEIN DEFICIT CALCULATOR */}
      <FadeIn>
      <section className="bg-green-50/40 py-16 px-6 border-y border-green-100/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-green-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
              Análisis de Riesgo Clínico Gratuito
            </span>
            <h2 className="text-3xl font-bold font-display tracking-tight text-neutral-dark mb-3">
              ¿Tu masa muscular corre peligro con el tratamiento?
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              La falta de nutrientes adecuados mientras usas medicamentos GLP-1 acelera la pérdida de músculo (sarcopenia), destruyendo tu metabolismo. Calcula tu déficit en 30 segundos:
            </p>
          </div>

          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            {/* Input Form Column */}
            <form onSubmit={handleCalculator} className="p-6 md:p-8 md:col-span-7 border-r border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-green" />
                Ingresa tus datos de tratamiento
              </h3>

              <div className="space-y-5">
                {/* Weight Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Tu Peso Actual
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-brand-green-hover focus-within:border-transparent">
                    <input 
                      type="number" 
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full px-4 py-3 text-gray-800 font-semibold focus:outline-none placeholder-gray-400"
                      placeholder="Ej. 75"
                      min="30"
                      max="250"
                      required
                    />
                    <div className="flex border-l border-gray-200 bg-gray-50 rounded-r-xl">
                      <button 
                        type="button" 
                        onClick={() => setCalcWeightUnit('kg')}
                        className={`px-3 py-1 text-xs font-bold ${calcWeightUnit === 'kg' ? 'bg-brand-green text-white shadow-inner' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        KG
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCalcWeightUnit('lb')}
                        className={`px-3 py-1 text-xs font-bold ${calcWeightUnit === 'lb' ? 'bg-brand-green text-white shadow-inner' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        LB
                      </button>
                    </div>
                  </div>
                </div>

                {/* Medication Dropdown */}
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

                {/* Protein Intake Radio Buttons */}
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
                className="w-full mt-6 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-brand-green-vibrant/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Activity className="h-4 w-4 text-brand-gold" />
                VER MI DIAGNÓSTICO METABÓLICO
              </button>
            </form>

            {/* Assessment Result Column */}
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

                    {/* Deficit metrics */}
                    <div>
                      <p className="text-xs text-sidebar font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Tu requerimiento diario mínimo con GLP-1:
                      </p>
                      <h4 className="text-3xl font-extrabold text-neutral-dark flex items-baseline gap-1 tabular-nums">
                        {recommendedProtein} <span className="text-sm font-medium text-gray-500">gramos</span>
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Tu Déficit Proteico Estimado:
                      </p>
                      <h4 className={`text-2xl font-extrabold tabular-nums ${deficit > 15 ? 'text-red-600' : 'text-emerald-600'} flex items-baseline gap-1`}>
                        {deficit <= 0 ? 0 : deficit} <span className="text-sm font-medium text-gray-500">g de déficit / día</span>
                      </h4>
                    </div>

                    {/* Risk Badge */}
                    <div className="border-t border-gray-200/80 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-500 uppercase">Riesgo de Flacidez & Catabolismo:</span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          muscleLossRisk === 'Crítico' ? 'bg-red-100 text-red-700 animate-pulse' : 
                          muscleLossRisk === 'Moderado' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {muscleLossRisk}
                        </span>
                      </div>
                      
                      {/* Risk progress bar visual */}
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

                    <p className="text-xs text-gray-500 leading-relaxed">
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
                      className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover shadow-lg shadow-brand-green-vibrant/25 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>OBTENER MI RECETARIO INTELIGENTE</span>
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

      {/* 2. SEÇÃO: O QUE VC VAI RECEBER */}
      <FadeIn>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto rounded-2xl p-8 md:p-12 bg-green-50/25 border border-green-100/60">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full mb-4 inline-block">
              Contenido del Ecosistema
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Tu Kit de Sobrevivencia y Optimización GLP-1
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para evitar efectos secundarios molestos y multiplicar tu pérdida grasa de manera saludable en un solo pack digital descargable.
            </p>
          </div>

          {/* Grid de 2x2 no desktop, 1 coluna no mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  1. Guía Médica de Alimentación
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Descubre la estructura exacta de platos recomendada por expertos para estructurar tus porciones óptimamente y desbloquear la máxima saciedad metabólica sin descuidar tu nutrición esencial.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  ✓ Estructura de platos clínicamente validada
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <Utensils className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  2. Recetario de Alta Proteína
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Recetas deliciosas, saciantes y ultrarrápidas, listas en 15 minutos. Diseñadas específicamente para proteger tu masa muscular activa, evitar la fatiga y combatir la temida flacidez dérmica.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  ✓ Nutrición de absorción rápida anti-flacidez
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  3. Lista de Súper Compras Inteligente
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  El mapa exacto y directo de lo que debes y NO debes comprar en el supermercado. Ahorra cientos de dólares en cestas vacías y evita los alimentos inflamatorios de alto índice glucémico.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  ✓ Ahorro inteligente de despensa inflamatoria
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-green-200/50 transition-all duration-200 flex gap-5">
              <div className="h-12 w-12 bg-green-50 shrink-0 rounded-xl flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-dark text-lg md:text-xl mb-3">
                  4. Diario de Progreso Imprimible
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Un sistema físico/digital portátil para registrar tus tomas semanales de dosis, síntomas, ingesta libre de agua, y tus niveles de energía diarias para monitorear tu evolución metabólica real.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-green font-bold mt-4">
                  ✓ Plantillas organizadoras en PDF y digital
                </span>
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <a 
              href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
              onClick={triggerCheckout}
              className="inline-flex items-center justify-center gap-2 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white font-bold py-4.5 px-10 rounded-2xl shadow-xl shadow-brand-green-vibrant/20 transition duration-300 group cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5 text-brand-gold" />
              <span>Sí, quiero perder grasa sin perder mi músculo — US$ 9,90</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>
      </FadeIn>

      {/* 3. SEÇÃO: POR QUE ESCOLHER OS PRODUTOS */}
      <FadeIn>
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full mb-4 inline-block">
              Enfoque Científico Distintivo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              ¿Por qué este método es diferente?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Perder peso no tiene por qué significar arruinar tu tono muscular y vivir con náuseas crónicas. Ponemos la ciencia de tu lado.
            </p>
          </div>

          {/* List/Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/5 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-dark text-base md:text-lg mb-1">
                    No es una dieta genérica disfrazada de "apta para GLP-1"
                  </h4>
                  <p className="text-sm text-gray-500">
                    Cada receta, cada lista de compras, cada indicación fue construida sobre la fisiología específica de lo que hace el semaglutide a tu metabolismo — incluyendo la supresión de apetito que hace que comer suficiente proteína sea casi imposible sin un sistema.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/5 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-dark text-base md:text-lg mb-1">
                    35 recetas de alta proteína para cuando casi no tienes hambre
                  </h4>
                  <p className="text-sm text-gray-500">
                    Mientras todas las guías te dicen que comas menos, esta te da exactamente cuánto músculo necesitas preservar — y las recetas listas en 15 minutos que lo hacen posible aunque apenas tengas apetito.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="h-10 w-10 shrink-0 bg-brand-green-vibrant/5 rounded-lg flex items-center justify-center text-brand-green-vibrant">
                  <CheckCircle2 className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-dark text-base md:text-lg mb-1">
                    El plan de salida que tu médico no te dio
                  </h4>
                  <p className="text-sm text-gray-500">
                    El 80% de las personas que dejan el GLP-1 recuperan el peso en 12 meses. El kit incluye el protocolo de salida de 12 semanas — la diferencia entre mantener tu resultado y empezar de cero.
                  </p>
                </div>
              </div>

            </div>

            {/* HIGHLY PERSUASIVE COMPARISON TABLE IN SPANISH (Antes vs Después / Sin Guía vs Con Guía) */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-brand-green text-white p-5 text-center">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-green-300 block mb-1">Análisis Comparativo</span>
                  <h4 className="font-bold font-display text-lg">¿Cómo planeas tu transformación?</h4>
                </div>
                
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  {/* Común Column */}
                  <div className="p-6 bg-red-50/20 text-center">
                    <span className="text-xs font-bold text-red-600 tracking-wide uppercase block mb-3">Fármaco GLP-1 Solo</span>
                    <ul className="space-y-4 text-xs text-left text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span><strong>Pérdida muscular grave:</strong> Piel colgada en brazos, glúteos y rostro (efecto "cara Ozempic").</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span><strong>Fatiga extrema:</strong> Sorteas el día sin fuerza ni energía por déficit selectivo proteico.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span><strong>Estreñimiento y Náuseas:</strong> Sin saber qué fibra o enzima asimilar para reducir el espasmo digestivo.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span>
                        <span><strong>Efecto Rebote inminente:</strong> Retornas al peso anterior al dejar la dosis debido a un metabolismo frenado.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Optimizado Column */}
                  <div className="p-6 bg-emerald-50/10 text-center relative">
                    <div className="absolute top-2 right-2 bg-brand-green text-[9px] text-white font-bold tracking-wider py-0.5 px-2 rounded-full">RECOMENDADO</div>
                    <span className="text-xs font-bold text-brand-green tracking-wide uppercase block mb-3">Kit GLP-1 Inteligente</span>
                    <ul className="space-y-4 text-xs text-left text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-brand-green-vibrant font-bold">✓</span>
                        <span><strong>Tono muscular firme:</strong> Masa magra activa preservada con nutrición clínicamente equilibrada.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-green-vibrant font-bold">✓</span>
                        <span><strong>Vitalidad & Enfoque:</strong> Nutrientes biodisponibles que mantienen tus células cargadas de energía.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-green-vibrant font-bold">✓</span>
                        <span><strong>Bienestar Digestivo:</strong> Protocolos simples que minimizan reflujos, acidez y el estreñimiento leve.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-brand-green-vibrant font-bold">✓</span>
                        <span><strong>Cuerpo Sostenible:</strong> Mantienes tu peso ideal post-tratamiento gracias a un metabolismo íntegro y protegido.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>
      </FadeIn>

      {/* 4. SEÇÃO: OFERTAS & SCARCITY */}
      <FadeIn>
      <section className="py-20 px-6 bg-green-50/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-green-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
              Ofertas Especial de Lanzamiento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Gastas $1,000 al mes en el medicamento.<br className="hidden md:block" /> Este kit cuesta menos que un café.
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Tu inyección semanal te costó entre $800 y $1,200 este mes. Sin el protocolo nutricional correcto, ese medicamento puede consumir hasta un <strong className="text-neutral-dark">35% de tu masa muscular</strong>. La Guía GLP-1 Inteligente existe para que cada dólar que gastas en Ozempic trabaje para ti, no contra ti.
            </p>
          </div>

          {/* Pricing premium card */}
          <div className="bg-brand-green rounded-2xl shadow-xl relative overflow-hidden max-w-lg mx-auto text-white ring-1 ring-white/10">
            {/* Stamp of value */}
            <div className="bg-white/10 border-b border-white/5 text-white text-center py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-gold animate-pulse" />
                ¡PACK DIGITAL CON ACCESO INMEDIATO!
              <Sparkles className="h-4 w-4 text-brand-gold animate-pulse" />
            </div>

            <div className="p-8 md:p-10 text-center">
              <h3 className="font-extrabold text-brand-gold text-base uppercase tracking-widest mb-2">
                Guía GLP-1 Inteligente Completo
              </h3>
              
              {/* Product stack mini items */}
              <div className="space-y-3 mt-4 mb-6 text-left border-b border-white/10 pb-6 text-white/90">
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Guía Médica de Estructuración de Platos <span className="text-white/50 font-medium">(Valor regular $19.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Recetario Rápido de Alta Proteína <span className="text-white/50 font-medium">(Valor regular $14.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Lista de Supermercado Inteligente <span className="text-white/50 font-medium">(Valor regular $9.90)</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Diario de Hábitos y Rastreador GLP-1 <span className="text-white/50 font-medium">(Valor regular $5.20)</span></span>
                </div>
              </div>

              {/* Price anchoring */}
              <div className="flex flex-col items-center justify-center mb-6">
                <span className="text-xs text-white/50 line-through tracking-wide">
                  Valor Total: US$ 49,90
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl text-brand-gold font-bold align-super">US$</span>
                  <span className="text-6xl md:text-7xl font-black text-white tracking-tight glow-gold tabular-nums">
                    9,90
                  </span>
                  <span className="text-sm font-semibold text-white/70 ml-1">Un pago único</span>
                </div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mt-2 bg-white/5 border border-brand-gold/20 px-3 py-1 rounded-full">
                  Sin mensualidades ni cobros ocultos
                </span>
              </div>

              {/* Button CTA */}
              <a
                id="oferta-cta-purchase-trigger"
                href="https://pay.hotmart.com/O106207568V?checkoutMode=10"
                onClick={triggerCheckout}
                className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white text-center font-bold py-5 px-6 rounded-2xl text-lg md:text-xl shadow-xl shadow-brand-green-vibrant/40 transition-all duration-300 transform hover:-translate-y-1 animate-pulse-green mb-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 text-white" />
                <span>Sí, quiero perder grasa sin perder mi músculo</span>
              </a>

              {/* Urgency warning */}
              <p className="text-xs text-brand-gold leading-relaxed font-semibold mb-6 flex items-center justify-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Cada semana que usas el GLP-1 sin el protocolo correcto es una semana en que tu cuerpo puede estar sacrificando músculo. El momento de actuar es ahora.
              </p>

              {/* Secure transaction and pay methods */}
              <div className="border-t border-white/10 pt-6">
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

      {/* 5. SEÇÃO: GARANTIA */}
      <FadeIn>
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center shadow-sm relative overflow-hidden">
          
          {/* Subtle Golden Glow Ornament */}
          <div className="absolute right-0 top-0 h-40 w-40 bg-brand-gold/10 rounded-full blur-3xl -z-10" />

          {/* Warranty elegance seal badge illustration */}
          <div className="shrink-0 relative group">
            <div className="absolute inset-x-0 h-28 w-28 bg-brand-gold/30 rounded-full blur-xl group-hover:bg-brand-gold/40 transition duration-300" />
            <div className="h-28 w-28 rounded-full border-4 border-brand-gold bg-white relative z-10 flex flex-col items-center justify-center text-center p-2 shadow-xl animate-pulse-gold">
              <Award className="h-10 w-10 text-brand-gold mb-1" />
              <span className="text-[10px] font-black leading-none text-brand-gold-dark tracking-wide uppercase">100% GARANTIZADO</span>
            </div>
          </div>

          {/* Copy */}
          <div className="text-center md:text-left">
            <h3 className="font-bold font-display text-neutral-dark text-xl md:text-2xl mb-3">
              Garantía Total de 7 Días — sin preguntas.
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Una mujer que ya está invirtiendo en su salud merece tomar decisiones sin riesgo. Si en 7 días sientes que este kit no es para ti, te devolvemos cada centavo — sin preguntas, sin formularios, sin esperas. Así de seguras estamos de lo que tienes en tus manos.
            </p>
          </div>

        </div>
      </section>
      </FadeIn>

      {/* 6. SEÇÃO: FAQ (Preguntas Frecuentes) */}
      <FadeIn>
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3 inline-block">
              ¿Tienes Dudas?
            </span>
            <h2 className="text-3xl font-bold font-display tracking-tight text-neutral-dark mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Todo lo que necesitas saber antes de asegurar tu acceso a la Guía GLP-1 Inteligente.
            </p>
          </div>

          {/* Accordion Questions Stack */}
          <div className="space-y-4">
            
            {/* Q1 */}
            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-250">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green transition-colors duration-150"
              >
                <span className="font-bold text-gray-800 text-sm md:text-base pr-4">
                  ¿Sirve esto si acabo de empezar con el Ozempic y todavía estoy ajustando la dosis?
                </span>
                {activeFaq === 1 ? (
                  <ChevronUp className="h-5 w-5 text-brand-green shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {activeFaq === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-5 md:p-6 bg-green-50/30 text-xs md:text-sm text-gray-600 leading-relaxed space-y-2">
                      <p>
                        Sí — y este es exactamente el momento en que más lo necesitas. Las primeras semanas de GLP-1 son cuando el metabolismo es más sensible: el cuerpo está aprendiendo a quemar grasa, pero sin el protocolo correcto también empieza a perder músculo. Este kit te da el mapa nutricional desde el día uno, no después de que el daño ya está hecho.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Q2 */}
            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-250">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green transition-colors duration-150"
              >
                <span className="font-bold text-gray-800 text-sm md:text-base pr-4">
                  Pagué, ¿y ahora qué? ¿Cuánto tiempo hasta que puedo usarlo?
                </span>
                {activeFaq === 2 ? (
                  <ChevronUp className="h-5 w-5 text-brand-green shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-5 md:p-6 bg-green-50/30 text-xs md:text-sm text-gray-600 leading-relaxed">
                      <p>
                        Inmediatamente. En el momento en que se confirma tu pago, Hotmart te envía un correo con el acceso directo a los 4 PDFs. No necesitas crear cuenta, esperar revisiones ni descargar ninguna app. En menos de 3 minutos tienes el kit en tu pantalla — y puedes empezar la Guía de Alimentación esta misma noche.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Q3 */}
            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-250">
              <button
                type="button"
                onClick={() => toggleFaq(3)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green transition-colors duration-150"
              >
                <span className="font-bold text-gray-800 text-sm md:text-base pr-4">
                  Tengo miedo de que cuando pierda el peso me quede la piel flácida. ¿Esto realmente puede prevenirlo?
                </span>
                {activeFaq === 3 ? (
                  <ChevronUp className="h-5 w-5 text-brand-green shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeFaq === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="p-5 md:p-6 bg-green-50/30 text-xs md:text-sm text-gray-600 leading-relaxed">
                      <p>
                        Ese miedo es completamente legítimo — y tiene nombre clínico: sarcopenia inducida por GLP-1. La guía médica de alimentación y el recetario de alta proteína trabajan juntos para mantener el tejido muscular mientras se pierde grasa. Preservar músculo es lo que mantiene el contorno del cuerpo firme y evita el aspecto "desinflado". No podemos prometerte que prevendrá el 100% de los cambios cutáneos — pero sí podemos decirte que la nutrición es la única variable que tienes bajo tu control para minimizarlos.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>



        </div>
      </section>
      </FadeIn>

      {/* 7. SEÇÃO: RODAPÉ */}
      <footer className="bg-slate-950 text-white/60 py-16 px-6 text-center border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Logo brand and badge */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-brand-gold" />
              <span className="font-bold tracking-tight text-xl text-white">Guía GLP-1 Inteligente</span>
            </div>
            <p className="text-xs text-white/40">Nutrición de alta conversión para un cambio real y duradero.</p>
          </div>

          {/* Discret links */}
          <div className="flex justify-center flex-wrap gap-6 text-xs font-semibold">
            <button 
              onClick={() => setActiveModal('terms')} 
              className="text-white/60 hover:text-white hover:underline transition"
            >
              Términos de Uso
            </button>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => setActiveModal('privacy')} 
              className="text-white/60 hover:text-white hover:underline transition"
            >
              Políticas de Privacidad
            </button>
            <span className="text-white/20">|</span>
            <a href="mailto:soporte@guiaglp1.com" className="text-white/60 hover:text-white hover:underline transition">
              Contacto Soporte
            </a>
          </div>

          {/* Copyright description */}
          <div className="text-xs text-white/30 border-t border-white/5 pt-8">
            <p className="font-normal">
              © 2026 Guía GLP-1 Inteligente. Todos los derechos reservados.
            </p>
          </div>

          {/* Medical warning disclaimer in smaller text */}
          <div className="max-w-4xl mx-auto text-[9px] leading-relaxed text-white/40 bg-white/5 p-5 rounded-2xl border border-white/5 text-justify">
            <strong className="text-white">Aviso de Exención de Responsabilidad Médica Obligatoria:</strong> Este producto no de ninguna manera sustituye el consejo, diagnóstico o tratamiento médico profesional del paciente. Siempre asesórese de forma presencial con su médico de cabecera especializado en endocrinología o medicina metabólica antes de iniciar cambios nutricionales drásticos o ajustes de dosis en fármacos inyectables como Ozempic®, Wegovy®, Mounjaro® u otros análogos. No retarde ni descuide el acompañamiento integral de su nutricionista clínico por la lectura de material digital complementario. Las marcas registradas mencionadas son propiedad de sus respectivos dueños exclusivos y se utilizan con meros fines de identificación orientadores.
          </div>

        </div>
      </footer>

      {/* --- POPUP DE PREGUNTAS INSTITUCIONALES (TERMS / PRIVACY) --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative block overflow-y-auto max-h-[85vh] border border-gray-100"
            >
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Cerrar ventana"
                className="absolute top-4 right-4 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
              >
                <XCloseIcon className="h-5 w-5" />
              </button>

              {activeModal === 'terms' ? (
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-green" /> Terminos y Condiciones de Uso
                  </h3>
                  <div className="space-y-4 text-xs text-gray-600 leading-relaxed text-justify">
                    <p>Bienvenido a Guía GLP-1 Inteligente, comercializado con fines divulgativos de estilo de vida saludable.</p>
                    <p><strong>1. Propiedad Intelectual:</strong> Todo el material contenido en el Kit, incluyendo recetarios, diarios de hábitos clínicos y consejos de compras inteligentes está protegido por leyes de derechos de autor. Queda terminantemente prohibida su comercialización, reventa, redistribución o duplicación no autorizada bajo multas aplicables.</p>
                    <p><strong>2. Uso del Contenido:</strong> El material se vende como material de lectura educativa suplementaria y no constituye un canal terapéutico presencial. Los resultados de pérdida ponderal pueden variar de persona a persona según el nivel inicial de grasa corporal, la dosis farmacológica y la adhesión directa.</p>
                    <p><strong>3. Políticas de Envío:</strong> Los archivos PDF se entregan automáticamente y sin cargo postal directo por correo tras procesarse la validación del gateway de pago de US$ 9.90.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-green" /> Políticas de Privacidad y Consentimiento
                  </h3>
                  <div className="space-y-4 text-xs text-gray-600 leading-relaxed text-justify">
                    <p>Su privacidad es nuestra máxima prioridad científica y comercial:</p>
                    <p><strong>1. Recopilación de Datos Personales:</strong> Solo recopilamos su correo electrónico y nombre de forma consentida para realizar el despacho automatizado del infoproduto digital y notificaciones de actualización médica.</p>
                    <p><strong>2. Seguridad Informática:</strong> No almacenamos en absoluto números de tarjetas de crédito o credenciales de pago locales. Todas las operaciones pasan mediante gateways de encriptación seguros homologados con altos estándares industriales PCI-DSS.</p>
                    <p><strong>3. Cancelaciones y Eliminación de Registro:</strong> En todo momento puede mandar un email a nuestro soporte y exigir la eliminación definitiva de su dirección de correo de nuestras listas de boletines.</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                className="w-full mt-6 bg-brand-green hover:bg-brand-green-hover text-white py-3 rounded-xl font-bold text-sm transition"
              >
                Entendido, Cerrar Ventana
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HIGH CONVERSION SECURE CHECKOUT & DOWNLOAD PORTAL MODAL --- */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col max-h-[90vh]"
            >
              
              {/* Header Box checkout */}
              <div className="bg-brand-green text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                  <div>
                    <span className="text-xs uppercase font-extrabold text-brand-gold tracking-widest block">Checkout Seguro</span>
                    <h4 className="text-sm font-bold -mt-0.5">Suscripción Manual & Descarga Directa</h4>
                  </div>
                </div>
                
                {checkoutStep !== 'loading' && (
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    aria-label="Cerrar checkout"
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <XCloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress Steps UI */}
              {checkoutStep !== 'success' && checkoutStep !== 'loading' && (
                <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 text-center bg-gray-50/50">
                  <div className={`py-2 text-[10px] font-bold ${checkoutStep === 'details' ? 'text-brand-green bg-white' : 'text-gray-400'}`}>
                    1. DATOS DE ENVÍO
                  </div>
                  <div className={`py-2 text-[10px] font-bold ${checkoutStep === 'payment' ? 'text-brand-green bg-white' : 'text-gray-400'}`}>
                    2. PAGO ENCRIPTADO
                  </div>
                </div>
              )}

              {/* Steps Scroll Body */}
              <div className="overflow-y-auto p-6 flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Details */}
                  {checkoutStep === 'details' && (
                    <motion.form 
                      key="step-details"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleNextStep}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <p className="text-xs text-gray-500">
                          Introduce el correo electrónico al cual deseas mandar el cargamento digital instantáneo.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">
                          Tu Nombre Completo
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-white w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-800"
                            placeholder="Ej. Sofía Rodríguez"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">
                          Tu Correo Electrónico Principal
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-800"
                            placeholder="sofi@ejemplo.com"
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">
                          Soporte anti-spam. Despacho automatizado inmediato.
                        </span>
                      </div>

                      {/* FAST ACTION DIRECT RESPONSE ORDER BUMP BANNER */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-brand-gold text-white rounded-lg p-1 mt-0.5 shrink-0">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="bg-brand-gold-dark text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase">OFERTA DE UN ÚNICO CLIC</span>
                            <h4 className="font-bold text-gray-800 text-xs mt-1">
                              Guía de Ayuno Seguro bajo GLP-1 (+$2.99)
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                              Agrega de forma permanente el módulo de ayuno intermitente adaptado de manera segura para que el vaciado gástrico lento no juegue en contra de tu energía. 
                            </p>
                            <label className="flex items-center gap-2 mt-2.5 bg-white py-1.5 px-3 rounded-lg border border-amber-200 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={hasOrderBump}
                                onChange={(e) => setHasOrderBump(e.target.checked)}
                                className="text-brand-green focus:ring-brand-green h-4.5 w-4.5 rounded border-gray-300"
                              />
                              <span className="text-xs font-bold text-brand-green">¡Sí, lo agrego por solo $2.99 más!</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-1.5 text-base shadow-lg shadow-brand-green-vibrant/20 transition-colors duration-200 mt-4"
                      >
                        <span>GUARDAR Y PASAR AL PAGO</span>
                        <ArrowRight className="h-4 w-4 animate-pulse" />
                      </button>
                    </motion.form>
                  )}

                  {/* STEP 2: Payment Simulation */}
                  {checkoutStep === 'payment' && (
                    <motion.form 
                      key="step-payment"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={handleNextStep}
                      className="space-y-4"
                    >
                      {/* Price Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Despacho para:</p>
                          <strong className="text-gray-800 text-xs block truncate max-w-[200px]">{email}</strong>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Monto Final:</p>
                          <strong className="text-brand-green font-extrabold text-base">
                            US$ {hasOrderBump ? '12,89' : '9,90'}
                          </strong>
                        </div>
                      </div>

                      {/* Info warning */}
                      <div className="bg-emerald-50 text-emerald-800 text-[11px] p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <ShieldCheck className="h-4.5 w-4.5 text-brand-green shrink-0" />
                        <span>Visualización de Sandbox. Cualquier número de tarjeta simulado es válido.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">
                          Número de Tarjeta (Simulada)
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                          <input 
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="bg-white w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-800"
                            placeholder="4000 1234 5678 9010"
                            maxLength={19}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">
                            Vencimiento
                          </label>
                          <input 
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="bg-white w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-800 text-center"
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">
                            Código CVV
                          </label>
                          <input 
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="bg-white w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-800 text-center"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep('details')}
                          className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 px-4 rounded-xl font-bold text-sm transition"
                        >
                          Atrás
                        </button>
                        
                        <button
                          type="submit"
                          className="w-2/3 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-1 shadow-md shadow-brand-green-vibrant/20"
                        >
                          <Lock className="h-4 w-4" />
                          <span>PAGAR CON SEGURIDAD SSL</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* STEP 3: Loading Stripe style simulation */}
                  {checkoutStep === 'loading' && (
                    <motion.div 
                      key="step-loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 space-y-6"
                    >
                      <div className="relative h-20 w-20 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-brand-green border-t-transparent animate-spin" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-brand-green font-bold text-base uppercase tracking-widest">
                          Procesando Pago Seguro...
                        </p>
                        <p className="text-xs text-gray-500">
                          {checkoutProgress < 40 ? 'Sincronizando licencia médica...' : 
                           checkoutProgress < 75 ? 'Registrando correo del paciente en el servidor...' : 
                           'Generando tus enlaces de descarga PDF de alta resolución...'}
                        </p>
                        <p className="text-xs font-bold text-gray-400">
                          Progreso: {checkoutProgress}%
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Success, immediate download lounge! */}
                  {checkoutStep === 'success' && (
                    <motion.div 
                      key="step-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 pb-2"
                    >
                      <div className="text-center space-y-3 pb-4 border-b border-gray-100">
                        <div className="h-14 w-14 bg-emerald-100 text-brand-green rounded-full flex items-center justify-center mx-auto shadow-inner">
                          <CheckCircle2 className="h-8 w-8 stroke-[2.5px]" />
                        </div>
                        <h4 className="text-xl font-extrabold text-neutral-dark">
                          ¡Pago Aceptado con Éxito!
                        </h4>
                        <p className="text-xs text-gray-500 px-4">
                          Hola <strong>{fullName}</strong>, hemos enviado los accesos directos a <strong>{email}</strong>. También puedes descargarlos directamente a continuación:
                        </p>
                      </div>

                      {/* DOWNLOADABLE TILES LIST */}
                      <div className="space-y-3">
                        <div className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center hover:bg-green-50/20 shadow-sm transition">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-brand-green text-white rounded-lg flex items-center justify-center shrink-0">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-gray-800">1. Guía Médica Alimentaria</h5>
                              <p className="text-[10px] text-gray-400">PDF interactivo de Alta Resolución • 3.4 MB</p>
                            </div>
                          </div>
                          
                          <a 
                            href="javascript:void(0)" 
                            onClick={() => alert('¡Descarga Iniciada! Tu navegador está bajando la Guía de Alimentación GLP-1.')}
                            className="text-white bg-brand-green hover:bg-brand-green-hover font-bold text-xs p-2 rounded-lg"
                            title="Descargar Guía"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center hover:bg-green-50/20 shadow-sm transition">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-brand-green text-white rounded-lg flex items-center justify-center shrink-0">
                              <Utensils className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-gray-800">2. Recetario de Alta Proteína</h5>
                              <p className="text-[10px] text-gray-400">PDF interactivo • 2.8 MB • 35 Recetas</p>
                            </div>
                          </div>
                          
                          <a 
                            href="javascript:void(0)" 
                            onClick={() => alert('¡Descarga Iniciada! Bajando el Recetario Proteico GLP-1 con 35 platos de 15 minutos.')}
                            className="text-white bg-brand-green hover:bg-brand-green-hover font-bold text-xs p-2 rounded-lg"
                            title="Descargar Recetario"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center hover:bg-green-50/20 shadow-sm transition">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-700">
                              <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-gray-800">3. Lista de Supermercación</h5>
                              <p className="text-[10px] text-gray-400">Folleto Imprimible formato A4 • 1.1 MB</p>
                            </div>
                          </div>
                          
                          <a 
                            href="javascript:void(0)" 
                            onClick={() => alert('¡Descarga Iniciada! Bajando tu checklist de compras inteligentes.')}
                            className="text-white bg-brand-green hover:bg-brand-green-hover font-bold text-xs p-2 rounded-lg"
                            title="Descargar Folleto"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        {hasOrderBump && (
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 flex justify-between items-center hover:bg-white shadow-sm transition">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-amber-50 text-brand-gold border border-amber-200 rounded-lg flex items-center justify-center shrink-0">
                                <Flame className="h-5 w-5" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-brand-gold-dark">Bonus: Guía de Ayuno Seguro</h5>
                                <p className="text-[10px] text-brand-gold-dark opacity-80">PDF Módulo Exclusivo • 1.5 MB</p>
                              </div>
                            </div>
                            
                            <a 
                              href="javascript:void(0)" 
                              onClick={() => alert('¡Descarga Iniciada! Tu módulo bonus de ayuno médico ha comenzado a descargarse.')}
                              className="text-white bg-brand-gold hover:bg-brand-gold-dark font-bold text-xs p-2 rounded-lg"
                              title="Descargar Módulo de Ayuno"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Quick advice box */}
                      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs">
                        <strong className="text-emerald-900 block mb-1">Primer paso recomendado del médico:</strong>
                        <p className="text-emerald-700 leading-relaxed">
                          Abre el <strong>Recetario (Guía 2)</strong> y busca la receta <em>"Hachis de pavo y quinua de 15 min"</em>. Aporta 35 gramos de proteína limpia y es ideal para evitar náuseas digestivas.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`https://guiaglp1.com/access?token=sandbox_${email}`)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-3 px-3 rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>{isCopied ? '¡Enlace Copiado!' : 'Copiar Link de Acceso'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsCheckoutOpen(false);
                            setCheckoutStep('details');
                          }}
                          className="flex-1 bg-brand-green-vibrant hover:bg-brand-green-vibrant-hover text-white text-xs font-bold py-3 px-3 rounded-lg"
                        >
                          Terminar Simulación
                        </button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* SSL lock warning under scroll bottom */}
              {checkoutStep !== 'success' && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                  <Lock className="h-3 w-3" />
                  <span>TRANSMISIÓN DE DATOS ENCRIPTADA SSL DE 256 BITS</span>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Compact helper components
function XCloseIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
