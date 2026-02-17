import { Flame, Paintbrush, Droplet, type LucideIcon } from 'lucide-react'

export interface Trade {
  icon: LucideIcon
  name: string
  gradient: string
  iconBg: string
  iconColor: string
  checkColor: string
  description: string
  features: string[]
}

export const trades: Trade[] = [
  {
    icon: Flame,
    name: 'Kaminfeger',
    gradient: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    checkColor: 'text-orange-500',
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
    gradient: 'from-indigo-500 to-violet-500',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
    checkColor: 'text-indigo-500',
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
    gradient: 'from-cyan-500 to-teal-500',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
    checkColor: 'text-cyan-500',
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
