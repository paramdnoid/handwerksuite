import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@zunftgewerk/ui'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { FadeIn } from '@/components/fade-in'

const socialLinks = [
  { href: 'https://github.com/zunftgewerk', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com/company/zunftgewerk', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com/zunftgewerk', label: 'Twitter', icon: Twitter },
] as const

const productLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Preise' },
  { href: '#trades', label: 'Branchenlösungen' },
  { href: '#faq', label: 'FAQ' },
] as const

const supportLinks = [
  { href: 'mailto:support@zunftgewerk.de', label: 'Kontakt' },
  { href: '/docs', label: 'Dokumentation' },
  { href: '/changelog', label: 'Changelog' },
] as const

const legalLinks = [
  { href: '/imprint', label: 'Impressum' },
  { href: '/privacy', label: 'Datenschutz' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-border/40 bg-muted/30 border-t" aria-label="Fußbereich">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <FadeIn>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="mb-4 inline-flex items-center gap-3" aria-label="ZunftGewerk — Zur Startseite">
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg font-extrabold tracking-tight">
                    Zunft
                    <span className="text-foreground/45 font-extrabold">Gewerk</span>
                  </span>
                  <span className="text-foreground/40 text-[11px] font-medium tracking-[0.15em]">
                    Handwerk. Digital.
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
                Die All-in-One Software für Kaminfeger, Maler und SHK-Betriebe. DSGVO-konform und
                made in Germany.
              </p>
              {/* Social icons */}
              <div className="mt-5 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                    aria-label={`${social.label} (öffnet in neuem Tab)`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <nav aria-label="Produkt-Links">
              <h4 className="mb-4 text-sm font-semibold">Produkt</h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover-underline hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Support */}
            <nav aria-label="Support-Links">
              <h4 className="mb-4 text-sm font-semibold">Support</h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover-underline hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal */}
            <nav aria-label="Rechtliches">
              <h4 className="mb-4 text-sm font-semibold">Rechtliches</h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover-underline hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Separator className="my-8 opacity-50" />

          <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">
            <p>&copy; {currentYear} ZunftGewerk GmbH. Alle Rechte vorbehalten.</p>
            <p className="flex items-center gap-1.5">
              Made with Sorgfalt in Deutschland
              <span aria-label="Deutsche Flagge" role="img" className="text-xs">
                &#x1F1E9;&#x1F1EA;
              </span>
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
