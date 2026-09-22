import { Star } from 'lucide-react'
import Reveal from './Reveal'

const testimonials = [
  {
    name: 'Mella.',
    quote:
      'The quality is stunning. You can tell every bead was placed with care. I get compliments every time I wear it.',
  },
  {
    name: 'Naa Korkor.',
    quote:
      'My Ivy Bag arrived beautifully packaged and exceeded my expectations. Truly a statement piece.',
  },
  {
    name: 'Prilla.',
    quote:
      'Elegant, well-made, and so unique. LAPRITEL has become my go-to gift for special occasions.',
  },
]

function Testimonials() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <h2 className="font-heading text-3xl text-ink sm:text-4xl">
            What Our Customers Say
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.name}
              delay={index * 100}
              className="rounded-2xl bg-burgundy-tint p-6 text-left"
            >
              <div className="flex gap-1 text-burgundy">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-sm text-ink/80">“{testimonial.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-ink">
                {testimonial.name}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
