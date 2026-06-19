import { Link } from 'react-router-dom'
import heroImage from '../assets/images/ivy_bag_white.jpeg'

function Hero() {
  return (
    <section
      className="flex min-h-[70vh] items-center bg-cover bg-center px-4 sm:px-6 lg:min-h-[85vh] lg:px-12"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url(${heroImage})`,
      }}
    >
      <div className="max-w-xl py-20 text-white lg:py-0">
        <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
          The Ivy Bag
        </h1>
        <p className="mt-4 max-w-md text-base text-white/90 sm:text-lg">
          Handmade beaded bags, crafted one bead at a time. Elegant, timeless,
          and made for you.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
        >
          Shop the Ivy Bag
        </Link>
      </div>
    </section>
  )
}

export default Hero
