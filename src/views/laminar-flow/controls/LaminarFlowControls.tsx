import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { KatexEquation } from '@/components/KatexEquation'
import { buildVelocityTex, type FormulaTerms } from '@/lib/laminar-formula'

function InlineFormulaExplorer({
  terms,
  onTermsChange,
}: {
  terms: FormulaTerms
  onTermsChange: (next: FormulaTerms) => void
}) {
  const velocityTex = buildVelocityTex(terms)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formula Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Toggle terms on/off. Enabled terms are highlighted in green and are the only ones that affect the velocity
          calculation.
        </div>

        <div className="rounded-md border bg-background p-3">
          <KatexEquation block tex={velocityTex} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="term-pressure">Pressure term (ΔP)</Label>
            <Switch
              id="term-pressure"
              checked={terms.pressure}
              onCheckedChange={(checked) => onTermsChange({ ...terms, pressure: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="term-viscosity">Viscosity term (μ)</Label>
            <Switch
              id="term-viscosity"
              checked={terms.viscosity}
              onCheckedChange={(checked) => onTermsChange({ ...terms, viscosity: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="term-length">Length term (L)</Label>
            <Switch
              id="term-length"
              checked={terms.length}
              onCheckedChange={(checked) => onTermsChange({ ...terms, length: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="term-radius">Radius scaling (R²)</Label>
            <Switch
              id="term-radius"
              checked={terms.radiusScale}
              onCheckedChange={(checked) => onTermsChange({ ...terms, radiusScale: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="term-profile">Parabolic profile (1 - (r/R)²)</Label>
            <Switch
              id="term-profile"
              checked={terms.profile}
              onCheckedChange={(checked) => onTermsChange({ ...terms, profile: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="term-const">Constant factor (1/4)</Label>
            <Switch
              id="term-const"
              checked={terms.constant}
              onCheckedChange={(checked) => onTermsChange({ ...terms, constant: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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
  return (
    <>
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
                  onRadiusChange(possibleValue as number[])
                } else if (typeof possibleValue === 'number') {
                  onRadiusChange([possibleValue])
                } else {
                  const secondaryValue = args[1]
                  if (Array.isArray(secondaryValue)) onRadiusChange(secondaryValue as number[])
                  else if (typeof secondaryValue === 'number') onRadiusChange([secondaryValue])
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
              onValueChange={(value) => onPressureChange(Array.isArray(value) ? value : [value])}
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
              onValueChange={(value) => onViscosityChange(Array.isArray(value) ? value : [value])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="length">Length (L)</Label>
              <span className="text-sm font-medium">{length[0] < 1 ? length[0].toFixed(3) : length[0].toFixed(1)}</span>
            </div>
            <Slider
              id="length"
              min={0.001}
              max={100}
              step={0.001}
              value={length}
              onValueChange={(value) => onLengthChange(Array.isArray(value) ? value : [value])}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="vectors">Show Vectors</Label>
            <Switch id="vectors" checked={showVectors} onCheckedChange={(checked) => onShowVectorsChange(checked)} />
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

      <InlineFormulaExplorer terms={terms} onTermsChange={onTermsChange} />
    </>
  )
}


