import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@zunftgewerk/ui'
import { Check } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { trades } from '@/content/trades'

export function TradesSection() {
  return (
    <section id="trades" className="py-24 md:py-32" aria-labelledby="trades-heading">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            Branchenlösungen
          </Badge>
          <h2
            id="trades-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Für Ihr Gewerk optimiert
          </h2>
          <p className="text-muted-foreground text-lg">
            Branchenspezifische Funktionen, die genau auf Ihre Anforderungen zugeschnitten sind —
            kein unnötiger Ballast.
          </p>
        </FadeIn>

        <StaggerChildren
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          staggerDelay={0.12}
        >
          {trades.map((trade) => (
            <StaggerItem key={trade.name}>
              <Card className="group border-border/50 shadow-card hover:shadow-card-hover relative h-full min-h-70 overflow-hidden transition-all duration-500 active:scale-[0.98]">
                {/* Gradient top bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${trade.gradient} opacity-70 transition-all duration-300 group-hover:h-1 group-hover:opacity-100`}
                />
                <CardHeader className="pb-4">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${trade.iconBg} shadow-sm ring-1 ring-black/5 transition-transform duration-300 ring-inset group-hover:scale-110`}
                  >
                    <trade.icon className={`h-7 w-7 ${trade.iconColor}`} />
                  </div>
                  <CardTitle className="font-display text-xl">{trade.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {trade.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {trade.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
