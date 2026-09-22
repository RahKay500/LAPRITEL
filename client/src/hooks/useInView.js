import { useEffect, useRef, useState } from 'react'

export function useInView(options) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, { threshold: 0.3, rootMargin: '0px 0px -180px 0px', ...options })

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, isInView]
}
