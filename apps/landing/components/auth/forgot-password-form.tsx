'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Label } from '@zunftgewerk/ui'
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react'
import { forgotPasswordSchema, getFirstZodError } from '@/lib/validations'
import { authClient } from '@zunftgewerk/auth/client'
import { fieldStagger } from '@/lib/stagger'

/* ------------------------------------------------------------------ */
/*  ForgotPasswordForm                                                 */
/* ------------------------------------------------------------------ */

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const raw = { email: formData.get('email')?.toString() ?? '' }

    const result = forgotPasswordSchema.safeParse(raw)
    if (!result.success) {
      setError(getFirstZodError(result.error))
      setIsLoading(false)
      return
    }

    setEmail(result.data.email)

    try {
      const { error } = await (authClient as any).forgetPassword({
        email: result.data.email,
        redirectTo: '/reset-password',
      })
      if (error) throw error
      setIsSubmitted(true)
    } catch {
      setError('Anfrage fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  /* Success state */
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`relative ${fieldStagger(0)}`}>
          <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
            <MailCheck className="text-primary size-6" />
          </div>
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute -inset-2 -z-10 rounded-full blur-lg"
          />
        </div>
        <div className={`flex flex-col gap-1 ${fieldStagger(1)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">E-Mail gesendet</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Wir haben einen Link zum Zurücksetzen Ihres Passworts an{' '}
            <span className="text-foreground font-medium">{email}</span> gesendet.
          </p>
        </div>
        <p className={`text-muted-foreground text-center text-sm ${fieldStagger(2)}`}>
          Keine E-Mail erhalten?{' '}
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            Erneut senden
          </button>
        </p>
        <div className={fieldStagger(3)}>
          <Link
            href="/login"
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  /* Form state */
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className={`flex flex-col items-center gap-1 text-center ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight">Passwort vergessen?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
          </p>
        </div>

        {/* Animated error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="forgot-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* E-Mail */}
        <div className={`space-y-2 ${fieldStagger(1)}`}>
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@beispiel.de"
            autoComplete="email"
            required
            disabled={isLoading}
            className="focus:shadow-glow transition-shadow duration-200"
          />
        </div>

        {/* Submit */}
        <div className={fieldStagger(2)}>
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
            Link senden
          </Button>
        </div>

        {/* Back link */}
        <div className={`flex justify-center ${fieldStagger(3)}`}>
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
