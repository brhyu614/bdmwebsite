'use client'

import { useEffect, useRef } from 'react'

const KEYWORDS = [
  'AI Prediction', 'Causal Inference', 'Consumer Behavior',
  'XGBoost', 'LightGBM', 'SHAP', 'Deep Learning',
  'Revenue Forecasting', 'Demand Prediction',
  'LLM Multi-Agent', 'Big Data Analytics',
  'Natural Language Processing', 'Sentiment Analysis',
  'A/B Testing', 'DID', 'Instrumental Variables',
  'Platform Algorithm', 'Recommendation System',
  'Social Commerce', 'Digital Marketing',
  'Feature Importance', 'Ensemble Model',
  'Time Series', 'Panel Data', 'Econometrics',
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  text: string
  opacity: number
  size: number
}

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    particlesRef.current = KEYWORDS.map((text) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      text,
      opacity: 0.08 + Math.random() * 0.12,
      size: 11 + Math.random() * 5,
    }))

    const animate = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)

      const particles = particlesRef.current

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(76, 158, 235, ${0.03 * (1 - dist / 200)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(76, 158, 235, ${p.opacity * 2})`
        ctx.fill()

        // Draw text
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`
        ctx.fillStyle = `rgba(76, 158, 235, ${p.opacity})`
        ctx.fillText(p.text, p.x + 6, p.y + 4)

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce
        if (p.x < 0 || p.x > cw) p.vx *= -1
        if (p.y < 0 || p.y > ch) p.vy *= -1
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
    />
  )
}
