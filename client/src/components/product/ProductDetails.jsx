import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SPECS = [
  { label: 'Style', value: 'Structured beaded handbag' },
  { label: 'Beadwork', value: 'Full coverage seed beads, hand-stitched' },
  { label: 'Dimensions', value: '22 cm × 18 cm × 8 cm' },
  { label: 'Carry', value: 'Top handle, 15 cm drop' },
]

export default function ProductDetails({ hasCustomVariants }) {
  const [isCareOpen, setIsCareOpen] = useState(false)
  const [isShippingOpen, setIsShippingOpen] = useState(false)
  const [isFaqOpen, setIsFaqOpen] = useState(false)

  return (
    <>
      <div className="mt-6 overflow-hidden border border-black/5">
        {SPECS.map((spec, index) => (
          <div
            key={spec.label}
            className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 ${
              index % 2 === 0 ? 'bg-white' : 'bg-burgundy-tint/40'
            }`}
          >
            <p className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
              {spec.label}
            </p>
            <p className="text-sm text-ink">{spec.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-black/10 pt-4">
        <button
          type="button"
          onClick={() => setIsCareOpen((open) => !open)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
        >
          Size & Care
          {isCareOpen ? (
            <ChevronUp size={16} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} />
          )}
        </button>
        {isCareOpen && (
          <div className="mt-3 space-y-2 text-sm text-ink/70">
            <p>Approx. 22cm wide x 18cm tall, with a 15cm handle drop.</p>
            <p>
              Wipe clean with a soft, dry cloth. Avoid water, perfume,
              and direct sunlight for extended periods to preserve the
              beadwork.
            </p>
            <p>Store in the provided pouch when not in use.</p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-black/10 pt-4">
        <button
          type="button"
          onClick={() => setIsShippingOpen((open) => !open)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
        >
          Shipping & Returns
          {isShippingOpen ? (
            <ChevronUp size={16} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} />
          )}
        </button>
        {isShippingOpen && (
          <div className="mt-3 space-y-2 text-sm text-ink/70">
            <p>
              Every bag is made to order and hand-beaded once you
              place your order &mdash; production takes 5&ndash;7
              working days, and your order ships as soon as it's
              done.
            </p>
            <p>
              Because each piece is handmade, we don't accept
              returns or exchanges for change of mind. If your bag
              arrives damaged, defective, or isn't what you ordered,
              contact us within 48 hours of delivery and we'll sort
              out a replacement or refund.
            </p>
            <p>
              <Link to="/refund-policy" className="text-burgundy hover:underline">
                Read the full Refund Policy
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-black/10 pt-4">
        <button
          type="button"
          onClick={() => setIsFaqOpen((open) => !open)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
        >
          FAQ
          {isFaqOpen ? (
            <ChevronUp size={16} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} />
          )}
        </button>
        {isFaqOpen && (
          <div className="mt-3 space-y-4 text-sm text-ink/70">
            <div>
              <p className="font-semibold text-ink">Is this bag really handmade?</p>
              <p className="mt-1">
                Yes — every bag is hand-beaded by skilled artisans, taking hours of
                careful work to complete.
              </p>
            </div>
            <div>
              <p className="font-semibold text-ink">How long will my order take?</p>
              <p className="mt-1">
                Since each bag is made to order, production takes 5&ndash;7 working
                days, and your order ships as soon as it's done.
              </p>
            </div>
            {hasCustomVariants && (
              <div>
                <p className="font-semibold text-ink">Can I request a custom colour?</p>
                <p className="mt-1">
                  Yes — scroll up to{' '}
                  <a href="#custom-colors" className="text-burgundy hover:underline">
                    Custom Colours
                  </a>{' '}
                  to pick one colour, or two colours for a top-and-bottom combination,
                  at no extra cost.
                </p>
              </div>
            )}
            <div>
              <p className="font-semibold text-ink">What if my bag arrives damaged?</p>
              <p className="mt-1">
                Contact us within 48 hours of delivery and we'll arrange a replacement
                or refund — see our{' '}
                <Link to="/refund-policy" className="text-burgundy hover:underline">
                  Refund Policy
                </Link>{' '}
                for details.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
