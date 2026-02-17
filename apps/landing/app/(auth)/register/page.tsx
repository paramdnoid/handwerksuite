import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Registrieren',
  description: 'Erstellen Sie Ihr ZunftGewerk-Konto und starten Sie kostenlos.',
}

export default function RegistrierenPage() {
  return <RegisterForm />
}
