// ... existing code ...
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KatexEquation } from '@/components/KatexEquation'
import { type FormulaTerms, buildVelocityTex } from '@/lib/laminar-formula'
import { PlugFlowSimulation } from '@/views/laminar-flow/simulations/PlugFlowSimulation'
import { LaminarFlowSimulation } from '@/views/laminar-flow/simulations/LaminarFlowSimulation'
import { PlugFlowControls } from '@/views/laminar-flow/controls/PlugFlowControls'
import { LaminarFlowControls } from '@/views/laminar-flow/controls/LaminarFlowControls'

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
                <span>
                  On 17.12.2025, as I began learning Biophysics, I encountered for the first time how velocity varies
                  within a pipe, which made me realize it was necessary to first simplify the flow equation to{' '}
                  <KatexEquation tex="Q = \Delta P" /> to grasp its foundation. This helped me understand why flow rate (
                  <KatexEquation tex="Q" />) is directly proportional to pressure difference, as shown by{' '}
                  <KatexEquation tex="Q \propto \Delta P" />, meaning that doubling the pressure difference directly results
                  in doubling the flow rate.
                </span>
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

        <aside className="flex flex-col gap-8 lg:sticky lg:top-6 h-fit self-start">
          <PlugFlowControls pressure={plugPressure} onPressureChange={setPlugPressure} />
        </aside>
      </section>

      {/* Section 2: Full simulation (with its own sticky controls) */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <LaminarFlowSimulation
            radius={radius}
            pressure={pressure}
            viscosity={viscosity}
            length={length}
            showVectors={showVectors}
            terms={terms}
          />

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
          <LaminarFlowControls
            radius={radius}
            onRadiusChange={setRadius}
            pressure={pressure}
            onPressureChange={setPressure}
            viscosity={viscosity}
            onViscosityChange={setViscosity}
            length={length}
            onLengthChange={setLength}
            showVectors={showVectors}
            onShowVectorsChange={setShowVectors}
            terms={terms}
            onTermsChange={setTerms}
          />
        </aside>
      </section>

    </div>
  )
}

