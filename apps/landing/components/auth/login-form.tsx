'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Label, Checkbox, Separator, Alert, AlertDescription } from '@zunftgewerk/ui'
import { Loader2, ArrowRight } from 'lucide-react'
import { SocialProviders } from './social-providers'
import { PasswordInput } from './password-input'
import { useAuth } from '@zunftgewerk/app-core'
import { loginSchema, getFieldErrors } from '@/lib/validations'
import { fieldStagger } from '@/lib/stagger'
import { FieldError } from './field-error'

/* ------------------------------------------------------------------ */
/*  LoginForm                                                          */
/* ------------------------------------------------------------------ */

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { signIn } = useAuth()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const raw = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    }

    const result = loginSchema.safeParse(raw)
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error))
      setIsLoading(false)
      return
    }

    const { email, password } = result.data

    try {
      await signIn(email, password)
      router.push('/account')
    } catch {
      setError('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className={`flex flex-col items-center gap-1 text-center ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Willkommen zurück
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Melden Sie sich mit Ihrem Konto an
          </p>
        </div>

        {/* Animated error banner */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id="login-error-msg"
              key="login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-live="assertive"
            >
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
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
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'login-email-error' : error ? 'login-error-msg' : undefined}
            className="focus:shadow-glow transition-shadow duration-200"
          />
          <FieldError message={fieldErrors.email} id="login-email-error" />
        </div>

        {/* Passwort */}
        <div className={`space-y-2 ${fieldStagger(2)}`}>
          <div className="flex items-center">
            <Label htmlFor="password">Passwort</Label>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground ml-auto text-sm underline-offset-4 transition-colors hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Ihr Passwort"
            required
            minLength={8}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          />
          <FieldError message={fieldErrors.password} id="login-password-error" />
        </div>

        {/* Remember me */}
        <div className={`flex items-center gap-2 ${fieldStagger(3)}`}>
          <Checkbox id="remember-me" name="remember-me" disabled={isLoading} />
          <Label htmlFor="remember-me" className="cursor-pointer text-sm font-normal">
            Angemeldet bleiben
          </Label>
        </div>

        {/* Submit */}
        <div className={fieldStagger(4)}>
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
            Anmelden
          </Button>
        </div>

        {/* Separator */}
        <div className={`relative ${fieldStagger(5)}`}>
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Oder weiter mit</span>
          </div>
        </div>

        {/* Social Providers */}
        <div className={fieldStagger(6)}>
          <SocialProviders disabled={isLoading} />
        </div>

        {/* Register link */}
        <p className={`text-muted-foreground text-center text-sm ${fieldStagger(7)}`}>
          Noch kein Konto?{' '}
          <Link
            href="/register"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            Registrieren
          </Link>
        </p>
      </div>
    </form>
  )
}
