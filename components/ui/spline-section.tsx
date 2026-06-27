'use client'

import { motion, useReducedMotion } from 'motion/react'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'

/**
 * Branded recreation of the 21st.dev "Interactive 3D" Spline component.
 * Adapted to the wellness brand palette (deep green + gold) with a
 * framer-motion entrance and reduced-motion support (UI/UX Pro Max:
 * accessibility + motion-meaning + brand consistency).
 */
export function SplineSceneBasic() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <Card className="w-full h-[420px] md:h-[500px] border-white/10 bg-gradient-to-br from-green-950 via-green-900 to-[#0D3320] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#D97706"
        />

        <div className="flex flex-col md:flex-row h-full">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-10 relative z-10 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium text-green-200">
              Tu transformación, en 3D
            </span>
            <h2 className="font-display mt-4 text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-green-200">
              No solo pierdes peso.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-brand-gold">
                Reconstruyes tu cuerpo.
              </span>
            </h2>
            <p className="mt-4 text-green-100/90 max-w-md text-base md:text-lg leading-relaxed">
              Mientras el GLP-1 reduce la grasa, nuestro protocolo de nutrición
              anabólica protege y construye el músculo que te mantiene fuerte,
              firme y con energía.
            </p>
          </div>

          {/* Right content — interactive 3D scene */}
          <div className="flex-1 relative min-h-[220px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
