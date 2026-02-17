import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen',
  description: 'Legen Sie ein neues Passwort für Ihr ZunftGewerk-Konto fest.',
}

export default function PasswortZuruecksetzenPage() {
  return <ResetPasswordForm />
}
