import { Link } from 'react-router-dom'
import { ivyBagVariants } from '../data/ivyBagVariants'
import Reveal from './Reveal'

const COUNT_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve',
]

function ColorVariants() {
  const colorCount = ivyBagVariants.length
  const colorCountWord = COUNT_WORDS[colorCount] ?? colorCount

  return (
    <section className="bg-burgundy-tint px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Choose Your Color
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            Bag Ivy, hand-beaded in {colorCountWord} signature colorways.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {ivyBagVariants.map((variant, index) => (
            <Reveal key={variant.slug} delay={(index % 4) * 75}>
              <Link to={`/shop?color=${variant.slug}`} className="group">
                {variant.image ? (
                  <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                    <img
                      src={variant.image}
                      alt={`Bag Ivy in ${variant.name}`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                    <span
                      className="block h-14 w-14 rounded-full border border-black/10"
                      style={{ background: variant.hex }}
                    />
                  </div>
                )}
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink">
                  {variant.name}
                </p>
                <p className="mt-1 text-xs text-ink/60">GHS {variant.price}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ColorVariants
