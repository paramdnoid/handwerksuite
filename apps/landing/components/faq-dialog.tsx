'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
  Separator,
} from '@zunftgewerk/ui'
import { HelpCircle } from 'lucide-react'
import { faqs } from '@/content/faqs'

export function FaqDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent data-faq-dialog className="max-w-2xl gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset">
              <HelpCircle className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl font-bold tracking-tight">
                Häufig gestellte Fragen
              </DialogTitle>
              <DialogDescription>
                Finden Sie Antworten auf die wichtigsten Fragen rund um ZunftGewerk.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="max-h-[70vh] overflow-y-auto px-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="[&>svg]:text-muted-foreground py-4 text-sm font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Separator />

        <DialogFooter className="flex-row items-center justify-between px-6 py-4">
          <p className="text-muted-foreground text-xs">
            Weitere Fragen? Kontaktieren Sie unser{' '}
            <a href="#" className="text-primary font-medium underline-offset-4 hover:underline">
              Support-Team
            </a>
          </p>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Schließen
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
