import { ClientOnly } from './client'

export function generateStaticParams() {
  // With `output: 'export'`, Next needs concrete params for any dynamic segment.
  // For an optional catch-all, we at least need to provide the empty route.
  return [{ slug: [] }]
}

export default function Page() {
  return <ClientOnly />
}

