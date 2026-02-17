import { Button } from '@zunftgewerk/ui'
import { HelpCircle } from 'lucide-react'
import { FadeIn } from '@/components/fade-in'
import { FaqDialog } from '@/components/faq-dialog'

export function FaqSection() {
  return (
    <section id="faq" className="bg-muted/30 py-16 md:py-20" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 text-center">
        <FadeIn className="mx-auto max-w-xl">
          <HelpCircle className="text-primary/60 mx-auto mb-4 h-10 w-10" />
          <h2
            id="faq-heading"
            className="font-display mb-3 text-2xl font-bold tracking-tight md:text-3xl"
          >
            Haben Sie Fragen?
          </h2>
          <p className="text-muted-foreground mb-6">
            Finden Sie Antworten auf die häufigsten Fragen zu ZunftGewerk.
          </p>
          <FaqDialog>
            <Button variant="outline" size="lg" className="font-semibold">
              FAQ anzeigen
            </Button>
          </FaqDialog>
        </FadeIn>
      </div>
    </section>
  )
}
