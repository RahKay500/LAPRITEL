import { Link } from 'react-router-dom'

export default function RelatedBags({ relatedVariants, product }) {
  return (
    <div className="mt-20">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
        More Colorways
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
        {relatedVariants.map((variant) => (
          <Link key={variant.slug} to={`/shop/${product.slug}?color=${variant.slug}`}>
            {variant.image ? (
              <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                <img
                  src={variant.image}
                  alt={`${product.name} in ${variant.name}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
                <span
                  className="block h-10 w-10 rounded-full border border-black/10"
                  style={{ background: variant.hex }}
                />
              </div>
            )}
            <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-ink">
              {variant.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
