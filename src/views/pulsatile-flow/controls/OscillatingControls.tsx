import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/Slider'
import { KatexEquation } from '@/components/KatexEquation'

export function OscillatingControls({
  period,
  onPeriodChange,
  amplitude,
  onAmplitudeChange,
}: {
  period: number[]
  onPeriodChange: (next: number[]) => void
  amplitude: number[]
  onAmplitudeChange: (next: number[]) => void
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Oscillation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Period Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="period" className="font-semibold flex items-center gap-2">
                Period <span className="font-normal text-slate-500">(s)</span>
              </Label>
              <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{Number(period?.[0] ?? 1.5).toFixed(1)}</span>
            </div>
            <Slider
              id="period"
              min={0.5}
              max={3.0}
              step={0.1}
              value={period}
              onValueChange={(val) => onPeriodChange(Array.isArray(val) ? val : [val])}
            />
          </div>

          {/* Amplitude Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amplitude" className="font-semibold flex items-center gap-2">
                Amplitude Scale
              </Label>
              <span className="text-sm font-mono bg-slate-100 px-1.5 py-0.5 rounded">{Number(amplitude?.[0] ?? 1.0).toFixed(1)}</span>
            </div>
            <Slider
              id="amplitude"
              min={0.1}
              max={2.0}
              step={0.1}
              value={amplitude}
              onValueChange={(val) => onAmplitudeChange(Array.isArray(val) ? val : [val])}
            />
          </div>
          
          <div className="text-sm text-slate-500 mt-4">
            Adjust the heartbeat rhythm and strength.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}