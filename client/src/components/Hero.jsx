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

  return (
    <section className="relative overflow-hidden bg-burgundy">
      {leftVariant?.image && (
        <div className="sm:hidden">
          <div className="aspect-square w-full">
            <img
              key={`mobile-bg-${leftVariant.slug}`}
              src={MOBILE_IMAGES[leftVariant.slug] ?? leftVariant.image}
              alt={`The Ivy Bag in ${leftVariant.name}`}
              className="hero-fade h-full w-full object-cover"
            />
          </div>

          <div className="px-4 py-8 text-center">
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

            <div className="mt-4 flex flex-row items-center justify-center gap-5">
              <Link
                to="/shop"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy-tint"
              >
                Shop the Ivy Bag
              </Link>
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
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

      <div className="relative hidden px-4 py-12 sm:block sm:px-6 sm:py-16 lg:px-12 lg:py-20">
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-heading text-[18vw] font-bold leading-none text-white/5">
          LAPRITEL
        </span>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              The Ivy Bag &middot; New Season
            </p>

            <h1 className="mt-6 font-heading text-6xl leading-[0.95] text-white lg:text-7xl">
              Carry
              <br />
              <span className="text-burgundy-tint">art.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-sm text-lg leading-snug text-white/70 lg:mx-0">
              Hand-beaded over 48 hours.
              <br />
              {ivyBagVariants.length} exclusive colourways.
            </p>

            <div className="mt-8 flex flex-row items-center justify-center gap-6 lg:justify-start">
              <Link
                to="/shop"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-burgundy transition-colors hover:bg-burgundy-tint"
              >
                Shop the Ivy Bag
              </Link>
              <Link
                to="/shop"
                className="text-sm font-semibold uppercase tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                See All Colours
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-10 lg:justify-start lg:gap-16">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-3xl text-white">{stat.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {leftVariant?.image && (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl lg:max-w-md">
              <img
                key={`hero-panel-${leftVariant.slug}`}
                src={leftVariant.image}
                alt={`The Ivy Bag in ${leftVariant.name}`}
                className="hero-fade h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                <p className="font-heading text-sm italic text-white">
                  {leftVariant.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
