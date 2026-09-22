import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ivyBagVariants } from '../data/ivyBagVariants'
import hotPinkMobile from '../assets/images/ivy_bag_hotpink_mobile.jpg'
import seaBlueMobile from '../assets/images/ivy_bag_seablue_mobile.jpg'
import greenMobile from '../assets/images/ivy_bag_green_mobile.jpg'
import purpleMobile from '../assets/images/ivy_bag_purple_mobile.jpg'

const stats = [
  { value: '2,400+', label: 'Bags Sold' },
  { value: '48 hrs', label: 'Per Bag' },
  { value: `${ivyBagVariants.length}`, label: 'Colourways' },
]

const MOBILE_IMAGES = {
  'hot-pink': hotPinkMobile,
  'sea-blue': seaBlueMobile,
  green: greenMobile,
  purple: purpleMobile,
}

const HERO_SLUGS = ['hot-pink', 'sea-blue', 'green', 'purple']
const photoVariants = HERO_SLUGS.map((slug) =>
  ivyBagVariants.find((variant) => variant.slug === slug)
).filter((variant) => variant?.image)
const ROTATE_MS = 4000

function Hero() {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCycle((n) => n + 1)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const count = photoVariants.length
  const leftVariant = photoVariants[cycle % count]
  const rightVariant = photoVariants[(cycle + Math.floor(count / 2)) % count]

  return (
    <section className="relative overflow-hidden bg-burgundy">
      {leftVariant?.image && (
        <div className="relative h-[45vh] w-full sm:hidden">
          <img
            key={`mobile-bg-${leftVariant.slug}`}
            src={MOBILE_IMAGES[leftVariant.slug] ?? leftVariant.image}
            alt={`The Ivy Bag in ${leftVariant.name}`}
            className="hero-fade h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-burgundy/40 mix-blend-multiply" />
          <span className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />

          <div className="absolute inset-x-0 bottom-0 px-4 pb-6 text-center [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              The Ivy Bag &middot; New Season
            </p>

            <h1 className="mt-2 font-heading text-4xl leading-[0.95] text-white">
              Carry
              <br />
              <span className="text-burgundy-tint">art.</span>
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-snug text-white/70">
              Hand-beaded over 48 hours.
              <br />
              {ivyBagVariants.length} exclusive colourways.
            </p>

            <div className="mt-4 flex flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy-tint"
              >
                Shop the Ivy Bag
              </Link>
              <Link
                to="/shop"
                className="rounded-full border border-white/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-white"
              >
                See All Colours
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-7">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-xl text-white">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative hidden px-4 py-5 sm:block sm:px-6 sm:py-16 lg:px-12 lg:py-24">
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-heading text-[22vw] font-bold leading-none text-white/5 sm:text-[18vw]">
          LAPRITEL
        </span>

        {leftVariant?.image && (
          <img
            key={`left-${leftVariant.slug}`}
            src={leftVariant.image}
            alt={`The Ivy Bag in ${leftVariant.name}`}
            className="hero-swoop-left absolute left-2 top-1/2 hidden w-40 rounded-2xl object-cover shadow-2xl sm:block lg:left-10 lg:w-72"
          />
        )}
        {rightVariant?.image && (
          <img
            key={`right-${rightVariant.slug}`}
            src={rightVariant.image}
            alt={`The Ivy Bag in ${rightVariant.name}`}
            className="hero-swoop-right absolute right-2 top-1/2 hidden w-40 rounded-2xl object-cover shadow-2xl sm:block lg:right-10 lg:w-72"
          />
        )}

        <div className="relative mx-auto max-w-2xl text-center [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] sm:[text-shadow:none]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
            The Ivy Bag &middot; New Season
          </p>

          <h1 className="mt-2 font-heading text-4xl leading-[0.95] text-white sm:mt-6 sm:text-7xl lg:text-8xl">
            Carry
            <br />
            <span className="text-burgundy-tint">art.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-snug text-white/70 sm:mt-6 sm:text-lg">
            Hand-beaded over 48 hours.
            <br />
            {ivyBagVariants.length} exclusive colourways.
          </p>

          <div className="mt-4 flex flex-row items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy-tint sm:px-8 sm:py-3 sm:text-sm"
            >
              Shop the Ivy Bag
            </Link>
            <Link
              to="/shop"
              className="rounded-full border border-white/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-white sm:px-8 sm:py-3 sm:text-sm"
            >
              See All Colours
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-7 sm:mt-10 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-xl text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50 sm:mt-1 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
