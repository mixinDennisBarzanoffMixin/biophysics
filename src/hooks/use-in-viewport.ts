import * as React from "react"

type UseInViewportOptions = IntersectionObserverInit & {
  defaultInView?: boolean
}

export function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  options: UseInViewportOptions = {},
) {
  const { defaultInView = false, ...observerOptions } = options
  const [inView, setInView] = React.useState(defaultInView)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, observerOptions)

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold])

  return inView
}

