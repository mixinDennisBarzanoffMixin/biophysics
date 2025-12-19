import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { KatexEquation } from '@/components/KatexEquation'
import { buildVelocityTex, type FormulaTerms } from '@/lib/laminar-formula'
import { cn } from '@/lib/utils'

export function LaminarFlowControls({
  radius,
  onRadiusChange,
  pressure,
  onPressureChange,
  viscosity,
  onViscosityChange,
  length,
  onLengthChange,
  showVectors,
  onShowVectorsChange,
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
  showVectors: boolean
  onShowVectorsChange: (next: boolean) => void
  terms: FormulaTerms
  onTermsChange: (next: FormulaTerms) => void
}) {
  const velocityTex = buildVelocityTex(terms)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Controls & Variable Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-md border bg-slate-50/50 p-3">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Active Formula</div>
            <KatexEquation block tex={velocityTex} />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  id="term-const"
                  checked={terms.constant}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, constant: checked })}
                />
                <Label htmlFor="term-const" className="cursor-pointer">Constant factor <KatexEquation tex="\frac{1}{4}" /></Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  id="term-profile"
                  checked={terms.profile}
                  onCheckedChange={(checked) => onTermsChange({ ...terms, profile: checked })}
                />
                <Label htmlFor="term-profile" className="cursor-pointer">Parabolic profile <KatexEquation tex="\left(1 - \left(\frac{r}{R}\right)^2\right)" /></Label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          {/* Radius Control */}
          <div className="flex gap-4">
            <div className="pt-1">
              <Switch
                id="term-radius"
                checked={terms.radiusScale}
                onCheckedChange={(checked) => onTermsChange({ ...terms, radiusScale: checked })}
              />
            </div>
            <div className={cn("flex-1 space-y-2 transition-opacity", !terms.radiusScale && "opacity-50")}>
              <div className="flex justify-between items-center">
                <Label htmlFor="radius" className="font-semibold flex items-center gap-2">
                  <KatexEquation tex="R" />: Radius of the pipe
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{radius[0]}</span>
              </div>
              <Slider
                id="radius"
                min={10}
                max={100}
                value={radius}
                disabled={!terms.radiusScale}
                onValueChange={(val) => onRadiusChange(Array.isArray(val) ? val : [val])}
              />
            </div>
          </div>

          {/* Pressure Control */}
          <div className="flex gap-4">
            <div className="pt-1">
              <Switch
                id="term-pressure"
                checked={terms.pressure}
                onCheckedChange={(checked) => onTermsChange({ ...terms, pressure: checked })}
              />
            </div>
            <div className={cn("flex-1 space-y-2 transition-opacity", !terms.pressure && "opacity-50")}>
              <div className="flex justify-between items-center">
                <Label htmlFor="pressure" className="font-semibold flex items-center gap-2">
                  <KatexEquation tex="\Delta P" />: Pressure Difference
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{pressure[0]}</span>
              </div>
              <Slider
                id="pressure"
                min={10}
                max={200}
                value={pressure}
                disabled={!terms.pressure}
                onValueChange={(val) => onPressureChange(Array.isArray(val) ? val : [val])}
              />
            </div>
          </div>

          {/* Viscosity Control */}
          <div className="flex gap-4">
            <div className="pt-1">
              <Switch
                id="term-viscosity"
                checked={terms.viscosity}
                onCheckedChange={(checked) => onTermsChange({ ...terms, viscosity: checked })}
              />
            </div>
            <div className={cn("flex-1 space-y-2 transition-opacity", !terms.viscosity && "opacity-50")}>
              <div className="flex justify-between items-center">
                <Label htmlFor="viscosity" className="font-semibold flex items-center gap-2">
                  <KatexEquation tex="\mu" />: Viscosity of the fluid
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{viscosity[0]}</span>
              </div>
              <Slider
                id="viscosity"
                min={1}
                max={50}
                value={viscosity}
                disabled={!terms.viscosity}
                onValueChange={(val) => onViscosityChange(Array.isArray(val) ? val : [val])}
              />
            </div>
          </div>

          {/* Length Control */}
          <div className="flex gap-4">
            <div className="pt-1">
              <Switch
                id="term-length"
                checked={terms.length}
                onCheckedChange={(checked) => onTermsChange({ ...terms, length: checked })}
              />
            </div>
            <div className={cn("flex-1 space-y-2 transition-opacity", !terms.length && "opacity-50")}>
              <div className="flex justify-between items-center">
                <Label htmlFor="length" className="font-semibold flex items-center gap-2">
                  <KatexEquation tex="L" />: Length of the pipe
                </Label>
                <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {length[0] < 1 ? length[0].toFixed(3) : length[0].toFixed(1)}
                </span>
              </div>
              <Slider
                id="length"
                min={0.001}
                max={100}
                step={0.001}
                value={length}
                disabled={!terms.length}
                onValueChange={(val) => onLengthChange(Array.isArray(val) ? val : [val])}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Label htmlFor="vectors" className="font-medium">Show Velocity Vectors</Label>
          <Switch id="vectors" checked={showVectors} onCheckedChange={(checked) => onShowVectorsChange(checked)} />
        </div>
      </CardContent>
    </Card>
  )
}
