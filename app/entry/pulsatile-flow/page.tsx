'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PulsatileFlowPage() {
  const router = useRouter()

  return (
    <div className="py-6 sm:px-6 lg:px-10">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/journey')}>
          Back
        </Button>
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Pulsatile flow / Womersley (draft)</h1>
        <p className="text-slate-600">
          Blood isn’t steady. What changes when pressure oscillates. (Coming soon)
        </p>
      </div>
    </div>
  )
}




