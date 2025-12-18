import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { calcLaminarVelocity, type FormulaTerms } from '@/lib/laminar-formula'

export function LaminarFlowSimulation({
  radius,
  pressure,
  viscosity,
  length,
  showVectors,
  terms,
}: {
  radius: number[]
  pressure: number[]
  viscosity: number[]
  length: number[]
  showVectors: boolean
  terms: FormulaTerms
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const particlesRef = useRef<Array<{ x: number; y: number; r: number }>>([])

  useEffect(() => {
    particlesRef.current = Array.from({ length: 1000 }, () => ({
      x: Math.random() * 800,
      y: (Math.random() - 0.5) * 2 * radius[0],
      r: (Math.random() - 0.5) * radius[0],
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const centerX = width / 2

      ctx.clearRect(0, 0, width, height)

      const R = radius[0]
      const dP = pressure[0]
      const mu = viscosity[0]
      const L = length[0]

      const pipePx = Math.max(2, (L / 100) * (width * 0.9))
      const pipeX0 = centerX - pipePx / 2
      const pipeX1 = centerX + pipePx / 2

      const vScale = 150 / ((100 * 100 * 100) / (4 * 1 * 100)) * 2

      // Draw Pipe Walls
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(pipeX0, centerY - R)
      ctx.lineTo(pipeX1, centerY - R)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(pipeX0, centerY + R)
      ctx.lineTo(pipeX1, centerY + R)
      ctx.stroke()

      // Fluid
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(pipeX0, centerY - R, pipePx, R * 2)

      // Particles
      ctx.fillStyle = '#f87171'
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 1000 }, () => ({
          x: pipeX0 + Math.random() * pipePx,
          y: 0,
          r: (Math.random() * 2 - 1) * R,
        }))
      }

      particlesRef.current.forEach((p) => {
        if (Math.abs(p.r) > R) p.r = (Math.sign(p.r) || 1) * Math.random() * R
        const r = p.r

        const vRaw = calcLaminarVelocity({ dP, R, r, mu, L, vScale, terms }) * 0.1
        const v = Math.min(vRaw, 50)

        p.x += v
        if (p.x > pipeX1) {
          p.x = pipeX0 + ((p.x - pipeX1) % pipePx)
          p.r = (Math.random() * 2 - 1) * R
        }
        if (p.x < pipeX0) {
          p.x = pipeX1 - ((pipeX0 - p.x) % pipePx)
        }

        const y = centerY + r
        ctx.beginPath()
        ctx.arc(p.x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Velocity profile overlay
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()

      const step = 2
      const startX = pipeX0 + Math.min(20, pipePx * 0.2)
      const maxVX = Math.max(5, pipeX1 - startX - 5)

      for (let r = -R; r <= R; r += step) {
        const vRaw = calcLaminarVelocity({ dP, R, r, mu, L, vScale, terms })
        const v = Math.min(vRaw, maxVX)
        const x = startX + v
        const y = centerY + r
        if (r === -R) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      if (showVectors) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
        ctx.lineWidth = 1
        const rStep = 10
        for (let r = -R + 5; r < R; r += rStep) {
          const vRaw = calcLaminarVelocity({ dP, R, r, mu, L, vScale, terms })
          const v = Math.min(vRaw, maxVX)
          const x = startX + v
          const y = centerY + r

          ctx.beginPath()
          ctx.moveTo(startX, y)
          ctx.lineTo(x, y)
          ctx.stroke()

          if (v > 5 && pipePx > 30) {
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x - 5, y - 2)
            ctx.lineTo(x - 5, y + 2)
            ctx.fill()
          }
        }
      }

      // Centerline
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = '#999'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pipeX0, centerY)
      ctx.lineTo(pipeX1, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [radius, pressure, viscosity, length, showVectors, terms])

  return (
    <Card>
      <CardContent className="p-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg bg-gray-50 border border-gray-300"
        />
      </CardContent>
    </Card>
  )
}


