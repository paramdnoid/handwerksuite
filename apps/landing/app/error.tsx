'use client'

import { useEffect } from 'react'
import { Button } from '@zunftgewerk/ui'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { reportError } from '@/lib/errors'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    reportError(error, {
      boundary: 'page',
      digest: error.digest,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }, [error])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
        <span className="text-destructive text-2xl font-bold" aria-hidden="true">
          !
        </span>
      </div>

      <h2 className="font-display mb-3 text-xl font-bold tracking-tight md:text-2xl">
        Etwas ist schiefgelaufen
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kehren Sie zur
        Startseite zurück.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={reset} size="lg" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Erneut versuchen
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zur Startseite
          </Link>
        </Button>
      </div>

      {error.digest && (
        <p className="text-muted-foreground/60 mt-6 text-xs">Fehler-ID: {error.digest}</p>
      )}
    </div>
  )
}
