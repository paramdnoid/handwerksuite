'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Label } from '@zunftgewerk/ui'
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { RESEND_COOLDOWN_SECONDS, OTP_CODE_LENGTH } from '@/lib/constants'
import { twoFactorSchema, getFirstZodError } from '@/lib/validations'
import { authClient } from '@zunftgewerk/auth/client'
import { fieldStagger } from '@/lib/stagger'

/* ------------------------------------------------------------------ */
/*  TwoFactorForm                                                      */
/* ------------------------------------------------------------------ */

export function TwoFactorForm() {
  const searchParams = useSearchParams()
  const twoFactorToken = searchParams.get('t')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpValue, setOtpValue] = useState('')
  const [cooldown, setCooldown] = useState(0)

  // Clean the token from the URL for security (prevent leaking in referrer)
  useEffect(() => {
    if (twoFactorToken && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('t')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [twoFactorToken])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleComplete = useCallback(
    async (value: string) => {
      if (value.length !== OTP_CODE_LENGTH) return

      const result = twoFactorSchema.safeParse({ code: value })
      if (!result.success) {
        setError(getFirstZodError(result.error))
        return
      }

      setIsLoading(true)
      setError(null)

      if (!twoFactorToken) {
        setError('Sitzung abgelaufen. Bitte erneut anmelden.')
        setIsLoading(false)
        return
      }

      try {
        const { error } = await authClient.twoFactor.verifyTotp({ code: value })
        if (error) throw error
        window.location.href = '/dashboard'
      } catch {
        setError('Code ungültig. Bitte versuchen Sie es erneut.')
        setOtpValue('')
      } finally {
        setIsLoading(false)
      }
    },
    [twoFactorToken],
  )

  // No token available — show error
  if (!twoFactorToken) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`flex flex-col gap-1 ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">Sitzung abgelaufen</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Bitte melden Sie sich erneut an, um den Zwei-Faktor-Code einzugeben.
          </p>
        </div>
        <div className={fieldStagger(1)}>
          <Link
            href="/login"
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return
    if (otpValue.length !== OTP_CODE_LENGTH) return
    await handleComplete(otpValue)
  }

  function handleResend() {
    setCooldown(RESEND_COOLDOWN_SECONDS)
    setError(null)
    setOtpValue('')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6">
        {/* Header with icon */}
        <div className={`flex flex-col items-center gap-4 text-center ${fieldStagger(0)}`}>
          <div className="relative">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
              <ShieldCheck className="text-primary size-6" />
            </div>
            <div
              aria-hidden="true"
              className="bg-primary/10 absolute -inset-2 -z-10 rounded-full blur-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Zwei-Faktor-Authentifizierung
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.
            </p>
          </div>
        </div>

        {/* Animated error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="2fa-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              role="alert"
              aria-live="assertive"
            >
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Input */}
        <div className={`space-y-2 ${fieldStagger(1)}`}>
          <Label htmlFor="otp-code" className="sr-only">
            Zwei-Faktor-Code
          </Label>
          <Input
            id="otp-code"
            value={otpValue}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, OTP_CODE_LENGTH)
              setOtpValue(val)
              if (val.length === OTP_CODE_LENGTH) {
                handleComplete(val)
              }
            }}
            placeholder="000000"
            maxLength={OTP_CODE_LENGTH}
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={isLoading}
            className="focus:shadow-glow text-center text-2xl tracking-[0.5em] font-mono transition-shadow duration-200"
            aria-label="Zwei-Faktor-Code"
          />
        </div>

        {/* Submit */}
        <div className={fieldStagger(2)}>
          <Button
            type="submit"
            disabled={isLoading || otpValue.length !== OTP_CODE_LENGTH}
            className="group relative h-11 w-full font-semibold transition-all duration-300 hover:shadow-lg"
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Bestätigen
          </Button>
        </div>

        {/* Resend */}
        <p className={`text-muted-foreground text-center text-sm ${fieldStagger(3)}`}>
          Keinen Code erhalten?{' '}
          {cooldown > 0 ? (
            <span className="text-muted-foreground tabular-nums" aria-live="polite">
              Erneut senden in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
            >
              Code erneut senden
            </button>
          )}
        </p>

        {/* Back link */}
        <div className={`flex justify-center ${fieldStagger(4)}`}>
          <Link
            href="/login"
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </form>
  )
}
