'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ReynoldsNumberPage() {
  const router = useRouter()

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/journey')}>
          Back
        </Button>
      </div>
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Reynolds number (draft)</h1>
        <p className="text-slate-600">
          When laminar stops being laminar, and why. (Coming soon)
        </p>
      </div>
    </div>
  )
}



