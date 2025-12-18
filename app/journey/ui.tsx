'use client'

import { useRouter } from 'next/navigation'
import { Journey } from '@/views/Journey'

export function JourneyClient() {
  const router = useRouter()

  return (
    <Journey
      onOpenEntry={(entryId: string) => router.push(`/entry/${entryId}`)}
      onContinue={() => router.push('/entry/laminar-flow')}
    />
  )
}


