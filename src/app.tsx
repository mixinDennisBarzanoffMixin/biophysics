import { useState } from 'preact/hooks'
import { LaminarFlow } from './pages/LaminarFlow'
import { Docs } from './pages/Docs'
import { Button } from '@/components/ui/button'
import { VercelBlock } from './pages/Examples'
import './app.css'

type Page = 'docs' | 'laminar' | 'examples'

export function App() {
  const [page, setPage] = useState<Page>('docs')

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
            variant={page === 'docs' ? 'default' : 'outline'}
            onClick={() => setPage('docs')}
          >
            Docs
          </Button>
          <Button
            variant={page === 'laminar' ? 'default' : 'outline'}
            onClick={() => setPage('laminar')}
          >
            Laminar Flow Sim
          </Button>
          <Button
            variant={page === 'examples' ? 'default' : 'outline'}
            onClick={() => setPage('examples')}
          >
            UI Examples
          </Button>
        </nav>
      </header>

      <main className="app-main">
        {page === 'docs' ? <Docs onOpenSim={() => setPage('laminar')} /> : 
         page === 'laminar' ? <LaminarFlow /> : 
         <VercelBlock />}
      </main>
    </div>
  )
}
