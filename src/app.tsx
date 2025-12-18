import { useState } from 'react'
import { LaminarFlow } from './views/laminar-flow/LaminarFlow'
import { Docs } from './views/Docs'
import { Journey } from './views/Journey'
import { Button } from '@/components/ui/button'
import { VercelBlock } from './views/Examples'
import './app.css'

type Route =
  | { page: 'journey' }
  | { page: 'entry'; entryId: string }
  | { page: 'examples' }

export function App() {
  const [route, setRoute] = useState<Route>({ page: 'journey' })

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="dot" />
          <div>
            <div className="title">Biophysics Lab</div>
            <div className="subtitle">Interactive notes & simulations</div>
          </div>
        </div>
        <nav className="nav">
          <Button
            variant={route.page === 'journey' ? 'default' : 'outline'}
            onClick={() => setRoute({ page: 'journey' })}
          >
            Journey
          </Button>
          <Button
            variant={route.page === 'examples' ? 'default' : 'outline'}
            onClick={() => setRoute({ page: 'examples' })}
          >
            UI Examples
          </Button>
          {route.page === 'entry' && (
            <Button variant="outline" onClick={() => setRoute({ page: 'journey' })}>
              Back
            </Button>
          )}
        </nav>
      </header>

      <main className="app-main">
        {route.page === 'journey' ? (
          <Journey
            onOpenEntry={(entryId: string) => setRoute({ page: 'entry', entryId })}
            onContinue={() => setRoute({ page: 'entry', entryId: 'laminar-flow' })}
          />
        ) : route.page === 'entry' ? (
          route.entryId === 'laminar-flow' ? (
            <LaminarFlow />
          ) : (
            <div className="p-8 max-w-[900px] mx-auto">
              <div className="text-2xl font-bold mb-2">Not written yet</div>
              <div className="text-slate-600">
                Entry <span className="font-mono">{route.entryId}</span> is a placeholder.
              </div>
            </div>
          )
        ) : (
          <VercelBlock />
        )}
      </main>
    </div>
  )
}

