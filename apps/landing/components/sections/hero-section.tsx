import { Button, Badge } from '@zunftgewerk/ui'
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  HeartHandshake,
  ChevronDown,
  Play,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroSceneWrapper } from '@/components/hero-scene-wrapper'
import { FadeIn } from '@/components/fade-in'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden" aria-labelledby="hero-heading">
      {/* 3D Background — desktop only */}
      <HeroSceneWrapper />

      {/* Gradient orbs for mobile fallback + extra depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="animate-glow-pulse bg-primary/7 absolute -top-40 right-1/4 h-125 w-125 rounded-full blur-[100px]" />
        <div className="animate-glow-pulse absolute -bottom-32 left-1/4 h-100 w-100 rounded-full bg-primary/6 blur-[100px] [animation-delay:2s]" />
        <div className="animate-glow-pulse absolute top-1/3 left-1/2 h-75 w-75 -translate-x-1/2 rounded-full bg-primary/4 blur-[80px] [animation-delay:1s]" />
      </div>

      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-20">
        {/* Overlapping grid: text col-1, image col-1+2, text on top via z-index */}
        <div className="grid w-full items-center lg:grid-cols-[1fr_1.2fr]">
          {/* Text content — sits on top */}
          <div className="relative z-10 text-center lg:text-left">
            <FadeIn delay={0.1} duration={0.5}>
              <Badge
                variant="secondary"
                className="border-primary/15 bg-primary/5 text-foreground mb-8 inline-flex gap-2 border px-5 py-2 text-sm font-medium backdrop-blur-sm"
              >
                <Sparkles className="text-primary h-3.5 w-3.5" />
                Für Kaminfeger, Maler & SHK-Betriebe
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2} duration={0.7}>
              <h1
                id="hero-heading"
                className="hero-text-gloss font-display mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              >
                Die Handwerkersoftware,{' '}
                <span className="hero-text-gloss-accent animate-gradient-x from-primary bg-linear-to-r via-primary/80 to-amber-500 bg-clip-text text-transparent">
                  die mitdenkt
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.35} duration={0.6}>
              <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-balance md:text-xl lg:mx-0">
                Digitalisieren Sie Ihren Betrieb von der Auftragsannahme bis zur Rechnung.
                Spezialisiert für Ihr Gewerk — auf jedem Gerät, auch offline.
              </p>
            </FadeIn>

            <FadeIn delay={0.5} duration={0.5}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="from-primary h-13 w-full gap-2 bg-linear-to-r to-amber-500 px-8 text-base font-semibold text-white transition-all hover:brightness-110 sm:w-auto"
                  asChild
                >
                  <Link href="/register">
                    30 Tage kostenlos testen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full gap-2 px-8 text-base font-medium backdrop-blur-sm sm:w-auto"
                  asChild
                >
                  <Link href="#features">
                    <Play className="h-4 w-4" />
                    Demo ansehen
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Trust indicators */}
            <FadeIn delay={0.65} duration={0.5}>
              <div className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-sm lg:justify-start">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="text-primary h-4 w-4" />
                  DSGVO-konform
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-2">
                  <Zap className="text-primary h-4 w-4" />
                  Keine Kreditkarte nötig
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-2">
                  <HeartHandshake className="text-primary h-4 w-4" />
                  Persönlicher Support
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Product mockup with 3D perspective — overlaps into text column */}
          <FadeIn delay={0.5} duration={0.7}>
            <div className="relative mx-auto mt-12 w-full max-w-xl perspective-[600px] lg:mt-0 lg:-ml-24 lg:max-w-none lg:origin-center lg:scale-110">
              <div className="group relative transform-[rotateY(-14deg)_rotateX(5deg)] transition-transform duration-700 ease-out hover:transform-[rotateY(-4deg)_rotateX(2deg)]">
                <div className="border-border/50 from-muted/50 to-muted/20 shadow-elevated overflow-hidden rounded-xl border bg-linear-to-b p-1 transform-3d">
                  <Image
                    src="/desktop-light.jpeg"
                    alt="Zunftgewerk Dashboard-Vorschau"
                    width={1920}
                    height={1080}
                    priority
                    className="rounded-lg"
                  />
                </div>
                {/* 3D edge highlight — left side catches the light */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-px w-px bg-linear-to-b from-transparent via-white/25 to-transparent"
                />
              </div>
              {/* Decorative glow behind mockup */}
              <div
                aria-hidden="true"
                className="from-primary/10 absolute -inset-4 -z-10 translate-x-2 translate-y-2 rounded-2xl bg-linear-to-r via-primary/5 to-transparent blur-2xl"
              />
              {/* Soft ground reflection */}
              <div
                aria-hidden="true"
                className="bg-primary/5 absolute inset-x-8 -bottom-8 -z-10 h-16 rounded-full blur-2xl"
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom fade — soft transition into next section */}
      <div
        aria-hidden="true"
        className="from-background via-background/80 pointer-events-none absolute inset-x-0 -bottom-32 z-10 h-96 bg-linear-to-t from-10% via-40% to-transparent"
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce md:block" aria-hidden="true">
        <ChevronDown className="text-muted-foreground/50 h-5 w-5" />
      </div>
    </section>
  )
}
