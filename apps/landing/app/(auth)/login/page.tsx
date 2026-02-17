import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Anmelden',
  description: 'Melden Sie sich bei Ihrem ZunftGewerk-Konto an.',
}

export default function AnmeldenPage() {
  return <LoginForm />
}
