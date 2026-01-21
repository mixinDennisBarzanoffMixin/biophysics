import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KatexEquation } from '@/components/KatexEquation'
import { type FormulaTerms, buildVelocityTex } from '@/lib/laminar-formula'
import { PlugFlowSimulation } from '@/views/laminar-flow/simulations/PlugFlowSimulation'
import { LaminarFlowSimulation } from '@/views/laminar-flow/simulations/LaminarFlowSimulation'
import { LaminarFlow3D } from '@/views/laminar-flow/simulations/LaminarFlow3D'
import { PlugFlowControls } from '@/views/laminar-flow/controls/PlugFlowControls'
import { LaminarFlowControls } from '@/views/laminar-flow/controls/LaminarFlowControls'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { InfoIcon } from 'lucide-react'

export const LaminarFlow = () => {
  const [radius, setRadius] = useState([78]) // Pipe radius
  const [pressure, setPressure] = useState([93]) // Pressure difference
  const [viscosity, setViscosity] = useState([7]) // Viscosity
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
    <div className="py-6 sm:px-6 lg:px-10 text-base leading-relaxed md:text-lg">
      <h1 className="text-3xl font-bold mb-4">Laminar Flow Simulation</h1>

      {/* Section 1: Simplified intuition (with its own sticky controls) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <Card className="mb-8 text-base md:text-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Step 1: Simplify the idea <KatexEquation tex="Q \propto \Delta P" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 leading-relaxed">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold mb-2">Notes</h3>
                <span>
                  On 17.12.2025, as I began learning Biophysics with Associate Prof. Dr. Traykov, I encountered for the first time how velocity varies
                  within a pipe, which made me realize it was necessary to first simplify the flow equation to{' '}
                  <KatexEquation tex="Q = \Delta P" /> to grasp its foundation. This helped me understand why flow rate (
                  <KatexEquation tex="Q" />) is directly proportional to pressure difference, as shown by{' '}
                  <KatexEquation tex="Q \propto \Delta P" />, meaning that doubling the pressure difference directly results
                  in doubling the flow rate.
                </span>
              </div>

              <Card className="bg-gray-50 overflow-x-auto">
                <CardContent className="p-4 text-center text-base md:text-lg">
                  <KatexEquation block tex="Q \propto \Delta P" />
                </CardContent>
              </Card>

              <div className="leading-relaxed">
                If we pretend flow depends <strong>only</strong> on pressure (and ignore wall friction), the fluid
                would move like a solid block (“plug flow”) with a flat velocity profile.
              </div>

              {/* example
              <div className="my-4 p-4 bg-slate-100 rounded-md">
                <KatexEquation block tex="Q = \frac{200 \cdot \pi \cdot (0.05)^4}{8 \cdot 0.001 \cdot 10} \approx 4.9 \times 10^{-3} \text{ m}^3/\text{s}" />
              </div> */}

              <PlugFlowSimulation pressure={plugPressure} />
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-20 h-fit self-start">
          <PlugFlowControls pressure={plugPressure} onPressureChange={setPlugPressure} />
        </aside>
      </section>

      {/* <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Step 2: Add viscosity (Q ∝ ΔP/μ)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold mb-2">Notes</h3>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <KatexEquation block tex="Q \propto \frac{\Delta P}{\mu}" />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Section 2: Full simulation (with its own sticky controls) */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <Card className="mb-8 text-base md:text-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Poiseuille Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 leading-relaxed">
              <Accordion className="w-full">
                <AccordionItem value="details" className="border rounded-lg bg-blue-50/30 overflow-hidden px-4">
                  <AccordionTrigger className="text-base md:text-lg font-semibold text-blue-700 hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="size-5" />
                      <span>Deep Dive: Understanding the Velocity Profile (19.12.2025)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:text-lg text-foreground pb-6">
                    <div className="space-y-4 pt-2">
                      <span className="leading-relaxed">
                        The Poiseuille flow equation is actually quite simple to understand, although hard to derive. 
                        I built this simulation to help me understand it. The reason we need <KatexEquation tex="(1-\frac{r}{R})^2" /> is because the velocity is 0 at the wall and highest at the center.
                        The <KatexEquation tex="r" /> is the radius of each red particle/blood cell and <KatexEquation tex="R" /> is the radius of the pipe. 
                      </span>

                      <div className="my-4 p-4 bg-slate-100 rounded-md overflow-x-auto">
                        <KatexEquation block tex={`r = 0 \\implies v(r) = v_{\\text{max}} \\left(1 - \\left(\\frac{r}{R}\\right)^2\\right) = v_{\\text{max}} \\cdot \\left(1 - \\left(\\frac{0}{R}\\right)^2\\right) = v_{\\text{max}}`} />
                      </div>

                      <span className="leading-relaxed">
                        The next property we have to keep in mind is that at <KatexEquation tex="r = R" />, the velocity has to be 0 in our model, meaning that the particles/blood cells get stopped by the walls.
                        If some particle is already getting slowed down somewhat, it would slow down particles closer to the center of the pipe less because these particles are already moving. 
                        That formula satisfies that too.
                      </span>

                      <div className="my-4 p-4 bg-slate-100 rounded-md overflow-x-auto">
                        <KatexEquation block tex={`r = R \\implies v(r) = v_{\\text{max}} \\left(1 - \\left(\\frac{r}{R}\\right)^2\\right) = v_{\\text{max}} \\cdot \\left(1 - \\left(\\frac{R}{R}\\right)^2\\right) = v_{\\text{max}} \\cdot \\left(1 - 1\\right) = 0`} />
                      </div>

                      <span className="leading-relaxed">
                        And for the rest of the particles that are <KatexEquation tex="0 < r < R" />, the velocity is between 0 and <KatexEquation tex="v_{\text{max}}" /> in a parabolic way.
                        For example if we say the particle is <KatexEquation tex="\frac{r}{R} = 0.2" />, meaning the particle is 20% of the way from the wall to the center, then it would simplify to:
                      </span>

                      <div className="my-4 p-4 bg-slate-100 rounded-md overflow-x-auto">
                        <KatexEquation block tex={`v_{\\text{max}} \\left(1 - \\left(\\frac{0.2}{1}\\right)^2\\right) = v_{\\text{max}} \\cdot \\left(1 - 0.04\\right) = v_{\\text{max}} \\cdot 0.96`} />
                      </div>

                      <span className="leading-relaxed">
                        If it's <KatexEquation tex="\frac{r}{R} = 0.8" />, meaning the particle is 80% of the way from the wall to the center, then it would simplify to:
                      </span>

                      <div className="my-4 p-4 bg-slate-100 rounded-md overflow-x-auto">
                        <KatexEquation block tex={`v_{\\text{max}} \\left(1 - \\left(\\frac{0.8}{1}\\right)^2\\right) = v_{\\text{max}} \\cdot \\left(1 - 0.64\\right) = v_{\\text{max}} \\cdot 0.36`} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion className="w-full">
                <AccordionItem value="details" className="border rounded-lg bg-blue-50/30 overflow-hidden px-4">
                  <AccordionTrigger className="text-base md:text-lg font-semibold text-blue-700 hover:no-underline py-4">
                    <div className="flex items-center gap-2">
                      <InfoIcon className="size-5" />
                      <span>Deep Dive: Understanding the <KatexEquation tex="R^2" /> term for the pipe radius (19.12.2025)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:text-lg text-foreground pb-6 leading-relaxed">
                    The reason the <KatexEquation tex="R" /> is squared is because as the pipe gets bigger, for the same <KatexEquation tex='\Delta P' /> 
                    the velocity would not just get linearly faster at the center, it would be exponentially increased.
                    For example if we have the velocity for <KatexEquation tex="R = 2" /> and <KatexEquation tex="R = 4" />, we would get:
                    <div className="my-4 p-4 bg-slate-100 rounded-md overflow-x-auto">
                      <div className="space-y-2">
                        <div>
                          The equation for the maximum velocity is:
                          <br />
                          <KatexEquation block tex="v_{\text{max}} = \frac{\Delta P}{4 \mu L} R^{2}" />
                        </div>
                        <div>
                          Let's use real example values: let <KatexEquation tex="\Delta P = 100" /> (pressure difference), <KatexEquation tex="\mu = 2" /> (viscosity), <KatexEquation tex="L = 10" /> (pipe length).
                        </div>
                        <div>
                          <strong>Case 1: <KatexEquation tex="R = 2" /></strong><br />
                          Plugging in, we get:
                          <br />
                          <KatexEquation block tex="v_{\text{max}} = \frac{100}{4 \times 2 \times 10} \times 2^{2} = \frac{100}{80} \times 4 = 1.25 \times 4 = 5 \text{ units}" />
                        </div>
                        <div>
                          <strong>Case 2: <KatexEquation tex="R = 4" /></strong><br />
                          <KatexEquation block tex="v_{\text{max}} = \frac{100}{4 \times 2 \times 10} \times 4^{2} = \frac{100}{80} \times 16 = 1.25 \times 16 = 20 \text{ units}" />
                        </div>
                        <div>
                          So, when you double the radius from 2 to 4, the max velocity goes from 5 units to 20 units — a fourfold increase, even though the radius of the pipe was only doubled! This shows the effect of the R² term.
                        </div>
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Card className="bg-gray-50 border-none shadow-none overflow-x-auto">
                <CardContent className="p-4">
                  <KatexEquation block tex="Q = \frac{\Delta P \pi r^4}{8 \mu L}" />
                  <div className="text-center mt-4">
                    <KatexEquation block tex={velocityTex} />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <LaminarFlowSimulation
            radius={radius}
            pressure={pressure}
            viscosity={viscosity}
            length={length}
            showVectors={showVectors}
            terms={terms}
          />
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-20 h-fit self-start">
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
    
    {/* Section 3: 3D Visualization (with its own sticky controls) */}
    <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div>
        <Card className="mb-8 text-base md:text-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Step 3: 3D Visualization — GPU Particle Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none mb-6">
              <p>
                21.01.2026: I played around to try to make it 3D on the GPU in OpenGL. I made the particles darker towards the
                center to emulate a shadow.
              </p>
              <div className="text-blue-600 font-mono text-sm not-italic">GPU-Powered! Resize or move for full effect. 🧬</div>
            </div>
            <LaminarFlow3D
              radius={radius[0]}
              pressure={pressure[0]}
              viscosity={viscosity[0]}
              length={length[0]}
            />
          </CardContent>
        </Card>
      </div>

      <aside className="flex flex-col gap-8 lg:sticky lg:top-20 h-fit self-start">
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
