import { Badge } from '@zunftgewerk/ui'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { steps } from '@/content/steps'

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            So funktioniert&apos;s
          </Badge>
          <h2
            id="how-it-works-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            In 3 Schritten zum digitalen Betrieb
          </h2>
          <p className="text-muted-foreground text-lg">
            Starten Sie in wenigen Minuten — ohne technisches Vorwissen.
          </p>
        </FadeIn>

        <StaggerChildren
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-12"
          staggerDelay={0.15}
        >
          {steps.map((item, index) => (
            <StaggerItem key={item.step}>
              <div className="relative text-center">
                {/* Connector line (desktop) — dashed */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="border-primary/20 absolute top-12 left-[calc(50%+3.5rem)] hidden h-px w-[calc(100%-7rem)] border-t border-dashed md:block"
                  />
                )}
                <div className="from-primary/10 shadow-card ring-primary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br to-primary/10 ring-1 ring-inset">
                  <span className="animate-gradient-x from-primary bg-linear-to-r to-amber-500 bg-clip-text text-3xl font-extrabold text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display mb-3 text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
