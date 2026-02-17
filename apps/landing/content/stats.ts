import { Building2, FileText, Star, Clock, type LucideIcon } from 'lucide-react'

export interface Stat {
  value: number
  suffix: string
  label: string
  icon: LucideIcon
}

export const stats: Stat[] = [
  { value: 500, suffix: '+', label: 'Handwerksbetriebe', icon: Building2 },
  { value: 50000, suffix: '+', label: 'Rechnungen erstellt', icon: FileText },
  { value: 98, suffix: '%', label: 'Kundenzufriedenheit', icon: Star },
  { value: 30, suffix: '%', label: 'Zeitersparnis', icon: Clock },
]
