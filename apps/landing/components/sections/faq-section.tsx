import {
  Badge,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@zunftgewerk/ui'
import { FadeIn } from '@/components/fade-in'
import { faqs } from '@/content/faqs'

export function FaqSection() {
  return (
    <section id="faq" className="bg-muted/30 relative py-24 md:py-32" aria-labelledby="faq-heading">
      <div className="bg-dot-pattern absolute inset-0 opacity-15" aria-hidden="true" />
      <div className="relative container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2
            id="faq-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Häufig gestellte Fragen
          </h2>
          <p className="text-muted-foreground text-lg">
            Finden Sie Antworten auf die wichtigsten Fragen rund um ZunftGewerk.
          </p>
        </FadeIn>

        <FadeIn className="mx-auto max-w-3xl">
          <div className="bg-background shadow-card rounded-2xl border p-1">
            <Accordion type="single" collapsible className="px-4 md:px-6">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="border-border/50"
                >
                  <AccordionTrigger className="[&>svg]:text-muted-foreground py-5 text-left text-sm font-semibold hover:no-underline md:text-base [&>svg]:h-4 [&>svg]:w-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed md:text-base md:leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-muted-foreground mt-10 text-center text-sm">
            Weitere Fragen?{' '}
            <a
              href="mailto:support@zunftgewerk.de"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Kontaktieren Sie unser Support-Team
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
