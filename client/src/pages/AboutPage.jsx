import { Link } from 'react-router-dom'
import { Gem, Heart, Leaf } from 'lucide-react'
import storyImage from '../assets/images/ivy_bag_green.jpeg'
import craftImage from '../assets/images/ivy_bag_orange.jpg'
import { usePageMeta } from '../hooks/usePageMeta'

const values = [
  {
    icon: Gem,
    title: 'Uncompromising Quality',
    description:
      'Every bead is chosen and placed by hand. We would rather finish fewer bags than rush the ones we make.',
  },
  {
    icon: Heart,
    title: 'Heritage, Reimagined',
    description:
      'Our techniques are passed down through generations of artisans, shaped into silhouettes for the modern woman.',
  },
  {
    icon: Leaf,
    title: 'Made With Intention',
    description:
      'Small batches, considered materials, and fair pay for the hands that make each piece. Never mass production.',
  },
]

function AboutPage() {
  usePageMeta(
    'About Us',
    'The story behind LAPRITEL and the artisans who hand-bead every Ivy Bag.'
  )

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            About LAPRITEL
          </p>
          <h1 className="mt-3 font-heading text-3xl text-ink sm:text-4xl lg:text-5xl">
            Every Bead Tells a Story
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink/70">
            LAPRITEL is a handmade beaded bag brand built around a single,
            deliberate idea: that beauty and craftsmanship should never be
            rushed. We make the Ivy Bag, one design, perfected, in a range of
            colors as expressive as the women who carry it.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img
            src={storyImage}
            alt="The Ivy Bag, handcrafted with beads"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            decoding="async"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
              Our Story
            </p>
            <h2 className="mt-3 font-heading text-2xl text-ink sm:text-3xl">
              Crafted by Hand, Made to Last
            </h2>
            <p className="mt-4 max-w-md text-ink/70">
              LAPRITEL began at a dining table in Accra, where our founder
              spent evenings beading bags for herself and the women in her
              life. There was no business plan at first, just a love for the
              craft and a frustration that bags this detailed were so hard to
              find. Friends asked where she'd bought hers. Then friends of
              friends did too.
            </p>
            <p className="mt-4 max-w-md text-ink/70">
              What started as gifts grew, one bag at a time, into LAPRITEL.
              We named our signature design the Ivy Bag after the plant that
              grows slowly but holds firm once it takes root, which is exactly
              how we've built this brand: patiently, and on our own terms.
            </p>
            <p className="mt-4 max-w-md text-ink/70">
              We chose to stay small on purpose. Rather than chase trends or
              scale production, we focused on one bag, done properly, in
              colors that let every woman find her own.
            </p>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
              The Craft
            </p>
            <h2 className="mt-3 font-heading text-2xl text-ink sm:text-3xl">
              Hours of Work, Bead by Bead
            </h2>
            <p className="mt-4 max-w-md text-ink/70">
              Each Ivy Bag is hand-beaded by skilled artisans using
              time-honored techniques. The beadwork is dense and deliberate,
              built bead by bead onto the bag's frame until the pattern is
              complete. No shortcuts, just steady hands and a finished piece
              that's genuinely one of a kind.
            </p>
            <p className="mt-4 max-w-md text-ink/70">
              The result is a bag that feels as good as it looks: substantial,
              textured, and built to be worn for years, not seasons.
            </p>
          </div>
          <img
            src={craftImage}
            alt="Close-up of Ivy Bag beadwork"
            className="order-1 aspect-[4/3] w-full rounded-2xl object-cover lg:order-2"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
              What We Believe
            </p>
            <h2 className="mt-3 font-heading text-2xl text-ink sm:text-3xl">
              Our Values
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-burgundy-tint/40 p-6 text-center"
              >
                <Icon className="mx-auto text-burgundy" size={28} strokeWidth={1.5} />
                <p className="mt-4 font-heading text-lg text-ink">{title}</p>
                <p className="mt-2 text-sm text-ink/70">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="font-heading text-2xl text-ink sm:text-3xl">
            Ready to Find Your Color?
          </h2>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
          >
            Shop the Ivy Bag
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
