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
  const [oscAmplitude, setOscAmplitude] = useState([0.8])

  // State for Second Simulation (Combined)
  const [combRadius, setCombRadius] = useState([100])
  const [combPressure, setCombPressure] = useState([100])
  const [combViscosity, setCombViscosity] = useState([10])
  const [combLength, setCombLength] = useState([50])
  const [combPeriod, setCombPeriod] = useState([1.5])
  const [combAmplitude, setCombAmplitude] = useState([0.6])
  
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
          <p className="text-slate-600 text-lg mb-6">
            Modeling hemodynamics by modulating pressure over time (COMSOL approach).
          </p>
          
          <div className="border rounded-lg overflow-hidden mb-8 shadow-sm">
            <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 uppercase border-b">
              Reference: COMSOL blood_flow.mph Parameters
            </div>
            <img 
              src="/piecewise.png" 
              alt="COMSOL Piecewise Functions" 
              className="w-full max-w-[600px] mx-auto"
            />
          </div>
        </div>

        {/* Section 1: The Oscillating Component */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">1. The Oscillating Component</h2>
              <p className="mb-4 text-slate-700">
                Instead of moving particles manually, we oscillate the <strong>Pressure Difference</strong> <KatexEquation tex="\Delta P" /> around zero. This is a "Fourier-honest" pulse that creates a smooth, continuous sloshing motion.
              </p>
              
              <PulsatileFlowSimulation 
                period={oscPeriod[0]}
                amplitude={oscAmplitude[0]}
                radius={100}
              />
              
              <div className="mt-4 prose prose-slate max-w-none">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <p className="font-semibold mb-2">Pressure Pulse Function:</p>
                    <KatexEquation 
                      tex="\Delta P(t) = \alpha \cdot (0.7\cos(\omega t) + 0.3\cos(2\omega t))"
                      block 
                    />
                    <p className="mt-2 text-slate-500 text-xs">This asymmetry mimics the heart's contraction (systole) and relaxation (diastole).</p>
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
              <h2 className="text-xl font-semibold mb-4">2. Combined Flow (Steady + Pulse)</h2>
              <p className="mb-4 text-slate-700">
                The most realistic model: A steady mean pressure gradient modulated by a periodic pulse. The velocity profile follows the Poiseuille law at every instant.
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
                    <p className="font-semibold mb-2">Total Modulated Pressure:</p>
                    <KatexEquation 
                      tex="\Delta P_{total}(t) = \Delta P_{steady} \cdot (1 + \text{Pulse}(t))"
                      block 
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      We also apply a <strong>Smooth Ramp</strong> <KatexEquation tex="1 - e^{-t/\tau}" /> to prevent discontinuities at simulation startup.
                    </p>
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