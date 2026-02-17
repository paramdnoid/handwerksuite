import { StaggerChildren, StaggerItem, AnimatedCounter } from '@/components/fade-in'
import { stats } from '@/content/stats'

export function StatsSection() {
  return (
    <section className="bg-muted/30 relative" aria-label="Statistiken">
      {/* Top fade — seamless blend from hero */}
      <div
        aria-hidden="true"
        className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b to-transparent"
      />
      <div className="bg-dot-pattern absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-20">
        <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12" staggerDelay={0.08}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group text-center">
                <div className="bg-primary/8 ring-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset transition-all duration-300 group-hover:bg-primary/12 group-hover:ring-primary/20">
                  <stat.icon className="text-primary h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="font-display text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground mt-1.5 text-sm font-medium">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
