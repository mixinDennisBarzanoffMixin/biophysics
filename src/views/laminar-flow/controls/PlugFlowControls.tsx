import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/Slider'

export function PlugFlowControls({
  pressure,
  onPressureChange,
}: {
  pressure: number[]
  onPressureChange: (next: number[]) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="plug-pressure">Pressure Difference (ΔP)</Label>
            <span className="text-sm font-medium">{pressure[0]}</span>
          </div>
          <Slider
            id="plug-pressure"
            min={0}
            max={100}
            value={pressure}
            onValueChange={(val) => onPressureChange(Array.isArray(val) ? val : [val])}
          />
        </div>
      </CardContent>
    </Card>
  )
}


