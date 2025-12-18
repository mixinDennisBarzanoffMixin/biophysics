'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function AppHeader() {
  const pathname = usePathname()
  const onJourney = pathname === '/journey' || pathname === '/'
  const onExamples = pathname === '/examples'

  return (
    <header className="app-header">
      <div className="brand">
        <span className="dot" />
        <div>
          <div className="title">Biophysics Lab</div>
          <div className="subtitle">Interactive notes & simulations</div>
        </div>
      </div>

      <nav className="nav">
        <Link href="/journey">
          <Button variant={onJourney ? 'default' : 'outline'}>Journey</Button>
        </Link>
        <Link href="/examples">
          <Button variant={onExamples ? 'default' : 'outline'}>UI Examples</Button>
        </Link>
      </nav>
    </header>
  )
}


