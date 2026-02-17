export interface Testimonial {
  name: string
  initials: string
  role: string
  company: string
  quote: string
  rating: number
  color: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Thomas Kirchner',
    initials: 'TK',
    role: 'Kaminfegermeister',
    company: 'Kirchner Kaminservice, München',
    quote:
      'Seit wir ZunftGewerk nutzen, sparen wir pro Woche fast einen ganzen Tag an Verwaltungsarbeit. Die Feuerstättenbescheid-Funktion allein hat sich schon am ersten Tag gelohnt.',
    rating: 5,
    color: 'bg-primary',
  },
  {
    name: 'Sandra Meier',
    initials: 'SM',
    role: 'Geschäftsführerin',
    company: 'Meier Malerbetrieb, Hamburg',
    quote:
      'Die GAEB-Schnittstelle und die automatische Aufmaßberechnung haben unsere Angebotsphase um die Hälfte verkürzt. Endlich eine Software, die für Maler gemacht ist.',
    rating: 5,
    color: 'bg-blue-500',
  },
  {
    name: 'Markus Bauer',
    initials: 'MB',
    role: 'SHK-Meister',
    company: 'Bauer Haustechnik, Berlin',
    quote:
      'Die Heizlastberechnung nach DIN EN 12831 direkt in der App zu haben, ist ein enormer Vorteil. Dazu die Offline-Funktion auf der Baustelle — genau das haben wir gesucht.',
    rating: 5,
    color: 'bg-cyan-500',
  },
]
