import { Camera } from 'lucide-react'
import Reveal from './Reveal'
// Dedicated small copies for this grid (displayed at ~135px) -- the plain
// (non-thumb) files are shared with larger contexts elsewhere (About page,
// Brand Story) and shouldn't be downsized. Each has a WebP sibling (~40%
// smaller, verified visually equivalent at q90) with the JPEG as a
// <picture> fallback for the rare browser that doesn't support WebP.
import ivyBagOrange from '../assets/images/ivy_bag_orange_thumb.jpg'
import ivyBagOrangeWebp from '../assets/images/ivy_bag_orange_thumb.webp'
import ivyBagWhite from '../assets/images/ivy_bag_white_thumb.jpeg'
import ivyBagWhiteWebp from '../assets/images/ivy_bag_white_thumb.webp'
import ivyBagRed from '../assets/images/ivy_bag_red_thumb.jpg'
import ivyBagRedWebp from '../assets/images/ivy_bag_red_thumb.webp'
import ivyBagBlack from '../assets/images/ivy_bag_black_thumb.jpg'
import ivyBagBlackWebp from '../assets/images/ivy_bag_black_thumb.webp'
import igVideo1 from '../assets/images/ivy_bag_ig_video1.mp4'
import igVideo2 from '../assets/images/ivy_bag_ig_video2.mp4'

const tiles = [
  { type: 'video', src: igVideo1 },
  { type: 'image', src: ivyBagOrange, webp: ivyBagOrangeWebp, fit: 'contain' },
  { type: 'image', src: ivyBagWhite, webp: ivyBagWhiteWebp, fit: 'contain' },
  { type: 'image', src: ivyBagBlack, webp: ivyBagBlackWebp, fit: 'contain' },
  { type: 'video', src: igVideo2 },
  { type: 'image', src: ivyBagRed, webp: ivyBagRedWebp, fit: 'contain' },
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
            className={`flex aspect-square items-center justify-center bg-burgundy-tint/40 ${
              tile.fit === 'cover' || tile.type === 'video' ? '' : 'sm:p-2'
            }`}
          >
            {tile.type === 'video' ? (
              <video
                src={tile.src}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <picture>
                <source srcSet={tile.webp} type="image/webp" />
                <img
                  src={tile.src}
                  alt="LAPRITEL handmade beaded bag"
                  className={`h-full w-full ${tile.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}

export default InstagramStrip
