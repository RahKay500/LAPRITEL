export default function ColourPicker({ variants, selected, onSelect }) {
  return (
    <>
      {variants.length > 1 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
            {selected.isCustom ? 'Custom Colour' : 'Colour'} &mdash;{' '}
            <span className="text-burgundy">{selected.name}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.slug}
                type="button"
                aria-label={variant.name}
                onClick={() => onSelect(variant.slug)}
                className={`h-9 w-9 rounded-full border-2 transition-colors ${
                  variant.slug === selected.slug
                    ? 'border-burgundy'
                    : 'border-transparent hover:border-black/20'
                }`}
              >
                <span
                  className="block h-full w-full rounded-full border border-black/10"
                  style={{ background: variant.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
