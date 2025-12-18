import { useEffect, useRef } from 'react'
import katex from 'katex'

export function KatexEquation({ tex, block = false }: { tex: string; block?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    katex.render(tex, ref.current, {
      throwOnError: false,
      displayMode: block,
    })
  }, [tex, block])

  return <div ref={ref} style={{ display: block ? 'block' : 'inline-block' }} />
}


