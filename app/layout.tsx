import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import '../src/app.css'
import { AppHeader } from './ui/AppHeader'

export const metadata: Metadata = {
  title: 'biophysics-app',
  description: 'Biophysics Lab - Interactive notes & simulations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="app">
          <AppHeader />
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  )
}

