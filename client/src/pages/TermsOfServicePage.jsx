import { usePageMeta } from '../hooks/usePageMeta'

function TermsOfServicePage() {
  usePageMeta('Terms of Service', 'The terms that govern your use of the LAPRITEL website and orders.')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink/60">Last updated: 23 June 2026</p>

        <div className="mt-8 space-y-8 text-ink/80">
          <section>
            <p>
              These Terms of Service ("Terms") govern your use of the LAPRITEL website and your
              purchase of products from us. By placing an order or using our website, you agree to
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Use of Our Website</h2>
            <p className="mt-3">
              You agree to use our website only for lawful purposes and in a way that does not
              infringe on the rights of others or restrict their use of the site. You must provide
              accurate information when creating an account or placing an order.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Products and Pricing</h2>
            <p className="mt-3">
              All products are handmade, so slight variations in beadwork, color, and finish
              between pieces are normal and not considered defects. Prices are listed in Ghana
              Cedis (GHS) and may change at any time without notice. We make reasonable efforts to
              display accurate pricing and product information, but errors may occasionally occur.
              If we discover a pricing error on an order you've placed, we'll contact you before
              processing it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Orders and Payment</h2>
            <p className="mt-3">
              An order is only confirmed once payment has been successfully processed through
              Paystack, our payment provider. We reserve the right to refuse or cancel any order,
              including for suspected fraud, pricing errors, or stock unavailability. If we cancel
              a paid order, you will receive a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Shipping and Delivery</h2>
            <p className="mt-3">
              Delivery times provided at checkout are estimates and not guarantees. We are not
              responsible for delays caused by courier services, incorrect delivery details
              provided by you, or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Returns and Refunds</h2>
            <p className="mt-3">
              Returns, exchanges, and refunds are handled in accordance with our{' '}
              <a href="/refund-policy" className="text-burgundy hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Intellectual Property</h2>
            <p className="mt-3">
              All content on this website, including product photography, designs, text, and the
              LAPRITEL name and logo, is the property of LAPRITEL and may not be copied,
              reproduced, or used without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, LAPRITEL is not liable for any indirect,
              incidental, or consequential damages arising from your use of our website or
              products. Our total liability for any claim relating to an order will not exceed the
              amount you paid for that order.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of the Republic of Ghana, without regard to
              conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Changes to These Terms</h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of our website after
              changes are posted means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl text-ink">Contact Us</h2>
            <p className="mt-3">
              Questions about these Terms? Reach out through our{' '}
              <a href="/contact" className="text-burgundy hover:underline">
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
