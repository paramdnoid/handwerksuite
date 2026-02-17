import type { Metadata } from 'next'
import { VerifyEmailContent } from '@/components/auth/verify-email-content'

export const metadata: Metadata = {
  title: 'E-Mail bestätigen',
  description: 'Bestätigen Sie Ihre E-Mail-Adresse für ZunftGewerk.',
}

export default function VerifizierenPage() {
  return <VerifyEmailContent />
}
