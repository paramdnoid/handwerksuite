import { ShieldCheck, Award, Building2, Palette, Thermometer, BadgeCheck } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'

const partners = [
  { name: 'Handwerkskammer', icon: Building2 },
  { name: 'ZVSHK', icon: Thermometer },
  { name: 'Bundesverband', icon: Award },
  { name: 'Malerverband', icon: Palette },
  { name: 'TÜV Zertifiziert', icon: ShieldCheck },
  { name: 'ISO 27001', icon: BadgeCheck },
] as const

export function SocialProofSection() {
  return (
    <section
      className="border-border/40 bg-background border-y py-10 md:py-14"
      aria-label="Partner und Vertrauen"
    >
      <div className="container mx-auto px-4">
        <FadeIn>
          <p className="text-muted-foreground/60 mb-8 text-center text-xs font-semibold tracking-[0.2em] uppercase">
            Vertraut von führenden Handwerksbetrieben und -verbänden
          </p>
        </FadeIn>
        <StaggerChildren
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10"
          staggerDelay={0.06}
        >
          {partners.map((partner) => (
            <StaggerItem key={partner.name}>
              <div className="border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/40 group flex items-center gap-2.5 rounded-lg border px-5 py-3 transition-all duration-300">
                <partner.icon className="text-muted-foreground/40 group-hover:text-muted-foreground/60 h-4 w-4 transition-colors duration-300" />
                <span className="font-display text-muted-foreground/50 group-hover:text-muted-foreground/70 text-xs font-bold tracking-wider uppercase transition-colors duration-300 md:text-sm">
                  {partner.name}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
