'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Input,
  Label,
  Checkbox,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
} from '@zunftgewerk/ui'
import { Loader2, ArrowRight } from 'lucide-react'
import { SocialProviders } from './social-providers'
import { PasswordInput } from './password-input'
import { useAuth } from '@zunftgewerk/app-core'
import { registerSchema, getFieldErrors, CRAFT_TYPE_OPTIONS } from '@/lib/validations'
import { fieldStagger } from '@/lib/stagger'
import { FieldError } from './field-error'

/* ------------------------------------------------------------------ */
/*  RegisterForm                                                       */
/* ------------------------------------------------------------------ */

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [craftType, setCraftType] = useState('')
  const router = useRouter()
  const { signUp } = useAuth()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const raw = {
      name: formData.get('name')?.toString() ?? '',
      companyName: formData.get('companyName')?.toString() ?? '',
      craftType,
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      terms: formData.get('terms') === 'on' ? (true as const) : (false as const),
    }

    const result = registerSchema.safeParse(raw)
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error))
      setIsLoading(false)
      return
    }

    const { name, companyName: _companyName, craftType: _selectedCraft, email, password } = result.data

    try {
      // Step 1: Create user account (Better Auth)
      await signUp(email, password, name)

      // Step 2: Create company via API (post-signup)
      // TODO: Call company.create tRPC endpoint with companyName + selectedCraft
      // This creates: Company + CompanySettings + CompanyMember (owner) + default modules

      router.push(`/verify?pending=true&email=${encodeURIComponent(email)}`)
    } catch {
      setError('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className={`flex flex-col items-center gap-1 text-center ${fieldStagger(0)}`}>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Konto erstellen
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Starten Sie jetzt mit ZunftGewerk
          </p>
        </div>

        {/* Animated error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="register-error"
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

        {/* Name */}
        <div className={`space-y-2 ${fieldStagger(1)}`}>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Max Mustermann"
            autoComplete="name"
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'reg-name-error' : undefined}
            className="focus:shadow-glow transition-shadow duration-200"
          />
          <FieldError message={fieldErrors.name} id="reg-name-error" />
        </div>

        {/* Firmenname */}
        <div className={`space-y-2 ${fieldStagger(2)}`}>
          <Label htmlFor="companyName">Firmenname</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Mustermann GmbH"
            autoComplete="organization"
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.companyName}
            aria-describedby={fieldErrors.companyName ? 'reg-company-error' : undefined}
            className="focus:shadow-glow transition-shadow duration-200"
          />
          <FieldError message={fieldErrors.companyName} id="reg-company-error" />
        </div>

        {/* Gewerk */}
        <div className={`space-y-2 ${fieldStagger(3)}`}>
          <Label htmlFor="craftType">Gewerk</Label>
          <Select
            value={craftType}
            onValueChange={setCraftType}
            disabled={isLoading}
          >
            <SelectTrigger
              id="craftType"
              aria-invalid={!!fieldErrors.craftType}
              aria-describedby={fieldErrors.craftType ? 'reg-craft-error' : undefined}
              className="focus:shadow-glow w-full transition-shadow duration-200"
            >
              <SelectValue placeholder="Bitte wählen…" />
            </SelectTrigger>
            <SelectContent>
              {CRAFT_TYPE_OPTIONS.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={fieldErrors.craftType} id="reg-craft-error" />
        </div>

        {/* E-Mail */}
        <div className={`space-y-2 ${fieldStagger(4)}`}>
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
            aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
            className="focus:shadow-glow transition-shadow duration-200"
          />
          <FieldError message={fieldErrors.email} id="reg-email-error" />
        </div>

        {/* Passwort */}
        <div className={`space-y-2 ${fieldStagger(5)}`}>
          <Label htmlFor="password">Passwort</Label>
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
            aria-describedby={fieldErrors.password ? 'reg-password-error' : undefined}
          />
          <FieldError message={fieldErrors.password} id="reg-password-error" />
        </div>

        {/* Terms checkbox */}
        <div className={fieldStagger(6)}>
          <div className="flex items-start gap-2.5">
            <Checkbox id="terms" name="terms" disabled={isLoading} className="mt-0.5 shrink-0" />
            <Label
              htmlFor="terms"
              className="block cursor-pointer text-sm leading-snug font-normal"
            >
              Ich stimme den{' '}
              <Link
                href="/imprint"
                className="hover:text-primary underline underline-offset-4 transition-colors"
              >
                AGB
              </Link>{' '}
              und der{' '}
              <Link
                href="/privacy"
                className="hover:text-primary underline underline-offset-4 transition-colors"
              >
                Datenschutzerklärung
              </Link>{' '}
              zu
            </Label>
          </div>
          <FieldError message={fieldErrors.terms} />
        </div>

        {/* Submit */}
        <div className={fieldStagger(7)}>
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
            Kostenlos registrieren
          </Button>
        </div>

        {/* Separator */}
        <div className={`relative ${fieldStagger(8)}`}>
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Oder weiter mit</span>
          </div>
        </div>

        {/* Social Providers */}
        <div className={fieldStagger(9)}>
          <SocialProviders disabled={isLoading} />
        </div>

        {/* Login link */}
        <p className={`text-muted-foreground text-center text-sm ${fieldStagger(10)}`}>
          Bereits ein Konto?{' '}
          <Link
            href="/login"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            Anmelden
          </Link>
        </p>
      </div>
    </form>
  )
}
