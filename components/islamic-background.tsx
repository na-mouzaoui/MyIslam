'use client'

import { useEffect, useRef } from 'react'

function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    >
      <path d="M20 20 H80 V80 H20 Z" />
      <path d="M50 5 L95 50 L50 95 L5 50 Z" />
    </svg>
  )
}

const FLOATERS = [
  { top: '10%', left: '8%', size: 68, opacity: 0.14, delay: '0s', duration: '19s' },
  { top: '22%', left: '82%', size: 52, opacity: 0.12, delay: '1.5s', duration: '23s' },
  { top: '68%', left: '14%', size: 84, opacity: 0.10, delay: '3s', duration: '26s' },
  { top: '78%', left: '72%', size: 60, opacity: 0.13, delay: '0.8s', duration: '21s' },
  { top: '45%', left: '48%', size: 44, opacity: 0.08, delay: '2.2s', duration: '28s' },
  { top: '58%', left: '90%', size: 40, opacity: 0.10, delay: '4s', duration: '24s' },
]

export function IslamicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const patternRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const starRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const container = containerRef.current

    const handleDown = (e: PointerEvent) => {
      if (!container) return
      const ring = document.createElement('span')
      ring.style.position = 'absolute'
      ring.style.left = `${e.clientX}px`
      ring.style.top = `${e.clientY}px`
      ring.style.width = '16px'
      ring.style.height = '16px'
      ring.style.borderRadius = '9999px'
      ring.style.border = '2px solid rgba(16, 185, 129, 0.55)'
      ring.style.pointerEvents = 'none'
      ring.style.willChange = 'transform, opacity'
      container.appendChild(ring)

      ring.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.7 },
          { transform: 'translate(-50%, -50%) scale(24)', opacity: 0 },
        ],
        { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      ).onfinish = () => ring.remove()
    }

    window.addEventListener('pointerdown', handleDown, { passive: true })

    if (reduced) {
      return () => window.removeEventListener('pointerdown', handleDown)
    }

    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0
    let raf = 0
    const start = performance.now()

    const handleMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5
      targetY = e.clientY / window.innerHeight - 0.5
    }

    const loop = (now: number) => {
      curX += (targetX - curX) * 0.06
      curY += (targetY - curY) * 0.06

      const t = now - start
      const driftX = Math.sin(t * 0.00013) * 16
      const driftY = Math.cos(t * 0.00011) * 16

      if (patternRef.current) {
        patternRef.current.style.transform = `translate3d(${curX * 40 + driftX}px, ${curY * 40 + driftY}px, 0)`
      }
      if (overlayRef.current) {
        overlayRef.current.style.transform = `translate3d(${curX * -60 - driftX}px, ${curY * -60 - driftY}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(-50%, -50%) translate3d(${curX * 160}px, ${curY * 160}px, 0)`
      }
      if (starRef.current) {
        starRef.current.style.transform = `translate(-50%, -50%) translate3d(${curX * 90}px, ${curY * 90}px, 0)`
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Slowly drifting geometric tiling */}
      <div ref={patternRef} className="islamic-pattern absolute -inset-[20%] will-change-transform" />

      {/* Counter-moving white overlay for depth */}
      <div
        ref={overlayRef}
        className="pattern-overlay absolute -inset-[20%] opacity-[0.07] will-change-transform dark:opacity-[0.05]"
      />

      {/* Rotating khatim mandala */}
      <div
        ref={starRef}
        className="absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 text-emerald-600/10 will-change-transform dark:text-emerald-400/10"
      >
        <div className="h-full w-full animate-spin-slow">
          <Star className="h-full w-full" />
        </div>
      </div>

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl will-change-transform dark:bg-emerald-400/10"
      />

      {/* Floating stars */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute text-emerald-700 dark:text-emerald-300"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `float ${f.duration} ease-in-out ${f.delay} infinite`,
          }}
        >
          <Star className="h-full w-full" />
        </div>
      ))}
    </div>
  )
}
