import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { calcLaminarVelocity, type FormulaTerms } from '@/lib/laminar-formula'

const DEFAULT_TERMS: FormulaTerms = {
  pressure: true,
  constant: true,
  viscosity: true,
  length: true,
  radiusScale: true,
  profile: true,
}

export function PulsatileFlowSimulation({
  withSteadyFlow = false,
  radius = 100,
  pressure = 100,
  viscosity = 10,
  length = 50,
  period = 1.5,
  amplitude = 1,
  terms = DEFAULT_TERMS,
}: {
  withSteadyFlow?: boolean
  radius?: number
  pressure?: number
  viscosity?: number
  length?: number
  period?: number
  amplitude?: number
  terms?: FormulaTerms
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const particlesRef = useRef<Array<{ x: number; y: number; r: number }>>([])
  const timeRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    // Initialize particles once
    particlesRef.current = Array.from({ length: 800 }, () => ({
      x: Math.random() * (canvasRef.current?.width ?? 900),
      y: (Math.random() - 0.5) * 2 * radius,
      r: (Math.random() - 0.5) * 2 * radius,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parentWidth = canvas.parentElement?.clientWidth ?? 900
      const width = Math.max(360, Math.min(parentWidth, 1200))
      const height = 520 
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      // Update global time
      timeRef.current = (timeRef.current + dt) % period
      const t = timeRef.current

      const width = canvas.width
      const height = canvas.height
      const centerY = 160 
      const centerX = width / 2

      ctx.clearRect(0, 0, width, height)

      const pipePx = width * 0.9
      const pipeX0 = centerX - pipePx / 2
      const pipeX1 = centerX + pipePx / 2

      // Draw Pipe
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(pipeX0, centerY - radius)
      ctx.lineTo(pipeX1, centerY - radius)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(pipeX0, centerY + radius)
      ctx.lineTo(pipeX1, centerY + radius)
      ctx.stroke()
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(pipeX0, centerY - radius, pipePx, radius * 2)

      // MATH LOGIC
      const getProfileFactor = (r: number) => {
        // Correct parabolic profile: (1 - (r/R)^2)
        return terms.profile ? (1 - (r * r) / (radius * radius)) : 1
      }

      const getPulsatileValue = (r: number, tVal: number) => {
        const profile = getProfileFactor(r)
        const cycleRatio = period / 1.5
        const tScaled = tVal / cycleRatio
        
        if (tScaled < 0.5) {
          return profile * Math.sin(Math.PI * tScaled)
        } else {
          return profile * Math.cos(1.5 * Math.PI * (tScaled - 0.5))
        }
      }

      const getVelocity = (r: number, tVal: number) => {
        const vPulsatile = getPulsatileValue(r, tVal) * amplitude * 100 // Visual scale
        
        if (withSteadyFlow) {
          // Use the actual laminar formula logic from lib
          const vSteady = calcLaminarVelocity({
            dP: pressure,
            R: radius,
            r,
            mu: viscosity,
            L: length,
            vScale: 0.32, // Corrected scale to bring velocity back to observable range
            terms
          })
          return vPulsatile + vSteady
        }
        return vPulsatile
      }

      // Draw Particles
      ctx.fillStyle = withSteadyFlow ? '#ef4444' : '#f87171'
      particlesRef.current.forEach((p) => {
        if (Math.abs(p.r) > radius) p.r = (Math.sign(p.r) || 1) * Math.random() * radius
        const v = getVelocity(p.r, t) * dt 
        p.x += v
        if (p.x > pipeX1) p.x = pipeX0 + ((p.x - pipeX1) % pipePx)
        if (p.x < pipeX0) p.x = pipeX1 - ((pipeX0 - p.x) % pipePx)
        ctx.beginPath()
        ctx.arc(p.x, centerY + p.r, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw Velocity Profile Overlay
      ctx.strokeStyle = withSteadyFlow ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.7)'
      ctx.lineWidth = 3
      ctx.beginPath()
      const profileX = pipeX0 + pipePx * 0.2
      for (let r = -radius; r <= radius; r += 2) {
        const x = profileX + getVelocity(r, t) * 1.0 
        if (r === -radius) ctx.moveTo(x, centerY + r)
        else ctx.lineTo(x, centerY + r)
      }
      ctx.stroke()

      // Waveform Plot
      const plotY = 420
      const plotHeight = 60
      const plotWidth = pipePx
      const plotX = pipeX0
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(plotX, plotY - plotHeight, plotWidth, plotHeight * 2)
      ctx.strokeStyle = '#e2e8f0'
      ctx.strokeRect(plotX, plotY - plotHeight, plotWidth, plotHeight * 2)
      
      // Plot Wave (Centerline profile only)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let px = 0; px <= plotWidth; px++) {
        const plotT = (px / plotWidth) * period
        const val = getPulsatileValue(0, plotT)
        const py = plotY - val * plotHeight
        if (px === 0) ctx.moveTo(plotX + px, py)
        else ctx.lineTo(plotX + px, py)
      }
      ctx.stroke()

      const scanX = plotX + (t / period) * plotWidth
      ctx.strokeStyle = '#ef4444'
      ctx.beginPath(); ctx.moveTo(scanX, plotY - plotHeight); ctx.lineTo(scanX, plotY + plotHeight); ctx.stroke()

      // Labels
      ctx.fillStyle = 'black'; ctx.font = 'bold 14px sans-serif'
      ctx.fillText(`Live Waveform (center-line)`, plotX, plotY - plotHeight - 10)
      
      ctx.font = '14px monospace'
      const cycleRatio = period / 1.5
      const tScaled = t / cycleRatio
      const centerVal = getPulsatileValue(0, t)
      
      const profileStr = terms.profile ? "(1 - (r/R)²)" : "1"

      if (tScaled < 0.5) {
        ctx.fillStyle = '#2563eb'
        ctx.fillText(`Phase 1: ${profileStr} * sin(πt) = ${centerVal.toFixed(3)}`, plotX + 5, plotY + plotHeight + 20)
      } else {
        ctx.fillStyle = '#db2777'
        ctx.fillText(`Phase 2: ${profileStr} * cos(1.5πt) = ${centerVal.toFixed(3)}`, plotX + 5, plotY + plotHeight + 20)
      }
      
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [withSteadyFlow, radius, pressure, viscosity, length, period, amplitude, terms]) 

  return (
    <Card className="w-full"><CardContent className="p-0">
        <canvas ref={canvasRef} width={900} height={520} className="w-full h-[520px] rounded-lg bg-gray-50 border border-gray-300" />
    </CardContent></Card>
  )
}