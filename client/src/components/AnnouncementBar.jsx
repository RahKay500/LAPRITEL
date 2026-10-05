import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const messages = [
  'Production takes 5 to 7 working days',
  'Free shipping on all orders above GHS 1,000',
]

function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  function goTo(direction) {
    setIndex((current) => (current + direction + messages.length) % messages.length)
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-burgundy px-4 py-2.5 text-white sm:gap-4">
      <button
        type="button"
        aria-label="Previous announcement"
        onClick={() => goTo(-1)}
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>
      <p className="text-center text-[10px] font-medium tracking-wide sm:text-[12px]">
        {messages[index]}
      </p>
      <button
        type="button"
        aria-label="Next announcement"
        onClick={() => goTo(1)}
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default AnnouncementBar
