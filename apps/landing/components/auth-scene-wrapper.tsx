'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const AuthScene = dynamic(() => import('@/components/auth-scene'), {
  ssr: false,
})

export function AuthSceneWrapper() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return <AuthScene />
}
