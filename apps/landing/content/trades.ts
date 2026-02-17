import { Flame, Paintbrush, Droplet, type LucideIcon } from 'lucide-react'

export interface Trade {
  icon: LucideIcon
  name: string
  gradient: string
  iconBg: string
  iconColor: string
  description: string
  features: string[]
}

export const trades: Trade[] = [
  {
    icon: Flame,
    name: 'Kaminfeger',
    gradient: 'from-primary to-primary/60',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    description: 'Kehrbezirke digital verwalten, Prüfprotokolle erstellen und Messgeräte anbinden.',
    features: [
      'Kehrbezirksverwaltung',
      'Feuerstättenbescheid-Funktion',
      'Digitale Prüfprotokolle',
      'Messgeräte-Anbindung',
      'Automatische Terminerinnerungen',
    ],
  },
  {
    icon: Paintbrush,
    name: 'Maler & Tapezierer',
    gradient: 'from-primary to-primary/60',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    description: 'Aufmaße berechnen, GAEB-Ausschreibungen importieren und Material kalkulieren.',
    features: [
      'Aufmaßberechnung (m²-Preise)',
      'GAEB-Schnittstelle',
      'DATANORM-Integration',
      'Digitale Baustellenmappen',
      'Materialkalkulation',
    ],
  },
  {
    icon: Droplet,
    name: 'Sanitär, Heizung, Klima',
    gradient: 'from-primary to-primary/60',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    description: 'Heizlast nach DIN berechnen, Wartungsverträge managen und Großhändler anbinden.',
    features: [
      'Heizlastberechnung DIN EN 12831',
      'Wartungsverträge',
      'Großhändler-Anbindung (IDS, UGL)',
      'Digitale Serviceberichte',
      'Ersatzteil-Verwaltung',
    ],
  },
]
