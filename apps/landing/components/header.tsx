'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@zunftgewerk/ui'
import { Menu, X } from 'lucide-react'
import { FaqDialog } from '@/components/faq-dialog'
import { HEADER_SCROLL_THRESHOLD, SCROLL_THROTTLE_MS } from '@/lib/constants'

const navLinks = [
  { href: '#trades', label: 'Gewerke' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Preise' },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const rafId = useRef<number>(0)
  const lastScrollTime = useRef(0)

  const handleScroll = useCallback(() => {
    const now = performance.now()
    if (now - lastScrollTime.current < SCROLL_THROTTLE_MS) {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD)
        lastScrollTime.current = performance.now()
      })
      return
    }
    lastScrollTime.current = now
    setScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD)
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close mobile menu on escape
  useEffect(() => {
    if (!mobileOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Close on route change (anchor click)
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-out',
        scrolled || mobileOpen
          ? 'border-border/20 bg-background/60 border-b shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
      role="banner"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="ZunftGewerk — Zur Startseite">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight">
              Zunft<span className="text-foreground/45 font-extrabold">Gewerk</span>
            </span>
            <span className="text-foreground/40 hidden text-[11px] font-medium tracking-[0.15em] sm:block">
              Handwerk. Digital.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground after:bg-primary relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <FaqDialog>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground after:bg-primary relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              FAQ
            </button>
          </FaqDialog>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="font-medium" asChild>
            <Link href="/account">Mein Konto</Link>
          </Button>
          <Button variant="ghost" size="sm" className="font-medium" asChild>
            <Link href="/login">Anmelden</Link>
          </Button>
          <Button
            size="sm"
            className="transition-all"
            asChild
          >
            <Link href="/register">Kostenlos testen</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          <span className="relative h-5 w-5">
            <Menu className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${mobileOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
            <X className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${mobileOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-navigation"
        className={[
          'border-border/20 bg-background/98 border-t backdrop-blur-xl md:hidden',
          'transition-all duration-300 ease-out',
          mobileOpen
            ? 'max-h-[80vh] opacity-100'
            : 'pointer-events-none max-h-0 overflow-hidden opacity-0',
        ].join(' ')}
        aria-label="Mobile Navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              tabIndex={mobileOpen ? 0 : -1}
              className="hover:bg-accent active:bg-accent/80 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <FaqDialog>
            <button
              type="button"
              onClick={closeMobile}
              tabIndex={mobileOpen ? 0 : -1}
              className="hover:bg-accent active:bg-accent/80 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors"
            >
              FAQ
            </button>
          </FaqDialog>
          <div className="border-border/20 mt-3 flex flex-col gap-2 border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" tabIndex={mobileOpen ? 0 : -1}>Anmelden</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/register" tabIndex={mobileOpen ? 0 : -1}>Kostenlos testen</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
