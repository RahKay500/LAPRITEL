import { Link } from 'react-router-dom'
import { ivyBagVariants } from '../data/ivyBagVariants'

function ColorVariants() {
  return (
    <section className="bg-burgundy-tint px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-heading text-3xl text-ink sm:text-4xl">
          Choose Your Color
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          The Ivy Bag, hand-beaded in eight signature colorways.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {ivyBagVariants.map((variant) => (
            <Link
              key={variant.slug}
              to={`/shop?color=${variant.slug}`}
              className="group rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              {variant.image ? (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40 p-2">
                  <img
                    src={variant.image}
                    alt={`The Ivy Bag in ${variant.name}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-burgundy-tint/40">
                  <span
                    className="block h-14 w-14 rounded-full border border-black/10"
                    style={{ backgroundColor: variant.hex }}
                  />
                </div>
              )}
              <p className="mt-3 text-sm font-medium text-ink">{variant.name}</p>
              <p className="mt-1 text-xs text-ink/60">GHS {variant.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ColorVariants
