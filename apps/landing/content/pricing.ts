export interface Plan {
  name: string
  price: string | null
  description: string
  features: string[]
  popular: boolean
  cta: string
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    price: '49',
    description: 'Perfekt für Einzelunternehmer und Kleinbetriebe.',
    features: [
      'Bis zu 50 Kunden',
      '100 Projekte / Jahr',
      '1 Benutzer',
      'Mobile App',
      'E-Mail-Support',
    ],
    popular: false,
    cta: 'Plan wählen',
  },
  {
    name: 'Professional',
    price: '99',
    description: 'Für wachsende Betriebe mit mehreren Mitarbeitern.',
    features: [
      'Unbegrenzte Kunden',
      'Unbegrenzte Projekte',
      'Bis zu 5 Benutzer',
      'Mobile + Desktop App',
      'Prioritäts-Support',
      'API-Zugang',
    ],
    popular: true,
    cta: 'Jetzt starten',
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Für große Unternehmen mit individuellen Anforderungen.',
    features: [
      'Alles aus Professional',
      'Unbegrenzte Benutzer',
      'Dedizierter Account-Manager',
      'Custom Integrationen',
      'On-Premise Option',
      'SLA-Garantie (99,9%)',
    ],
    popular: false,
    cta: 'Kontaktieren Sie uns',
  },
]
