import { useEffect, useRef, useState } from 'react'

export function useInView(options) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    // Fires as soon as the element's top edge touches the bottom of the
    // viewport (threshold 0, no inset), so sections pop in right as they
    // start showing instead of needing to scroll them a couple hundred
    // pixels further up first.
    }, { threshold: 0, rootMargin: '0px', ...options })

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, isInView]
}
