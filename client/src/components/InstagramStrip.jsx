import { useEffect, useRef } from 'react'
import { Camera } from 'lucide-react'
import Reveal from './Reveal'
// This grid is full-bleed (no max-width cap), so cells can run 400-600px+
// wide on desktop. Use the same 800x800 originals shared with the About
// page / Brand Story rather than a downsized copy -- a smaller copy looks
// sharp at the ~135px mobile size but blurs once stretched to fill a much
// bigger desktop cell.
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import igVideo1 from '../assets/images/ivy_bag_ig_video1.mp4'
import igVideo2 from '../assets/images/ivy_bag_ig_video2.mp4'
import fringeBagGreen from '../assets/images/follow_fringe.jpg'
import fringeBagPink from '../assets/images/follow_pink.jpg'

const tiles = [
  { type: 'video', src: igVideo1 },
  { type: 'image', src: ivyBagOrange },
  { type: 'image', src: fringeBagGreen },
  { type: 'image', src: fringeBagPink },
  { type: 'video', src: igVideo2 },
  { type: 'image', src: ivyBagRed },
]

function VideoTile({ src }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    el.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="none"
    />
  )
}

function InstagramStrip() {
  return (
    <section className="py-16 lg:py-24">
      <Reveal className="px-4 text-center sm:px-6 lg:px-12">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Follow Along
        </h2>
        <a
          href="https://instagram.com/lapritel"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-burgundy hover:underline"
        >
          <Camera size={18} strokeWidth={1.5} />
          @lapritel
        </a>
      </Reveal>

      <div className="mt-8 grid grid-cols-3 gap-1 sm:gap-2">
        {tiles.map((tile) => (
          <a
            key={tile.src}
            href="https://instagram.com/lapritel"
            target="_blank"
            rel="noreferrer"
            aria-label="View @lapritel on Instagram"
            className="flex aspect-square items-center justify-center bg-burgundy-tint/40"
          >
            {tile.type === 'video' ? (
              <VideoTile src={tile.src} />
            ) : (
              <img
                src={tile.src}
                alt="LAPRITEL handmade beaded bag"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </a>
        ))}
      </div>
    </section>
  )
}

export default InstagramStrip
