import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { AuthSceneWrapper } from '@/components/auth-scene-wrapper'
import { ShieldCheck, Zap, HeartHandshake } from 'lucide-react'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      {/* Mobile-only ambient background (since right panel is hidden) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
      >
        <div className="animate-glow-pulse bg-primary/5 absolute -top-32 right-0 h-96 w-96 rounded-full blur-[100px]" />
        <div className="animate-glow-pulse absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/4 blur-[80px] [animation-delay:2s]" />
      </div>

      {/* Left: Form area */}
      <div className="relative flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <FadeIn delay={0.05} duration={0.4} direction="none">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ZunftGewerk Logo"
                width={32}
                height={32}
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                priority
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight">
                  Zunft<span className="text-foreground/45 font-extrabold">Gewerk</span>
                </span>
              </div>
            </Link>
          </div>
        </FadeIn>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <FadeIn delay={0.15} duration={0.6}>
              {children}
            </FadeIn>
          </div>
        </div>

        {/* Footer links */}
        <FadeIn delay={0.3} duration={0.4} direction="none">
          <div className="text-muted-foreground flex justify-center gap-4 text-xs md:justify-start">
            <Link href="/imprint" className="hover:text-foreground transition-colors">
              Impressum
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Datenschutz
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Right: Hero panel (hidden on mobile) */}
      <div className="bg-muted relative hidden overflow-hidden lg:block">
        {/* 3D wireframe wave grid — same style as landing hero */}
        <AuthSceneWrapper />

        {/* Layered background effects */}
        <div className="from-primary/10 via-primary/5 absolute inset-0 bg-linear-to-br to-transparent" />

        {/* Animated gradient orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-glow-pulse bg-primary/8 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-[80px]" />
          <div className="animate-glow-pulse absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/6 blur-[80px] [animation-delay:2s]" />
          <div className="animate-glow-pulse absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/5 blur-[60px] [animation-delay:1s]" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center gap-8 p-12">
          <FadeIn delay={0.2} duration={0.7} direction="none">
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Logo icon with glow */}
              <div className="relative">
                <div className="bg-primary/10 flex size-16 items-center justify-center rounded-2xl backdrop-blur-sm">
                  <Image
                    src="/logo.png"
                    alt="ZunftGewerk"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="bg-primary/15 absolute -inset-3 -z-10 rounded-3xl blur-xl"
                />
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  Handwerk.{' '}
                  <span className="animate-gradient-x from-primary bg-linear-to-r via-primary/80 to-amber-500 bg-clip-text text-transparent">
                    Digital.
                  </span>
                </h2>
                <p className="text-muted-foreground max-w-xs text-sm leading-relaxed text-balance">
                  Die All-in-One Software für Kaminfeger, Maler und SHK-Betriebe. Digitalisieren Sie
                  Ihren Betrieb von der Auftragsannahme bis zur Rechnung.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Trust badges */}
          <StaggerChildren staggerDelay={0.1} delay={0.5} className="mt-4">
            <div className="flex flex-col gap-3">
              {[
                { icon: ShieldCheck, label: 'DSGVO-konform & sicher' },
                { icon: Zap, label: 'Sofort startklar — keine Installation' },
                { icon: HeartHandshake, label: 'Persönlicher Support inklusive' },
              ].map(({ icon: Icon, label }) => (
                <StaggerItem key={label}>
                  <div className="text-muted-foreground flex items-center gap-3 text-sm">
                    <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
                      <Icon className="text-primary size-4" />
                    </div>
                    {label}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </div>
    </div>
  )
}
