'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { KatexEquation } from '@/components/KatexEquation'
import { PulsatileFlowSimulation } from '@/views/pulsatile-flow/simulations/PulsatileFlowSimulation'
import { OscillatingControls } from '@/views/pulsatile-flow/controls/OscillatingControls'
import { CombinedControls } from '@/views/pulsatile-flow/controls/CombinedControls'
import { type FormulaTerms } from '@/lib/laminar-formula'

export default function PulsatileFlowPage() {
  const router = useRouter()

  // State for First Simulation (Oscillating only)
  const [oscPeriod, setOscPeriod] = useState([1.5])
  const [oscAmplitude, setOscAmplitude] = useState([1.0])

  // State for Second Simulation (Combined)
  const [combRadius, setCombRadius] = useState([100])
  const [combPressure, setCombPressure] = useState([100])
  const [combViscosity, setCombViscosity] = useState([10])
  const [combLength, setCombLength] = useState([50])
  const [combPeriod, setCombPeriod] = useState([1.5])
  const [combAmplitude, setCombAmplitude] = useState([1.0])
  
  const [combTerms, setCombTerms] = useState<FormulaTerms>({
    pressure: true,
    constant: true,
    viscosity: true,
    length: true,
    radiusScale: true,
    profile: true,
  })

  return (
    <div className="py-6 sm:px-6 lg:px-10 pb-20">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/journey')}> 
          Back
        </Button>
      </div>
      
      <div className="max-w-[1400px] mx-auto space-y-16">
        <div className="max-w-[900px]">
          <h1 className="text-3xl font-bold mb-2">Pulsatile Flow / Heartbeat</h1>
          <p className="text-slate-600 text-lg">
            Blood flow is driven by the pumping heart, creating a pulsatile velocity profile.
          </p>
        </div>

        {/* Section 1: The Oscillating Component */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">1. The Oscillating Component</h2>
              <p className="mb-4 text-slate-700">
                This represents the <em>changes</em> in velocity due to the heart's cycle. Notice how the fluid follows a parabolic profile—just like in the Laminar Flow chapter—but it oscillates back and forth.
              </p>
              
              <PulsatileFlowSimulation 
                period={oscPeriod[0]}
                amplitude={oscAmplitude[0]}
                radius={100}
              />
              
              <div className="mt-4 prose prose-slate max-w-none">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <p className="font-semibold mb-1">Velocity Profile <KatexEquation tex="v_{osc}(r, t)" />:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><KatexEquation tex="v(r, t) = \left(1 - \left(\frac{r}{R}\right)^2\right) \cdot \text{Pulse}(t)" /></li>
                    </ul>
                    <p className="mt-2 text-slate-500">The pulse shape uses the sin/cos piecewise logic shown in the graph below.</p>
                </div>
              </div>
            </div>
          </div>
          
          <aside className="flex flex-col gap-8 lg:sticky lg:top-10 h-fit">
            <OscillatingControls 
              period={oscPeriod}
              onPeriodChange={setOscPeriod}
              amplitude={oscAmplitude}
              onAmplitudeChange={setOscAmplitude}
            />
          </aside>
        </section>

        {/* Section 2: Combined Flow */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">2. Combined Flow (Oscillating + Steady)</h2>
              <p className="mb-4 text-slate-700">
                Real blood flow is a combination of this oscillating heartbeat component <em>plus</em> the steady pressure gradient.
              </p>
              <p className="mb-4 text-slate-700">
                When we add them together, we see the characteristic "pulsatile" forward motion. You can toggle the individual Poiseuille terms on the right to see how they affect the mean flow velocity.
              </p>
              
              <PulsatileFlowSimulation 
                withSteadyFlow 
                radius={combRadius[0]}
                pressure={combPressure[0]}
                viscosity={combViscosity[0]}
                length={combLength[0]}
                period={combPeriod[0]}
                amplitude={combAmplitude[0]}
                terms={combTerms}
              />
              
              <div className="mt-4 prose prose-slate max-w-none">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <p className="font-semibold mb-2">Total Velocity:</p>
                    <KatexEquation 
                      tex="v_{total}(r, t) = \underbrace{\frac{\Delta P}{4 \mu L} (R^2 - r^2)}_{\text{Steady}} + \underbrace{v_{osc}(r, t)}_{\text{Heartbeat}}" 
                      block 
                    />
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-10 h-fit">
            <CombinedControls 
               radius={combRadius}
               onRadiusChange={setCombRadius}
               pressure={combPressure}
               onPressureChange={setCombPressure}
               viscosity={combViscosity}
               onViscosityChange={setCombViscosity}
               length={combLength}
               onLengthChange={setCombLength}
               period={combPeriod}
               onPeriodChange={setCombPeriod}
               amplitude={combAmplitude}
               onAmplitudeChange={setCombAmplitude}
               terms={combTerms}
               onTermsChange={setCombTerms}
            />
          </aside>
        </section>

      </div>
    </div>
  )
}
