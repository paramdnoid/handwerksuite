'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const HeroScene = dynamic(() => import('@/components/hero-scene'), {
  ssr: false,
})

export function HeroSceneWrapper() {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return <HeroScene />
}
