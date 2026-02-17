import { Badge, Card, CardContent, CardHeader, Separator, Avatar, AvatarFallback } from '@zunftgewerk/ui'
import { Star } from 'lucide-react'
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/fade-in'
import { testimonials } from '@/content/testimonials'

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-24 md:py-32" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <Badge variant="outline" className="mb-4">
            Kundenstimmen
          </Badge>
          <h2
            id="testimonials-heading"
            className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            Das sagen unsere Kunden
          </h2>
          <p className="text-muted-foreground text-lg">
            Über 500 Handwerksbetriebe vertrauen bereits auf ZunftGewerk.
          </p>
        </FadeIn>

        <StaggerChildren className="grid gap-8 lg:grid-cols-3" staggerDelay={0.1}>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.name}>
              <Card className="border-border/50 bg-background shadow-card hover:shadow-card-hover flex h-full flex-col transition-all duration-500">
                <CardHeader className="pb-4">
                  {/* Quote mark */}
                  <div className="text-primary/30 mb-2 font-serif text-3xl leading-none">
                    &ldquo;
                  </div>
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{testimonial.quote}</p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-3">
                    <Avatar className={`${testimonial.color} shadow-sm`}>
                      <AvatarFallback className={`${testimonial.color} text-xs font-bold text-white`}>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
