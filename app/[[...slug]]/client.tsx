'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../src/app').then(mod => mod.App), { ssr: false })

export function ClientOnly() {
  return <App />
}

