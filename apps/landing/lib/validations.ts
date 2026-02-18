import { z } from 'zod'
import { CRAFT_TYPE_INFO } from '@zunftgewerk/types'
import { MIN_PASSWORD_LENGTH, OTP_CODE_LENGTH } from './constants'

/* ------------------------------------------------------------------ */
/*  Craft Type Options (derived from shared types package)             */
/* ------------------------------------------------------------------ */

export const CRAFT_TYPE_OPTIONS = Object.values(CRAFT_TYPE_INFO).map((info) => ({
  value: info.value,
  label: info.label,
}))

/* ------------------------------------------------------------------ */
/*  Shared field schemas                                               */
/* ------------------------------------------------------------------ */

const emailField = z
  .string()
  .min(1, 'E-Mail ist erforderlich.')
  .email('Bitte geben Sie eine gültige E-Mail-Adresse ein.')

const passwordField = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`,
  )

const nameField = z
  .string()
  .min(1, 'Name ist erforderlich.')
  .max(100, 'Name darf maximal 100 Zeichen lang sein.')

const companyNameField = z
  .string()
  .min(1, 'Firmenname ist erforderlich.')
  .max(200, 'Firmenname darf maximal 200 Zeichen lang sein.')

const craftTypeField = z
  .string()
  .min(1, 'Bitte wählen Sie Ihr Gewerk aus.')

/* ------------------------------------------------------------------ */
/*  Form schemas                                                       */
/* ------------------------------------------------------------------ */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Passwort ist erforderlich.'),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: nameField,
  companyName: companyNameField,
  craftType: craftTypeField,
  email: emailField,
  password: passwordField,
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Bitte stimmen Sie den AGB und der Datenschutzerklärung zu.' }),
  }),
})
export type RegisterFormData = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: emailField,
})
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Passwortbestätigung ist erforderlich.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  })
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(OTP_CODE_LENGTH, `Der Code muss ${OTP_CODE_LENGTH} Zeichen lang sein.`)
    .regex(/^\d+$/, 'Der Code darf nur Ziffern enthalten.'),
})
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>

/* ------------------------------------------------------------------ */
/*  Account form schemas                                               */
/* ------------------------------------------------------------------ */

export const updateCompanySchema = z.object({
  name: z.string().min(1, 'Firmenname ist erforderlich.').max(255),
  legalName: z.string().max(255).optional(),
  craftType: z.string().min(1, 'Gewerk ist erforderlich.'),
})
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>

export const updateTaxDataSchema = z.object({
  taxId: z.string().max(50).optional(),
  vatId: z.string().max(50).optional(),
  hwkNumber: z.string().max(50).optional(),
})
export type UpdateTaxDataFormData = z.infer<typeof updateTaxDataSchema>

export const updateCompanySettingsSchema = z.object({
  locale: z.string().min(1),
  timezone: z.string().min(1),
  currency: z.string().min(1),
  defaultTaxRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Ungültiger Steuersatz.'),
  invoicePrefix: z.string().max(20).optional(),
  fiscalYearStartMonth: z.coerce.number().int().min(1).max(12),
})
export type UpdateCompanySettingsFormData = z.infer<typeof updateCompanySettingsSchema>

export const inviteMemberSchema = z.object({
  email: emailField,
  role: z.enum(['admin', 'manager', 'employee', 'readonly'], {
    errorMap: () => ({ message: 'Bitte wählen Sie eine Rolle.' }),
  }),
})
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Aktuelles Passwort ist erforderlich.'),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, 'Passwortbestätigung ist erforderlich.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  })
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(['admin', 'manager', 'employee', 'readonly']),
})
export type UpdateMemberRoleFormData = z.infer<typeof updateMemberRoleSchema>

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getFirstZodError(error: z.ZodError): string {
  const first = error.errors[0]
  return first?.message ?? 'Validierung fehlgeschlagen.'
}

export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.errors) {
    const key = issue.path.join('.')
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}
