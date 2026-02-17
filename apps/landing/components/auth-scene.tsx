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
/*  Lighter wave grid — optimised for auth side-panel                  */
/* ------------------------------------------------------------------ */

function WaveGrid() {
  const meshRef = useRef<Mesh>(null)
  const meshRef2 = useRef<Mesh>(null)

  const segments = 40
  const size = 18

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
        Math.sin(ox * 0.35 + time * 0.35) * 0.35 +
        Math.cos(oy * 0.3 + time * 0.25) * 0.25 +
        Math.sin((ox + oy) * 0.2 + time * 0.2) * 0.15

      positions.setZ(i, z)
    }
    positions.needsUpdate = true

    if (meshRef2.current) {
      const positions2 = meshRef2.current.geometry.getAttribute('position') as THREE.BufferAttribute

      for (let i = 0; i < positions2.count; i++) {
        const ox = originalPositions[i * 3]!
        const oy = originalPositions[i * 3 + 1]!

        const z =
          Math.sin(ox * 0.35 + time * 0.35 + 1.5) * 0.25 +
          Math.cos(oy * 0.3 + time * 0.25 + 1.0) * 0.2 +
          Math.sin((ox + oy) * 0.2 + time * 0.2 + 2.0) * 0.1

        positions2.setZ(i, z)
      }
      positions2.needsUpdate = true
    }
  })

  return (
    <>
      <mesh ref={meshRef} rotation={[-0.6, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[size, size, segments, segments]} />
        <meshBasicMaterial
          color={BRAND_PRIMARY}
          wireframe
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={meshRef2} rotation={[-0.58, 0, 0]} position={[0, -1.8, -1.2]}>
        <planeGeometry args={[size, size, segments, segments]} />
        <meshBasicMaterial
          color={BRAND_PRIMARY}
          wireframe
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Canvas                                                             */
/* ------------------------------------------------------------------ */

export default function AuthScene() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 3.5, 7], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <WaveGrid />
        </Suspense>
      </Canvas>
    </div>
  )
}
