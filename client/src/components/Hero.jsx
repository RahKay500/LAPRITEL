import { Link } from 'react-router-dom'
import heroImage from '../assets/images/ivy_bag_hero.jpg'

function Hero() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="font-heading text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            The Ivy Bag
          </h1>
          <p className="mt-4 max-w-md text-base text-ink/70 sm:text-lg">
            Handmade beaded bags, crafted one bead at a time. Elegant,
            timeless, and made for you.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
          >
            Shop Now
          </Link>
        </div>
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-burgundy-tint p-6">
          <img
            src={heroImage}
            alt="The Ivy Bag in purple"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
