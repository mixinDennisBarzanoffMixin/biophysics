// ... existing code ...
import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { KatexEquation } from '@/components/KatexEquation'
import { calcLaminarVelocity, type FormulaTerms, buildVelocityTex } from '@/lib/laminar-formula'

const PlugFlowSimulation = ({ pressure }: { pressure: number[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const particlesRef = useRef<Array<{x: number, y: number}>>([])

  useEffect(() => {
    particlesRef.current = Array.from({ length: 500 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 150 // fixed height
    }))
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
      const pipeHeight = 150

      ctx.clearRect(0, 0, width, height)

      // Draw Pipe
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, centerY - pipeHeight/2)
      ctx.lineTo(width, centerY - pipeHeight/2)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, centerY + pipeHeight/2)
      ctx.lineTo(width, centerY + pipeHeight/2)
      ctx.stroke()

      // Fluid Background
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(0, centerY - pipeHeight/2, width, pipeHeight)

      // Particles
      ctx.fillStyle = '#ef4444'
      const v = pressure[0] * 0.1 // Velocity proportional only to pressure

      particlesRef.current.forEach(p => {
        p.x += v
        if (p.x > width) p.x = 0
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, centerY - pipeHeight/2 + p.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Draw Profile (Flat)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      const profileX = 100 + v * 20
      ctx.moveTo(profileX, centerY - pipeHeight/2)
      ctx.lineTo(profileX, centerY + pipeHeight/2)
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
          If flow depended <strong>only</strong> on pressure (<KatexEquation tex="Q \propto \Delta P" />), the fluid would move as a solid block. 
          There is no friction with the walls (no viscosity).
        </span>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={800} height={200} className="w-full h-[200px] rounded-lg bg-slate-50 mb-6" />
      </CardContent>
    </Card>
  )
}

export const LaminarFlow = () => {
  const [radius, setRadius] = useState([50]) // Pipe radius
  const [pressure, setPressure] = useState([50]) // Pressure difference
  const [viscosity, setViscosity] = useState([10]) // Viscosity
  const [length, setLength] = useState([100]) // Pipe length factor
  const [showVectors, setShowVectors] = useState(true)

  const [terms, setTerms] = useState<FormulaTerms>({
    pressure: true,
    constant: true,
    viscosity: true,
    length: true,
    radiusScale: true,
    profile: true,
  })

  const [plugPressure, setPlugPressure] = useState([50])

  const velocityTex = buildVelocityTex(terms)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  
  const requestRef = useRef<number>(0)
  const particlesRef = useRef<Array<{x: number, y: number, r: number}>>([])

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 1000 }, () => ({
      x: Math.random() * 800,
      y: (Math.random() - 0.5) * 2 * radius[0],
      r: (Math.random() - 0.5) * radius[0] // Relative radius position
    }))
  }, []) // Run once on mount

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
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height)
        
        const R = radius[0]
        const dP = pressure[0]
        const mu = viscosity[0]
        const L = length[0]

        // Scale pipe length proportionally to L (linear scale)
        // If L=100, we want it to take up most of the canvas (e.g., 750px)
        // If L=0.001, it becomes a tiny sliver (minimum 2px for visibility)
        const pipePx = Math.max(2, (L / 100) * (width * 0.9))
        const pipeX0 = centerX - pipePx / 2
        const pipeX1 = centerX + pipePx / 2
        
        // Calculate max velocity (scale factor for visualization)
        // v_max = (dP * R^2) / (4 * mu * L)
        const vScale = 150 / ( (100 * 100 * 100) / (4 * 1 * 100) ) * 2 

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

        // Draw Fluid (Light background)
        ctx.fillStyle = '#fee2e2'
        ctx.fillRect(pipeX0, centerY - R, pipePx, R * 2)

        // Draw Particles
        ctx.fillStyle = '#f87171'
        
        // Update and draw particles
        // Ensure we have particles
        if (particlesRef.current.length === 0) {
           particlesRef.current = Array.from({ length: 1000 }, () => ({
                x: pipeX0 + Math.random() * pipePx,
                y: 0, 
                r: (Math.random() * 2 - 1) * R
           }))
        }

        particlesRef.current.forEach(p => {
            // Recalculate y based on relative radius if needed, or just keep y
            // But we need to keep 'r' consistent to follow streamlines
            // So:
            // p.r is the radial distance from center (-R to R)
            // Constrain p.r to be within current R
            if (Math.abs(p.r) > R) p.r = (Math.sign(p.r) || 1) * Math.random() * R

            const r = p.r
            // Velocity at this radius (Formula Explorer can ablate terms)
            const vRaw =
              calcLaminarVelocity({ dP, R, r, mu, L, vScale, terms }) * 0.1 // speed factor for animation
            // Clamp per-frame step so tiny L doesn't teleport particles too far
            const v = Math.min(vRaw, 50)

            p.x += v
            // Wrap particles within the visible pipe segment
            if (p.x > pipeX1) {
                p.x = pipeX0 + (p.x - pipeX1) % pipePx
                p.r = (Math.random() * 2 - 1) * R
            }
            if (p.x < pipeX0) {
                p.x = pipeX1 - (pipeX0 - p.x) % pipePx
            }

            const y = centerY + r
            const size = 3
            
            ctx.beginPath()
            ctx.arc(p.x, y, size, 0, Math.PI * 2)
            ctx.fill()
        })


        // Draw Velocity Profile Overlay
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)' // Red profile line with opacity
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
        
        // Draw Vectors (Static overlay)
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
                 
                 if (v > 5 && pipePx > 30) { // Only draw arrow heads if there is room
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x - 5, y - 2)
                    ctx.lineTo(x - 5, y + 2)
                    ctx.fill()
                 }
            }
        }
        
        // Draw Centerline
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
    <div className="p-8 max-w-[1200px] mx-auto">
      <h1 className="text-3xl font-bold mb-4">Laminar Flow Simulation</h1>

      {/* Section 1: Simplified intuition (with its own sticky controls) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Step 1: Simplify the idea (Q ∝ ΔP)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold mb-2">Notes</h3>
                <p>
                  On 17.12.2025, as I began learning Biophysics, I encountered for the first time how velocity varies
                  within a pipe, which made me realize it was necessary to first simplify the flow equation to{' '}
                  <KatexEquation tex="Q = \Delta P" /> to grasp its foundation. This helped me understand why flow rate (
                  <KatexEquation tex="Q" />) is directly proportional to pressure difference, as shown by{' '}
                  <KatexEquation tex="Q \propto \Delta P" />, meaning that doubling the pressure difference directly results
                  in doubling the flow rate.
                </p>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <KatexEquation block tex="Q \propto \Delta P" />
                </CardContent>
              </Card>

              <div className="leading-relaxed">
                If we pretend flow depends <strong>only</strong> on pressure (and ignore wall friction), the fluid
                would move like a solid block (“plug flow”) with a flat velocity profile.
              </div>

              {/* example */}
              <div className="my-4 p-4 bg-slate-100 rounded-md">
                <KatexEquation block tex="Q = \frac{200 \cdot \pi \cdot (0.05)^4}{8 \cdot 0.001 \cdot 10} \approx 4.9 \times 10^{-3} \text{ m}^3/\text{s}" />
              </div>

              <PlugFlowSimulation pressure={plugPressure} />
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-6 h-fit self-start pt-40">
          <Card>
            <CardHeader>
              <CardTitle>Step 1 Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="plug-pressure">Pressure Difference (ΔP)</Label>
                  <span className="text-sm font-medium">{plugPressure[0]}</span>
                </div>
                <Slider
                  id="plug-pressure"
                  min={0}
                  max={100}
                  value={plugPressure}
                  onValueChange={(val) => setPlugPressure(Array.isArray(val) ? val : [val])}
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* Section 2: Full simulation (with its own sticky controls) */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
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

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Poiseuille Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <span className="leading-relaxed">
                In fluid dynamics, laminar flow is characterized by fluid particles following smooth paths in layers,
                with each layer moving smoothly past the adjacent layers with little or no mixing. For flow in a pipe,
                the velocity profile is parabolic.
              </span>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <KatexEquation block tex="Q = \frac{\Delta P \pi r^4}{8 \mu L}" />
                  <div className="text-center mt-4">
                    <KatexEquation block tex={velocityTex} />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-6 h-fit self-start">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="radius">Radius (R)</Label>
                  <span className="text-sm font-medium">{radius[0]}</span>
                </div>
                <Slider
                  id="radius"
                  min={10}
                  max={100}
                  value={radius}
                  onValueChange={(...args) => {
                    const possibleValue = args[0]
                    if (Array.isArray(possibleValue) && typeof possibleValue[0] === 'number') {
                      setRadius(possibleValue as number[])
                    } else if (typeof possibleValue === 'number') {
                      setRadius([possibleValue])
                    } else {
                      // Fallback or log if unexpected
                      const secondaryValue = args[1]
                      if (Array.isArray(secondaryValue)) setRadius(secondaryValue as number[])
                      else if (typeof secondaryValue === 'number') setRadius([secondaryValue])
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="pressure">Pressure Difference (ΔP)</Label>
                  <span className="text-sm font-medium">{pressure[0]}</span>
                </div>
                <Slider
                  id="pressure"
                  min={10}
                  max={200}
                  value={pressure}
                  onValueChange={(value) => setPressure(Array.isArray(value) ? value : [value])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="viscosity">Viscosity (μ)</Label>
                  <span className="text-sm font-medium">{viscosity[0]}</span>
                </div>
                <Slider
                  id="viscosity"
                  min={1}
                  max={50}
                  value={viscosity}
                  onValueChange={(value) => setViscosity(Array.isArray(value) ? value : [value])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="length">Length (L)</Label>
                  <span className="text-sm font-medium">
                    {length[0] < 1 ? length[0].toFixed(3) : length[0].toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="length"
                  min={0.001}
                  max={100}
                  step={0.001}
                  value={length}
                  onValueChange={(value) => setLength(Array.isArray(value) ? value : [value])}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="vectors">Show Vectors</Label>
                <Switch
                  id="vectors"
                  checked={showVectors}
                  onCheckedChange={(checked) => setShowVectors(checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardContent className="p-4">
              <strong className="text-sm">Variable Guide:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>
                  <KatexEquation tex="R" />: Radius of the pipe
                </li>
                <li>
                  <KatexEquation tex="\Delta P" />: Pressure drop across length
                </li>
                <li>
                  <KatexEquation tex="\mu" />: Dynamic viscosity
                </li>
                <li>
                  <KatexEquation tex="L" />: Length of pipe segment
                </li>
              </ul>
            </CardContent>
          </Card>

        </aside>
      </section>

    </div>
  )
}

