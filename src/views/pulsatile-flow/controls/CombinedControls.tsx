import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { Separator } from '@/components/ui/separator'
import { KatexEquation } from '@/components/KatexEquation'
import { type FormulaTerms } from '@/lib/laminar-formula'
import { cn } from '@/lib/utils'

export function CombinedControls({
  radius,
  onRadiusChange,
  pressure,
  onPressureChange,
  viscosity,
  onViscosityChange,
  length,
  onLengthChange,
  period,
  onPeriodChange,
  amplitude,
  onAmplitudeChange,
  terms,
  onTermsChange,
}: {
  radius: number[]
  onRadiusChange: (next: number[]) => void
  pressure: number[]
  onPressureChange: (next: number[]) => void
  viscosity: number[]
  onViscosityChange: (next: number[]) => void
  length: number[]
  onLengthChange: (next: number[]) => void
  period: number[]
  onPeriodChange: (next: number[]) => void
  amplitude: number[]
  onAmplitudeChange: (next: number[]) => void
  terms: FormulaTerms
  onTermsChange: (next: FormulaTerms) => void
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Combined Flow Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Formula Toggles */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Equation Terms</div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <Switch
                id="c-term-profile"
                checked={terms.profile}
                onCheckedChange={(checked) => onTermsChange({ ...terms, profile: checked })}
              />
              <Label htmlFor="c-term-profile" className="text-sm cursor-pointer">Parabolic Profile <KatexEquation tex="(1-(r/R)^2)" /></Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="c-term-const"
                checked={terms.constant}
                onCheckedChange={(checked) => onTermsChange({ ...terms, constant: checked })}
              />
              <Label htmlFor="c-term-const" className="text-sm cursor-pointer">Constant factor <KatexEquation tex="1/4" /></Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Steady Flow Section */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Steady Component (Poiseuille)</div>
          
          <div className="space-y-4">
            {/* Radius */}
            <div className="flex gap-3">
               <Switch
                  checked={terms.radiusScale}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, radiusScale: checked })}
                />
              <div className={cn("flex-1 space-y-2", !terms.radiusScale && "opacity-50")}>
                <div className="flex justify-between items-center">
                  <Label className="font-semibold flex items-center gap-2">
                    <KatexEquation tex="R" />: Radius
                  </Label>
                  <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{radius?.[0] ?? 100}</span>
                </div>
                <Slider
                  min={20}
                  max={150}
                  value={radius}
                  disabled={!terms.radiusScale}
                  onValueChange={(val) => onRadiusChange(Array.isArray(val) ? val : [val])}
                />
              </div>
            </div>

            {/* Pressure */}
            <div className="flex gap-3">
               <Switch
                  checked={terms.pressure}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, pressure: checked })}
                />
              <div className={cn("flex-1 space-y-2", !terms.pressure && "opacity-50")}>
                <div className="flex justify-between items-center">
                  <Label className="font-semibold flex items-center gap-2">
                    <KatexEquation tex="\Delta P" />: Pressure
                  </Label>
                  <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{pressure?.[0] ?? 100}</span>
                </div>
                <Slider
                  min={0}
                  max={200}
                  value={pressure}
                  disabled={!terms.pressure}
                  onValueChange={(val) => onPressureChange(Array.isArray(val) ? val : [val])}
                />
              </div>
            </div>

            {/* Viscosity */}
            <div className="flex gap-3">
               <Switch
                  checked={terms.viscosity}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, viscosity: checked })}
                />
              <div className={cn("flex-1 space-y-2", !terms.viscosity && "opacity-50")}>
                <div className="flex justify-between items-center">
                  <Label className="font-semibold flex items-center gap-2">
                    <KatexEquation tex="\mu" />: Viscosity
                  </Label>
                  <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{viscosity?.[0] ?? 10}</span>
                </div>
                <Slider
                  min={1}
                  max={50}
                  value={viscosity}
                  disabled={!terms.viscosity}
                  onValueChange={(val) => onViscosityChange(Array.isArray(val) ? val : [val])}
                />
              </div>
            </div>

             {/* Length */}
             <div className="flex gap-3">
               <Switch
                  checked={terms.length}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, length: checked })}
                />
              <div className={cn("flex-1 space-y-2", !terms.length && "opacity-50")}>
                <div className="flex justify-between items-center">
                  <Label className="font-semibold flex items-center gap-2">
                    <KatexEquation tex="L" />: Length
                  </Label>
                  <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{length?.[0] ?? 50}</span>
                </div>
                <Slider
                  min={10}
                  max={100}
                  value={length}
                  disabled={!terms.length}
                  onValueChange={(val) => onLengthChange(Array.isArray(val) ? val : [val])}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pulsatile Flow Section */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Oscillating Component</div>
          
          <div className="space-y-4">
             {/* Period */}
             <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold flex items-center gap-2">
                  Period <span className="font-normal text-slate-500">(s)</span>
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{Number(period?.[0] ?? 1.5).toFixed(1)}</span>
              </div>
              <Slider
                min={0.5}
                max={3.0}
                step={0.1}
                value={period}
                onValueChange={(val) => onPeriodChange(Array.isArray(val) ? val : [val])}
              />
            </div>

            {/* Amplitude */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold flex items-center gap-2">
                  Amplitude
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{Number(amplitude?.[0] ?? 1.0).toFixed(1)}</span>
              </div>
              <Slider
                min={0}
                max={2.0}
                step={0.1}
                value={amplitude}
                onValueChange={(val) => onAmplitudeChange(Array.isArray(val) ? val : [val])}
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
