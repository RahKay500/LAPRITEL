import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

function ShippingReturnsPage() {
  usePageMeta('Shipping & Returns', 'How shipping, delivery, and returns work for your LAPRITEL order.')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Shipping & Returns
        </h1>

        <div className="mt-8 space-y-8 text-ink/80">
          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Shipping</h2>
            <p className="mt-3">
              Every bag is made to order and hand-beaded once you place your order. Production
              takes 5&ndash;7 working days, and your order ships as soon as it's done. We'll keep
              you posted on your order status by email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Returns & Exchanges</h2>
            <p className="mt-3">
              Because each piece is handmade, small variations in beadwork, color, and finish are
              part of what makes it unique, not a fault — so we don't accept returns or exchanges
              for change of mind.
            </p>
            <p className="mt-3">
              If your bag arrives damaged, defective, or isn't what you ordered, contact us within
              48 hours of delivery and we'll arrange a replacement or a full refund.
            </p>
            <p className="mt-3">
              <Link to="/refund-policy" className="text-burgundy hover:underline">
                Read the full Refund Policy
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Questions?</h2>
            <p className="mt-3">
              Reach out through our{' '}
              <Link to="/contact" className="text-burgundy hover:underline">
                Contact page
              </Link>{' '}
              and we'll get back to you within 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ShippingReturnsPage
