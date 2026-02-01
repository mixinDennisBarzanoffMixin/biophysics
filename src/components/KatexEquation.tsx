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

  return (
    <span
      ref={ref}
      className={
        block
          ? 'overflow-x-scroll overflow-y-hidden w-full py-2 scrollbar scrollbar-thumb-slate-300 scrollbar-track-slate-100'
          : 'inline-block'
      }
      style={{
        display: block ? 'block' : 'inline-block',
        scrollbarWidth: block ? 'auto' : undefined, // Firefox
        msOverflowStyle: block ? 'auto' : undefined, // IE/Edge
      }}
    />
  )
}


