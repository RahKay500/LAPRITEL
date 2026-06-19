import { useEffect, useState } from 'react'

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

  return (
    <div className="bg-burgundy px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
      {messages[index]}
    </div>
  )
}

export default AnnouncementBar
