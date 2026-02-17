'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, CheckCircle2, XCircle, Mail, AlertTriangle } from 'lucide-react'
import { Button, Alert, AlertDescription } from '@zunftgewerk/ui'
import { authClient } from '@zunftgewerk/auth/client'
import { fieldStagger } from '@/lib/stagger'

/* ------------------------------------------------------------------ */
/*  VerifyEmailContent                                                 */
/* ------------------------------------------------------------------ */

type Status = 'loading' | 'success' | 'error' | 'no-token' | 'pending'

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const pending = searchParams.get('pending') === 'true'
  const email = searchParams.get('email')
  const emailSent = searchParams.get('emailSent') !== 'false'

  const initialStatus: Status = token ? 'loading' : pending ? 'pending' : 'no-token'
  const [status, setStatus] = useState<Status>(initialStatus)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const didVerify = useRef(false)

  // Clean token from URL after reading
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.pathname + url.search)
    }
  }, [token])

  useEffect(() => {
    if (!token || didVerify.current) return
    didVerify.current = true

    async function verify() {
      try {
        const { error } = await authClient.verifyEmail({ query: { token: token! } })
        if (error) throw error
        setStatus('success')
      } catch {
        setErrorMessage('E-Mail-Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.')
        setStatus('error')
      }
    }

    verify()
  }, [token])

  async function handleResend() {
    if (!email) return
    setResending(true)
    setResendSuccess(false)
    try {
      const { error } = await authClient.sendVerificationEmail({ email })
      if (error) throw error
      setResendSuccess(true)
    } catch {
      setErrorMessage('E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.')
    } finally {
      setResending(false)
    }
  }

  /* Pending — user just registered, check your email */
  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`relative ${fieldStagger(0)}`}>
          <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
            <Mail className="text-primary size-6" />
          </div>
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute -inset-2 -z-10 rounded-full blur-lg"
          />
        </div>
        <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">E-Mail bestätigen</h1>
          {emailSent ? (
            <p className="text-muted-foreground text-sm text-balance">
              Wir haben eine Bestätigungs-E-Mail an{' '}
              {email ? <strong className="text-foreground">{email}</strong> : 'Ihre E-Mail-Adresse'}{' '}
              gesendet. Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertTriangle className="size-4" />
                <AlertDescription>Die Bestätigungs-E-Mail konnte nicht gesendet werden.</AlertDescription>
              </Alert>
              <p className="text-muted-foreground text-sm text-balance">
                Bitte versuchen Sie es erneut über den Button unten.
              </p>
            </div>
          )}
        </div>
        <div className={`flex flex-col items-center gap-3 ${fieldStagger(2)}`}>
          {emailSent && (
            <p className="text-muted-foreground text-xs text-balance">
              Keine E-Mail erhalten? Prüfen Sie Ihren Spam-Ordner oder fordern Sie eine neue E-Mail
              an.
            </p>
          )}
          <Button variant="outline" size="sm" onClick={handleResend} disabled={resending}>
            {resending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Mail className="mr-2 size-4" />
            )}
            Neue Bestätigungs-E-Mail senden
          </Button>
          {resendSuccess && (
            <p className="text-sm text-green-600" role="status" aria-live="polite">
              Bestätigungs-E-Mail wurde erneut gesendet!
            </p>
          )}
        </div>
        <div className={fieldStagger(3)}>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  /* No token */
  if (status === 'no-token') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`relative ${fieldStagger(0)}`}>
          <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
            <XCircle className="text-destructive size-6" />
          </div>
        </div>
        <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">Ungültiger Link</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Dieser Bestätigungslink ist ungültig. Bitte verwenden Sie den Link aus Ihrer E-Mail.
          </p>
        </div>
        <div className={fieldStagger(2)}>
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  /* Loading */
  if (status === 'loading') {
    return (
      <div
        className="flex flex-col items-center gap-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div className={fieldStagger(0)}>
          <Loader2 className="text-primary size-10 animate-spin" aria-hidden="true" />
        </div>
        <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">E-Mail wird bestätigt</h1>
          <p className="text-muted-foreground text-sm">Bitte warten...</p>
        </div>
      </div>
    )
  }

  /* Error */
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-6 text-center" role="alert">
        <div className={`relative ${fieldStagger(0)}`}>
          <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
            <XCircle className="text-destructive size-6" />
          </div>
          <div
            aria-hidden="true"
            className="bg-destructive/10 absolute -inset-2 -z-10 rounded-full blur-lg"
          />
        </div>
        <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Bestätigung fehlgeschlagen
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {errorMessage || 'Der Bestätigungslink ist ungültig oder abgelaufen.'}
          </p>
        </div>
        <div className={`flex flex-col items-center gap-3 ${fieldStagger(2)}`}>
          <Button variant="outline" size="sm" onClick={handleResend} disabled={resending}>
            {resending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Neue Bestätigungs-E-Mail senden
          </Button>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  /* Success */
  return (
    <div className="flex flex-col items-center gap-6 text-center" role="status" aria-live="polite">
      <div className={`relative ${fieldStagger(0)}`}>
        <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-6 text-green-500" />
        </div>
        <div
          aria-hidden="true"
          className="absolute -inset-2 -z-10 rounded-full bg-green-500/10 blur-lg"
        />
      </div>
      <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
        <h1 className="font-display text-2xl font-bold tracking-tight">E-Mail bestätigt</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.
        </p>
      </div>
      <div className={fieldStagger(2)}>
        <Link
          href="/login"
          className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          Zur Anmeldung
        </Link>
      </div>
    </div>
  )
}
