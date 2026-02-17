import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Passwort vergessen',
  description: 'Setzen Sie Ihr ZunftGewerk-Passwort zurück.',
}

export default function PasswortVergessenPage() {
  return <ForgotPasswordForm />
}
