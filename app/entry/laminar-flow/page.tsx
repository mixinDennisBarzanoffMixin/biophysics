'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LaminarFlow } from '@/views/laminar-flow/LaminarFlow'

export default function LaminarFlowPage() {
  const router = useRouter()

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/journey')}>
          Back
        </Button>
      </div>
      <LaminarFlow />
    </div>
  )
}

