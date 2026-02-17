import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@zunftgewerk/ui'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://zunftgewerk.de'),
  title: {
    default: 'ZunftGewerk — Software für Kaminfeger, Maler & SHK-Betriebe',
    template: '%s | ZunftGewerk',
  },
  description:
    'Die All-in-One Handwerkersoftware. Digitalisieren Sie Ihren Betrieb von der Auftragsannahme bis zur Rechnung — spezialisiert für Kaminfeger, Maler und SHK.',
  keywords: [
    'Handwerkersoftware',
    'Kaminfeger Software',
    'Maler Software',
    'SHK Software',
    'Handwerk digitalisieren',
    'Auftragsmanagement Handwerk',
  ],
  openGraph: {
    title: 'ZunftGewerk — Die Handwerkersoftware, die mitdenkt',
    description:
      'Digitalisieren Sie Ihren Betrieb von der Auftragsannahme bis zur Rechnung. Für Kaminfeger, Maler & SHK-Betriebe.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'ZunftGewerk',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ZunftGewerk — Die Handwerkersoftware, die mitdenkt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZunftGewerk — Die Handwerkersoftware, die mitdenkt',
    description:
      'Digitalisieren Sie Ihren Betrieb von der Auftragsannahme bis zur Rechnung. Für Kaminfeger, Maler & SHK-Betriebe.',
    images: ['/opengraph-image.png'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZunftGewerk',
  url: 'https://zunftgewerk.de',
  logo: 'https://zunftgewerk.de/logo.png',
  description: 'Die All-in-One Handwerkersoftware für Kaminfeger, Maler und SHK-Betriebe.',
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`scroll-smooth ${inter.variable} ${jakarta.variable}`}>
      <body suppressHydrationWarning className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-elevated"
        >
          Zum Hauptinhalt springen
        </a>
        {children}
        <CookieConsent />
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  )
}
