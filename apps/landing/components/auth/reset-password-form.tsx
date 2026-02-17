'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Label } from '@zunftgewerk/ui'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { PasswordInput } from './password-input'
import { resetPasswordSchema, getFieldErrors } from '@/lib/validations'
import { authClient } from '@zunftgewerk/auth/client'
import { fieldStagger } from '@/lib/stagger'
import { FieldError } from './field-error'

/* ------------------------------------------------------------------ */
/*  ResetPasswordForm                                                  */
/* ------------------------------------------------------------------ */

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Clean token from URL to prevent leaking in referrer headers
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [token])

  // No token — show error state
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`flex flex-col gap-1 ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">Ungültiger Link</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Dieser Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen. Bitte fordern
            Sie einen neuen Link an.
          </p>
        </div>
        <div className={fieldStagger(1)}>
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary/80 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Neuen Link anfordern
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const raw = {
      password: formData.get('password')?.toString() ?? '',
      confirmPassword: formData.get('confirm-password')?.toString() ?? '',
    }

    const result = resetPasswordSchema.safeParse(raw)
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error))
      setIsLoading(false)
      return
    }

    const { password } = result.data

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token!,
      })
      if (error) throw error
      setIsSuccess(true)
    } catch {
      setError('Passwort konnte nicht zurückgesetzt werden. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  /* Success state */
  if (isSuccess) {
    return (
      <div
        className="flex flex-col items-center gap-6 text-center"
        role="status"
        aria-live="polite"
      >
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
          <h1 className="font-display text-2xl font-bold tracking-tight">Passwort zurückgesetzt</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort
            anmelden.
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

  /* Form state */
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className={`flex flex-col items-center gap-1 text-center ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">Neues Passwort</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Legen Sie ein neues Passwort für Ihr Konto fest.
          </p>
        </div>

        {/* Animated error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="reset-error"
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

        {/* Neues Passwort */}
        <div className={`space-y-2 ${fieldStagger(1)}`}>
          <Label htmlFor="password">Neues Passwort</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Mindestens 8 Zeichen"
            required
            minLength={8}
            disabled={isLoading}
            showStrength
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'reset-pw-error' : undefined}
          />
          <FieldError message={fieldErrors.password} id="reset-pw-error" />
        </div>

        {/* Passwort bestaetigen */}
        <div className={`space-y-2 ${fieldStagger(2)}`}>
          <Label htmlFor="confirm-password">Passwort bestätigen</Label>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Passwort wiederholen"
            required
            minLength={8}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={fieldErrors.confirmPassword ? 'reset-confirm-error' : undefined}
          />
          <FieldError message={fieldErrors.confirmPassword} id="reset-confirm-error" />
        </div>

        {/* Submit */}
        <div className={fieldStagger(3)}>
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative h-11 w-full font-semibold transition-all duration-300 hover:shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
            Passwort ändern
          </Button>
        </div>

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
