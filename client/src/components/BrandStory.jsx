import { Link } from 'react-router-dom'
import storyImage from '../assets/images/ivy_bag_hotpink.jpg'
import Reveal from './Reveal'

function BrandStory() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="flex aspect-square w-full items-center justify-center bg-burgundy-tint/40">
            <img
              src={storyImage}
              alt="LAPRITEL Bag Ivy handcrafted with beads"
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Crafted by Hand, Made to Last
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            LAPRITEL began with a single idea: that every bead tells a story.
            Each Bag Ivy is hand-beaded by skilled artisans using
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
