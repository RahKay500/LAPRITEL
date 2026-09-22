import { Camera } from 'lucide-react'
import Reveal from './Reveal'
import ivyBagHotPink from '../assets/images/ivy_bag_hotpink.jpg'
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagWhite from '../assets/images/ivy_bag_white.jpeg'
import ivyBagSeaBlue from '../assets/images/ivy_bag_seablue.jpg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import igPhoto from '../assets/images/ivy_bag_ig_photo.jpg'
import igVideo1 from '../assets/images/ivy_bag_ig_video1.mp4'
import igVideo2 from '../assets/images/ivy_bag_ig_video2.mp4'

const tiles = [
  { type: 'video', src: igVideo1 },
  { type: 'image', src: ivyBagHotPink, fit: 'contain' },
  { type: 'image', src: ivyBagOrange, fit: 'contain' },
  { type: 'video', src: igVideo2 },
  { type: 'image', src: ivyBagWhite, fit: 'contain' },
  { type: 'image', src: ivyBagSeaBlue, fit: 'contain' },
  { type: 'image', src: igPhoto, fit: 'cover' },
  { type: 'image', src: ivyBagRed, fit: 'contain' },
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
            className={`flex aspect-square items-center justify-center bg-burgundy-tint/40 ${
              tile.fit === 'cover' || tile.type === 'video' ? '' : 'p-2'
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
              <img
                src={tile.src}
                alt="LAPRITEL handmade beaded bag"
                className={`h-full w-full ${tile.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
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
