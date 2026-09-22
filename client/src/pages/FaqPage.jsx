import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQS = [
  {
    question: 'Is this bag really handmade?',
    answer:
      "Yes — every bag is hand-beaded by skilled artisans, taking hours of careful work to complete.",
  },
  {
    question: 'How long will my order take?',
    answer: 'Since each bag is made to order, it ships in 3–5 weeks from the date you order.',
  },
  {
    question: 'Can I request a custom colour?',
    answer:
      'Yes — on Bag Ivy you can pick one custom colour, or two colours for a top-and-bottom combination, at no extra cost.',
  },
  {
    question: 'What if my bag arrives damaged?',
    answer:
      "Contact us within 48 hours of delivery and we'll arrange a replacement or refund.",
  },
  {
    question: 'How do I clean and care for my bag?',
    answer:
      'Wipe clean with a soft, dry cloth. Avoid water, perfume, and direct sunlight for extended periods to preserve the beadwork, and store it in the provided pouch when not in use.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept card and mobile money payments in Ghanaian cedis (GHS) through Paystack.',
  },
]

function FaqPage() {
  usePageMeta('FAQ', 'Answers to common questions about LAPRITEL bags, custom colours, and orders.')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">FAQ</h1>

        <div className="mt-8 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="border-b border-black/10 pb-6">
              <p className="font-semibold text-ink">{faq.question}</p>
              <p className="mt-2 text-ink/70">{faq.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-ink/70">
          Still have a question? Reach out through our{' '}
          <Link to="/contact" className="text-burgundy hover:underline">
            Contact page
          </Link>{' '}
          and we'll get back to you within 24 hours.
        </p>
      </div>
    </div>
  )
}

export default FaqPage
