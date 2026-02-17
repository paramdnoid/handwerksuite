import { Button } from '@zunftgewerk/ui'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/fade-in'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="cta-heading">
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-primary)_8%,transparent)_0%,transparent_70%)]" />
        <div className="animate-glow-pulse bg-primary/6 absolute top-1/2 left-1/4 h-100 w-100 -translate-y-1/2 rounded-full blur-[100px]" />
        <div className="animate-glow-pulse absolute top-1/2 right-1/4 h-88 w-88 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] [animation-delay:2s]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <FadeIn>
          <h2
            id="cta-heading"
            className="font-display mb-6 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
          >
            Bereit, Ihren Betrieb zu{' '}
            <span className="animate-gradient-x from-primary bg-linear-to-r via-primary/80 to-amber-500 bg-clip-text text-transparent">
              digitalisieren
            </span>
            ?
          </h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-xl text-lg">
            Starten Sie noch heute mit ZunftGewerk — 30 Tage kostenlos, ohne Risiko.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="from-primary h-13 w-full gap-2 bg-linear-to-r to-amber-500 px-8 text-base font-semibold text-white transition-all hover:brightness-110 sm:w-auto"
            >
              Kostenlos testen
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 w-full px-8 text-base font-medium sm:w-auto"
            >
              Beratungsgespräch buchen
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
