import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/Switch'
import { KatexEquation } from '@/components/KatexEquation'
import { buildVelocityTex, type FormulaTerms } from '@/lib/laminar-formula'

export function FormulaExplorer({
  terms,
  onTermsChange,
  title = 'Formula Explorer',
}: {
  terms: FormulaTerms
  onTermsChange: (next: FormulaTerms) => void
  title?: string
}) {
  const velocityTex = buildVelocityTex(terms)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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


