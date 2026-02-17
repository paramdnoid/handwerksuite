'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Brand color                                                        */
/* ------------------------------------------------------------------ */

const BRAND_PRIMARY = '#f97316'

/* ------------------------------------------------------------------ */
/*  Animated Wireframe Grid                                            */
/* ------------------------------------------------------------------ */

function WaveGrid({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<Mesh>(null)
  const meshRef2 = useRef<Mesh>(null)

  const segments = 60
  const size = 22

  const originalPositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    const attr = geo.getAttribute('position') as THREE.BufferAttribute
    const copy = new Float32Array(attr.array.length)
    copy.set(attr.array)
    geo.dispose()
    return copy
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.elapsedTime
    const positions = meshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute

    for (let i = 0; i < positions.count; i++) {
      const ox = originalPositions[i * 3]!
      const oy = originalPositions[i * 3 + 1]!

      const z =
        Math.sin(ox * 0.35 + time * 0.4) * 0.4 +
        Math.cos(oy * 0.3 + time * 0.3) * 0.3 +
        Math.sin((ox + oy) * 0.2 + time * 0.25) * 0.2

      positions.setZ(i, z)
    }
    positions.needsUpdate = true

    if (meshRef2.current) {
      const positions2 = meshRef2.current.geometry.getAttribute('position') as THREE.BufferAttribute

      for (let i = 0; i < positions2.count; i++) {
        const ox = originalPositions[i * 3]!
        const oy = originalPositions[i * 3 + 1]!

        const z =
          Math.sin(ox * 0.35 + time * 0.4 + 1.5) * 0.3 +
          Math.cos(oy * 0.3 + time * 0.3 + 1.0) * 0.25 +
          Math.sin((ox + oy) * 0.2 + time * 0.25 + 2.0) * 0.15

        positions2.setZ(i, z)
      }
      positions2.needsUpdate = true
    }

    if (mouse.current) {
      const targetRotX = -0.55 + mouse.current.y * 0.06
      const targetRotY = mouse.current.x * 0.08

      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.02
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.02

      if (meshRef2.current) {
        meshRef2.current.rotation.x += (targetRotX - 0.02 - meshRef2.current.rotation.x) * 0.015
        meshRef2.current.rotation.y += (targetRotY - meshRef2.current.rotation.y) * 0.015
      }
    }
  })

  return (
    <>
      <mesh ref={meshRef} rotation={[-0.55, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[size, size, segments, segments]} />
        <meshBasicMaterial
          color={BRAND_PRIMARY}
          wireframe
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={meshRef2} rotation={[-0.53, 0, 0]} position={[0, -2.2, -1.5]}>
        <planeGeometry args={[size, size, segments, segments]} />
        <meshBasicMaterial
          color={BRAND_PRIMARY}
          wireframe
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Canvas Wrapper                                                     */
/* ------------------------------------------------------------------ */

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 })

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto' }}
        onPointerMove={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
          mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        }}
      >
        <Suspense fallback={null}>
          <WaveGrid mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
