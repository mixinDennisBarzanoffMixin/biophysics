import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KatexEquation } from '@/components/KatexEquation'

export function PlugFlowSimulation({ pressure }: { pressure: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const particlesRef = useRef<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    const baseWidth = canvasRef.current?.parentElement?.clientWidth ?? 800
    particlesRef.current = Array.from({ length: 500 }, () => ({
      x: Math.random() * baseWidth,
      y: Math.random() * 150, // fixed height
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const parentWidth = canvas.parentElement?.clientWidth ?? 800
      const width = Math.max(360, Math.min(parentWidth, 1200))
      const height = 240
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

    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const pipeHeight = Math.max(160, Math.min(height * 0.7, 220))

      ctx.clearRect(0, 0, width, height)

      // Draw Pipe
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(0, centerY - pipeHeight / 2)
      ctx.lineTo(width, centerY - pipeHeight / 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, centerY + pipeHeight / 2)
      ctx.lineTo(width, centerY + pipeHeight / 2)
      ctx.stroke()

      // Fluid Background
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(0, centerY - pipeHeight / 2, width, pipeHeight)

      // Particles
      ctx.fillStyle = '#ef4444'
      const v = pressure[0] * 0.1 // Velocity proportional only to pressure

      particlesRef.current.forEach((p) => {
        p.x += v
        if (p.x > width) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, centerY - pipeHeight / 2 + p.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw Profile (Flat)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      const profileX = 100 + v * 20
      ctx.moveTo(profileX, centerY - pipeHeight / 2)
      ctx.lineTo(profileX, centerY + pipeHeight / 2)
      ctx.stroke()

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [pressure])

  return (
    <Card className="my-8 border-2 border-dashed border-slate-300">
      <CardHeader>
        <CardTitle>Simplification: The "Plug Flow" Model</CardTitle>
        <span className="text-sm text-muted-foreground">
          If flow depended <strong>only</strong> on pressure (<KatexEquation tex="Q \propto \Delta P" />
          ), the fluid would move as a solid block. There is no friction with the walls (no viscosity).
        </span>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={900} height={240} className="w-full h-[240px] rounded-lg bg-slate-50 mb-6" />
      </CardContent>
    </Card>
  )
}


