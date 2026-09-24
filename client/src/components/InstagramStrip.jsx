import { Camera } from 'lucide-react'
import Reveal from './Reveal'
// This grid is full-bleed (no max-width cap), so cells can run 400-600px+
// wide on desktop. Use the same 800x800 originals shared with the About
// page / Brand Story rather than a downsized copy -- a smaller copy looks
// sharp at the ~135px mobile size but blurs once stretched to fill a much
// bigger desktop cell.
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagWhite from '../assets/images/ivy_bag_white.jpeg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import ivyBagBlack from '../assets/images/ivy_bag_black.jpg'
import igVideo1 from '../assets/images/ivy_bag_ig_video1.mp4'
import igVideo2 from '../assets/images/ivy_bag_ig_video2.mp4'

const tiles = [
  { type: 'video', src: igVideo1 },
  { type: 'image', src: ivyBagOrange },
  { type: 'image', src: ivyBagWhite },
  { type: 'image', src: ivyBagBlack },
  { type: 'video', src: igVideo2 },
  { type: 'image', src: ivyBagRed },
]

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
              <video
                // React sets `muted` as a DOM property, not an HTML attribute,
                // and only after the initial render -- so by the time Chrome
                // evaluates autoplay eligibility (as soon as metadata loads),
                // the element can still look unmuted and autoplay silently
                // gets blocked for good (it doesn't retry on its own). Setting
                // `muted` explicitly here before calling play() avoids that
                // race. play() also needs to fire again once real data is
                // available -- with preload="metadata" the element has no
                // frame data yet at mount, and a play() call made that early
                // gets silently dropped rather than queued.
                ref={(el) => {
                  if (!el) return
                  el.muted = true
                  const tryPlay = () => el.play().catch(() => {})
                  tryPlay()
                  el.addEventListener('canplay', tryPlay, { once: true })
                }}
                src={tile.src}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
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
