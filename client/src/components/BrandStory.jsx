import { Link } from 'react-router-dom'
import storyImage from '../assets/images/ivy_bag_green.jpeg'
import Reveal from './Reveal'

function BrandStory() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <img
            src={storyImage}
            alt="LAPRITEL Ivy Bag handcrafted with beads"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </Reveal>
        <Reveal delay={150}>
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Our Story
          </p>
          <h2 className="mt-3 font-heading text-3xl text-ink sm:text-4xl">
            Crafted by Hand, Made to Last
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            LAPRITEL began with a single idea: that every bead tells a story.
            Each Ivy Bag is hand-beaded by skilled artisans using
            time-honored techniques, blending heritage craftsmanship with
            modern, elegant design.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block border-b border-burgundy text-sm font-semibold uppercase tracking-wide text-burgundy"
          >
            Learn More
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default BrandStory
