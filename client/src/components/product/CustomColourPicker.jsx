import { ChevronDown, ChevronUp } from 'lucide-react'
import ColorSwatch from '../ColorSwatch'

export default function CustomColourPicker({
  variants,
  mode,
  isOpen,
  onToggle,
  onSingleMode,
  onTwoToneMode,
  selectedSlug,
  onSelectSingle,
  topSlug,
  bottomSlug,
  topVariant,
  bottomVariant,
  isTwoToneReady,
  onTopColor,
  onBottomColor,
}) {
  return (
    <div id="custom-colors" className="mt-6 scroll-mt-24 border-t border-black/10 pt-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-burgundy">
          Want a different shade? &mdash; Custom colours, made to order
        </span>
        {isOpen ? (
          <ChevronUp size={16} strokeWidth={1.5} className="shrink-0 text-ink/60" />
        ) : (
          <ChevronDown size={16} strokeWidth={1.5} className="shrink-0 text-ink/60" />
        )}
      </button>

      {isOpen && (
        <>

      {variants.length > 1 && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onSingleMode()}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
              mode === 'single'
                ? 'border-burgundy bg-burgundy text-white'
                : 'border-black/10 text-ink/60 hover:border-burgundy'
            }`}
          >
            One Colour
          </button>
          <button
            type="button"
            onClick={onTwoToneMode}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
              mode === 'two-tone'
                ? 'border-burgundy bg-burgundy text-white'
                : 'border-black/10 text-ink/60 hover:border-burgundy'
            }`}
          >
            Two Colours
          </button>
        </div>
      )}

      {mode === 'single' ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.slug}
              type="button"
              aria-label={`${variant.name} (custom)`}
              onClick={() => onSelectSingle(variant.slug)}
              className={`h-9 w-9 rounded-full border-2 transition-colors ${
                variant.slug === selectedSlug
                  ? 'border-burgundy'
                  : 'border-transparent hover:border-black/20'
              }`}
            >
              <ColorSwatch
                hex={variant.hex}
                image={variant.image}
                alt={variant.name}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">
              Top colour{topVariant ? ` — ${topVariant.name}` : ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants
                .filter((variant) => variant.slug !== bottomSlug)
                .map((variant) => (
                  <button
                    key={variant.slug}
                    type="button"
                    aria-label={`${variant.name} (top, custom)`}
                    onClick={() => onTopColor(variant.slug)}
                    className={`h-9 w-9 rounded-full border-2 transition-colors ${
                      variant.slug === topSlug
                        ? 'border-burgundy'
                        : 'border-transparent hover:border-black/20'
                    }`}
                  >
                    <ColorSwatch
                      hex={variant.hex}
                      image={variant.image}
                      alt={variant.name}
                      className="h-full w-full"
                    />
                  </button>
                ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">
              Bottom colour{bottomVariant ? ` — ${bottomVariant.name}` : ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants
                .filter((variant) => variant.slug !== topSlug)
                .map((variant) => (
                  <button
                    key={variant.slug}
                    type="button"
                    aria-label={`${variant.name} (bottom, custom)`}
                    onClick={() => onBottomColor(variant.slug)}
                    className={`h-9 w-9 rounded-full border-2 transition-colors ${
                      variant.slug === bottomSlug
                        ? 'border-burgundy'
                        : 'border-transparent hover:border-black/20'
                    }`}
                  >
                    <ColorSwatch
                      hex={variant.hex}
                      image={variant.image}
                      alt={variant.name}
                      className="h-full w-full"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-ink/50">
        {mode === 'two-tone'
          ? isTwoToneReady
            ? 'Hand-beaded to order in your two chosen colours — no preview photo, same price.'
            : 'Pick a top and a bottom colour to continue.'
          : 'Hand-beaded to order in your chosen colour — no preview photo, same price.'}
      </p>
        </>
      )}
    </div>
  )
}
