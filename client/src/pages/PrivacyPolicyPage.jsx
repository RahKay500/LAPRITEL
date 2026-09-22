import { usePageMeta } from '../hooks/usePageMeta'

function PrivacyPolicyPage() {
  usePageMeta('Privacy Policy', 'How LAPRITEL collects, uses, and protects your information.')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink/60">Last updated: 20 June 2026</p>

        <div className="mt-8 space-y-8 text-ink/80">
          <section>
            <p>
              LAPRITEL ("we," "us," or "our") respects your privacy. This policy explains what
              information we collect when you use our website, why we collect it, and how it's
              handled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Information We Collect</h2>
            <p className="mt-3">We collect information you give us directly, including:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong>Account details:</strong> full name, email address, and phone number when
                you register.
              </li>
              <li>
                <strong>Order details:</strong> full name, email, phone number, and delivery
                address when you place an order.
              </li>
              <li>
                <strong>Contact form submissions:</strong> full name, email address, and the
                message you send us.
              </li>
            </ul>
            <p className="mt-3">
              We do not collect or store your card or mobile money details. Payments are
              processed entirely by Paystack, our payment provider — we only receive confirmation
              that a payment succeeded and the amount paid.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">How We Use Your Information</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>To process and deliver your orders.</li>
              <li>To create and manage your account.</li>
              <li>To send order confirmations and respond to enquiries you send us.</li>
              <li>To keep our store secure and prevent fraudulent orders.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties, and we do not use it for
              advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Who We Share It With</h2>
            <p className="mt-3">
              We share information with a small number of service providers who help us run
              LAPRITEL, and only to the extent needed for them to provide that service:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong>Paystack</strong> — to process payments securely.
              </li>
              <li>
                <strong>Supabase</strong> — to store account and order data securely.
              </li>
              <li>
                <strong>Google (Gmail)</strong> — to send order confirmation and account-related
                emails.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Cookies</h2>
            <p className="mt-3">
              We use a single essential cookie to keep you logged in after you sign in. It's
              required for your account to work and isn't used for advertising or tracking you
              across other websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Data Security</h2>
            <p className="mt-3">
              We take reasonable measures to protect your information, including encrypted
              connections (HTTPS), secure password storage, and restricting access to your data to
              what's needed to operate the store.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Your Rights</h2>
            <p className="mt-3">
              You can ask us to access, correct, or delete the personal information we hold about
              you at any time by reaching out through our{' '}
              <a href="/contact" className="text-burgundy hover:underline">
                Contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Changes to This Policy</h2>
            <p className="mt-3">
              We may update this policy from time to time. Significant changes will be reflected
              here with an updated "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">Contact Us</h2>
            <p className="mt-3">
              Questions about this policy or your data? Reach out through our{' '}
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

export default PrivacyPolicyPage
