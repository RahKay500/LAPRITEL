import { usePageMeta } from '../hooks/usePageMeta'

function RefundPolicyPage() {
  usePageMeta('Refund Policy', 'When a refund or exchange is available for your Ivy Bag order.')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">Refund Policy</h1>
        <p className="mt-2 text-sm text-ink/60">Last updated: 23 June 2026</p>

        <div className="mt-8 space-y-8 text-ink/80">
          <section>
            <p>
              Every Ivy Bag is handmade, which means small variations in beadwork, color, and
              finish are part of what makes each piece unique, not a fault. Because of this, we
              don't offer returns or exchanges for change of mind. This policy explains the
              situations in which a refund or exchange is available.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Damaged or Defective Items</h2>
            <p className="mt-3">
              If your bag arrives damaged or with a genuine fault, contact us within 48 hours of
              delivery through our{' '}
              <a href="/contact" className="text-burgundy hover:underline">
                Contact page
              </a>{' '}
              with your order number and clear photos of the issue. We'll review your claim and, if
              approved, offer a replacement or a full refund, whichever you prefer and whichever we
              are able to fulfil.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Wrong Item Received</h2>
            <p className="mt-3">
              If we send you the wrong color or item, let us know within 48 hours of delivery and
              we'll arrange a replacement at no extra cost or a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Order Cancellations</h2>
            <p className="mt-3">
              You can request to cancel an order before it has been shipped by contacting us as
              soon as possible. Once an order has shipped, it can no longer be cancelled.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">How Refunds Are Processed</h2>
            <p className="mt-3">
              Approved refunds are issued to the original payment method through Paystack and
              typically reflect within 5 to 10 business days, depending on your bank or mobile
              money provider. We do not issue cash refunds.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">What's Not Covered</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Change of mind after an order has been placed or delivered.</li>
              <li>Minor variations in beadwork, color, or texture that come with handmade items.</li>
              <li>Damage caused by misuse after delivery.</li>
              <li>Claims made more than 48 hours after delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Contact Us</h2>
            <p className="mt-3">
              Have a question about a refund or a recent order? Reach out through our{' '}
              <a href="/contact" className="text-burgundy hover:underline">
                Contact page
              </a>{' '}
              and we'll get back to you within 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicyPage
