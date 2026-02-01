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

// COMSOL-style Pulse functions
function asymmetricPulse(t: number, period: number, alpha: number) {
  const omega = (2 * Math.PI) / period
  // Fourier-based asymmetric pulse (0.7 + 0.3 weighting for natural feel)
  return 1 + alpha * (0.7 * Math.cos(omega * t) + 0.3 * Math.cos(2 * omega * t))
}

function smoothRamp(t: number, tau = 0.5) {
  return 1 - Math.exp(-t / tau)
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
  const globalTimeRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
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

      // Update Clocks
      globalTimeRef.current += dt
      timeRef.current = (timeRef.current + dt) % period
      
      const t = timeRef.current
      const gT = globalTimeRef.current

      const width = canvas.width
      const height = canvas.height
      const centerY = 160 
      const centerX = width / 2

      ctx.clearRect(0, 0, width, height)

      const pipePx = width * 0.9
      const pipeX0 = centerX - pipePx / 2
      const pipeX1 = centerX + pipePx / 2

      // Draw Pipe
      ctx.strokeStyle = '#333'; ctx.lineWidth = 5
      ctx.beginPath(); ctx.moveTo(pipeX0, centerY - radius); ctx.lineTo(pipeX1, centerY - radius); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(pipeX0, centerY + radius); ctx.lineTo(pipeX1, centerY + radius); ctx.stroke()
      ctx.fillStyle = '#fee2e2'; ctx.fillRect(pipeX0, centerY - radius, pipePx, radius * 2)

      // PHYSICS: Apply Pressure Pulse
      const ramp = smoothRamp(gT)
      const pulseFactor = asymmetricPulse(t, period, amplitude) * ramp
      
      // If "Oscillating Only", we subtract the steady mean (1) to show just the slosh
      // But user requested COMSOL style where pressure varies naturally.
      // We'll use 0 base pressure for "Oscillating Only" vs the provided pressure for Combined.
      const basePressure = withSteadyFlow ? pressure : 50 // Use a dummy base for slosh visibility
      const modulatedPressure = basePressure * (withSteadyFlow ? pulseFactor : (pulseFactor - 1))

      const getVelocity = (r: number) => {
        return calcLaminarVelocity({
          dP: modulatedPressure,
          R: radius,
          r,
          mu: viscosity,
          L: length,
          vScale: 0.32,
          terms
        })
      }

      // Draw Particles
      ctx.fillStyle = withSteadyFlow ? '#ef4444' : '#f87171'
      particlesRef.current.forEach((p) => {
        if (Math.abs(p.r) > radius) p.r = (Math.sign(p.r) || 1) * Math.random() * radius
        const v = getVelocity(p.r) * dt 
        p.x += v
        if (p.x > pipeX1) p.x = pipeX0 + ((p.x - pipeX1) % pipePx)
        if (p.x < pipeX0) p.x = pipeX1 - ((pipeX0 - p.x) % pipePx)
        ctx.beginPath(); ctx.arc(p.x, centerY + p.r, 3, 0, Math.PI * 2); ctx.fill()
      })

      // Velocity Profile Overlay
      ctx.strokeStyle = withSteadyFlow ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.7)'
      ctx.lineWidth = 3
      ctx.beginPath()
      const profileX = pipeX0 + pipePx * 0.2
      for (let r = -radius; r <= radius; r += 2) {
        const x = profileX + getVelocity(r) * 1.0 
        if (r === -radius) ctx.moveTo(x, centerY + r)
        else ctx.lineTo(x, centerY + r)
      }
      ctx.stroke()

      // Plot
      const plotBaseY = 420; 
      const plotHeight = 50; // Amplitude of the drawn wave
      const plotWidth = pipePx; 
      const plotX = pipeX0
      
      // Plot Background - make it large enough for offset + pulse
      const boxTop = plotBaseY - (plotHeight * 2.5)
      const boxHeight = plotHeight * 4
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(plotX, boxTop, plotWidth, boxHeight)
      ctx.strokeStyle = '#e2e8f0'; ctx.strokeRect(plotX, boxTop, plotWidth, boxHeight)
      
      // Plot Zero Line
      ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([5, 5])
      ctx.beginPath(); ctx.moveTo(plotX, plotBaseY); ctx.lineTo(plotX + plotWidth, plotBaseY); ctx.stroke()
      ctx.setLineDash([])

      // Draw Waveform
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.beginPath()
      for (let px = 0; px <= plotWidth; px++) {
        const plotT = (px / plotWidth) * period
        const val = withSteadyFlow ? asymmetricPulse(plotT, period, amplitude) : (asymmetricPulse(plotT, period, amplitude) - 1)
        const py = plotBaseY - val * plotHeight
        if (px === 0) ctx.moveTo(plotX + px, py)
        else ctx.lineTo(plotX + px, py)
      }
      ctx.stroke()

      const scanX = plotX + (t / period) * plotWidth
      ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(scanX, boxTop); ctx.lineTo(scanX, boxTop + boxHeight); ctx.stroke()

      // Labels
      ctx.fillStyle = 'black'; ctx.font = 'bold 14px sans-serif'
      ctx.fillText(`Pressure Multiplier`, plotX, boxTop - 10)
      
      ctx.font = '14px monospace'
      ctx.fillStyle = '#2563eb'
      const activePulse = withSteadyFlow ? pulseFactor : (pulseFactor - 1)
      ctx.fillText(`ΔP_mod = ΔP * ${activePulse.toFixed(3)}`, plotX + 5, plotBaseY + 70)
      
      ctx.fillStyle = 'black'; ctx.font = '14px sans-serif'
      ctx.fillText(`t = ${t.toFixed(2)}s / ${period.toFixed(1)}s`, 20, 25)
      if (gT < 2) ctx.fillText(`Startup Ramp: ${(ramp * 100).toFixed(0)}%`, 20, 45)

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
