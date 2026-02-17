import type { Metadata } from 'next'
import { TwoFactorForm } from '@/components/auth/two-factor-form'

export const metadata: Metadata = {
  title: 'Zwei-Faktor-Authentifizierung',
  description: 'Bestätigen Sie Ihre Identität mit einem Zwei-Faktor-Code.',
}

export default function ZweiFaktorPage() {
  return <TwoFactorForm />
}
