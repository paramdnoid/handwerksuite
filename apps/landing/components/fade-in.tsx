'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variant,
} from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  FadeIn — scroll-triggered entrance animation                       */
/* ------------------------------------------------------------------ */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const directionVariants: Record<Direction, { hidden: Variant; visible: Variant }> = {
  up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

interface FadeInProps {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
}

export function FadeIn({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.15,
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={directionVariants[direction]}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  StaggerChildren — staggered entrance for grids / lists             */
/* ------------------------------------------------------------------ */

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
  once?: boolean
  amount?: number
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
  once = true,
  amount = 0.1,
}: StaggerChildrenProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  AnimatedCounter — spring-based number animation                    */
/* ------------------------------------------------------------------ */

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const prefersReducedMotion = useReducedMotion()
  const spring = useSpring(0, { duration: prefersReducedMotion ? 0 : duration * 1000, bounce: 0 })
  const rounded = useTransform(spring, (v) => Math.round(v))
  const [display, setDisplay] = useState(prefersReducedMotion ? target : 0)

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(target)
      return
    }
    if (isInView) spring.set(target)
  }, [isInView, spring, target, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return
    return rounded.on('change', (v) => setDisplay(v))
  }, [rounded, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('de-DE')}
      {suffix}
    </span>
  )
}
