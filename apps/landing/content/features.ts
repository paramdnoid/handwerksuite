import {
  Smartphone,
  Monitor,
  Cloud,
  PenLine,
  Camera,
  Clock,
  Receipt,
  CalendarDays,
  WifiOff,
  type LucideIcon,
} from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'iOS & Android für unterwegs — Aufträge, Fotos und Unterschriften direkt vor Ort.',
  },
  {
    icon: Monitor,
    title: 'Desktop App',
    description: 'Native Apps für Windows, macOS und Linux mit voller Funktionalität.',
  },
  {
    icon: Cloud,
    title: 'Cloud-Sync',
    description: 'Automatische Synchronisation — Ihre Daten sind immer aktuell und verfügbar.',
  },
  {
    icon: PenLine,
    title: 'Digitale Unterschrift',
    description: 'Rechtssichere elektronische Signatur direkt beim Kunden vor Ort.',
  },
  {
    icon: Camera,
    title: 'Fotodokumentation',
    description: 'Bilder aufnehmen und automatisch dem richtigen Auftrag zuordnen.',
  },
  {
    icon: Clock,
    title: 'Zeiterfassung',
    description: 'Digitale Stundenzettel mit GPS-Zuordnung und Projektverknüpfung.',
  },
  {
    icon: Receipt,
    title: 'Rechnungswesen',
    description: 'Von Angebot über Auftragsbestätigung bis zur Rechnung — alles in einem System.',
  },
  {
    icon: CalendarDays,
    title: 'Terminplanung',
    description: 'Digitale Plantafel, Kalender und automatische Kundenerinnerungen.',
  },
  {
    icon: WifiOff,
    title: 'Offline-Modus',
    description:
      'Volle Funktionalität auch ohne Internet — Daten werden automatisch synchronisiert.',
  },
]
