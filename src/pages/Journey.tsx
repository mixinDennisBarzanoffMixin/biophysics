import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type JourneyEntry = {
  id: string
  title: string
  summary: string
  date?: string
  status: 'wip' | 'draft' | 'done'
  tags?: string[]
}

const entries: JourneyEntry[] = [
  {
    id: 'laminar-flow',
    title: 'Laminar Flow (notes + sims)',
    summary:
      'My first “blood vessel physics” page: from oversimplifications → why they fail → the real model.',
    date: '2025-12-17',
    status: 'wip',
    tags: ['flow', 'poiseuille', 'intuition', 'sim'],
  },
  {
    id: 'reynolds-number',
    title: 'Reynolds number (draft)',
    summary: 'When laminar stops being laminar, and why.',
    status: 'draft',
    tags: ['dimensionless', 'stability'],
  },
  {
    id: 'pulsatile-flow',
    title: 'Pulsatile flow / Womersley (draft)',
    summary: 'Blood isn’t steady. What changes when pressure oscillates.',
    status: 'draft',
    tags: ['womersley', 'pulsatile'],
  },
]

function StatusBadge({ status }: { status: JourneyEntry['status'] }) {
  if (status === 'done') return <Badge className="bg-emerald-600">done</Badge>
  if (status === 'wip') return <Badge className="bg-amber-600">wip</Badge>
  return <Badge variant="secondary">draft</Badge>
}

export function Journey({
  onOpenEntry,
  onContinue,
}: {
  onOpenEntry: (entryId: string) => void
  onContinue?: () => void
}) {
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Journey</h1>
          <p className="text-slate-600 mt-1 max-w-[70ch]">
            Each page is a story of how I learned a piece of blood vessel physics—notes,
            mistakes, simplifications, and small interactive simulations that match my current
            understanding.
          </p>
        </div>
        {onContinue && (
          <Button onClick={onContinue} className="shrink-0">
            Continue
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {entries.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onOpenEntry(e.id)}
              className="text-left rounded-lg border bg-white p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{e.title}</div>
                    <StatusBadge status={e.status} />
                    {e.date && (
                      <span className="text-xs text-slate-500 font-mono">{e.date}</span>
                    )}
                  </div>
                  <div className="text-slate-600 mt-1">{e.summary}</div>
                </div>
              </div>
              {e.tags && e.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}


