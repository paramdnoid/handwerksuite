import {
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@zunftgewerk/ui'
import { Check } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { plans } from '@/content/pricing'

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            Preise
          </Badge>
          <h2
            id="pricing-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Transparente Preise, keine Überraschungen
          </h2>
          <p className="text-muted-foreground text-lg">
            Alle Pläne beinhalten Updates und Grundfunktionen. Jederzeit kündbar.
          </p>
        </FadeIn>

        <StaggerChildren className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3" staggerDelay={0.1}>
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <Card
                className={`relative flex h-full flex-col transition-all duration-500 ${
                  plan.popular
                    ? 'border-primary from-primary/8 via-primary/3 shadow-elevated scale-[1.02] border-2 bg-linear-to-b to-transparent lg:scale-105'
                    : 'border-border/50 shadow-card hover:shadow-card-hover'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="from-primary bg-linear-to-r to-amber-500 px-4 py-1 text-xs font-semibold text-white">
                      Beliebteste Option
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    {plan.price ? (
                      <>
                        <span className="font-display text-5xl font-extrabold tracking-tight">
                          &euro;{plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm">/ Monat</span>
                      </>
                    ) : (
                      <span className="font-display text-muted-foreground text-3xl font-bold tracking-tight">
                        Individuell
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-semibold ${
                      plan.popular
                        ? 'from-primary bg-linear-to-r to-amber-500 text-white transition-all hover:brightness-110'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.3}>
          <p className="text-muted-foreground mt-10 text-center text-sm">
            Alle Preise zzgl. MwSt. 30 Tage kostenlos testen — keine Kreditkarte erforderlich.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
