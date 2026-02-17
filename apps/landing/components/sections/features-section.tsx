import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@zunftgewerk/ui'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { features } from '@/content/features'

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-muted/30 relative py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="bg-dot-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            Funktionen
          </Badge>
          <h2
            id="features-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Alles, was Ihr Betrieb braucht
          </h2>
          <p className="text-muted-foreground text-lg">
            Eine Software für alle Prozesse — von der Auftragsannahme über die mobile Dokumentation
            bis zur Rechnungsstellung.
          </p>
        </FadeIn>

        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className="group border-border/50 bg-background shadow-card hover:shadow-card-hover h-full transition-all duration-500">
                <CardHeader>
                  <div className="bg-primary/10 ring-primary/20 group-hover:bg-primary/15 group-hover:ring-primary/30 group-hover:shadow-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ring-1 transition-all duration-300 group-hover:shadow-md">
                    <feature.icon className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle className="font-display text-base font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
