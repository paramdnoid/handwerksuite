import { FadeIn } from '@/components/fade-in'
import { partnerLogos } from '@/content/partners'

export function SocialProofSection() {
  return (
    <section
      className="border-border/40 bg-background border-y py-10 md:py-12"
      aria-label="Partner und Vertrauen"
    >
      <div className="container mx-auto px-4">
        <FadeIn>
          <p className="text-muted-foreground/60 mb-8 text-center text-xs font-semibold tracking-[0.2em] uppercase">
            Vertraut von führenden Handwerksbetrieben und -verbänden
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
            {partnerLogos.map((logo) => (
              <span
                key={logo}
                className="border-border/40 bg-muted/30 font-display text-muted-foreground/40 hover:border-border/60 hover:text-muted-foreground/60 inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 md:text-sm"
              >
                {logo}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
