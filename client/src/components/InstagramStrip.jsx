import { Camera } from 'lucide-react'
import Reveal from './Reveal'
import ivyBagWhite from '../assets/images/ivy_bag_white.jpeg'
import ivyBagHotPink from '../assets/images/ivy_bag_hotpink.jpg'
import ivyBagGreen from '../assets/images/ivy_bag_green.jpeg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import ivyBagPurple from '../assets/images/ivy_bag_purple.jpg'
import ivyBagSeaBlue from '../assets/images/ivy_bag_seablue.jpg'
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagRainbow from '../assets/images/ivy_bag_rainbow.jpg'

const tiles = [
  ivyBagRainbow,
  ivyBagHotPink,
  ivyBagOrange,
  ivyBagPurple,
  ivyBagWhite,
  ivyBagSeaBlue,
  ivyBagGreen,
  ivyBagRed,
]

function InstagramStrip() {
  return (
    <section className="py-16 lg:py-24">
      <Reveal className="px-4 text-center sm:px-6 lg:px-12">
        <h2 className="font-heading text-3xl text-ink sm:text-4xl">
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
        {tiles.map((image) => (
          <a
            key={image}
            href="https://instagram.com/lapritel"
            target="_blank"
            rel="noreferrer"
            className="flex aspect-square items-center justify-center bg-burgundy-tint/40 p-2"
          >
            <img
              src={image}
              alt="LAPRITEL Ivy Bag"
              className="h-full w-full object-contain"
            />
          </a>
        ))}
      </div>
    </section>
  )
}

export default InstagramStrip
