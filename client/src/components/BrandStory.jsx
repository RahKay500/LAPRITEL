import { Link } from 'react-router-dom'
import storyImage from '../assets/images/story_bag_square.jpg'
import Reveal from './Reveal'

function BrandStory() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Luxurious Handcrafted Timeless Pieces
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <img
              src={storyImage}
              alt="LAPRITEL handcrafted beaded bags"
              className="block aspect-square w-full"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-md text-ink/70">
              LAPRITEL began with a single idea: that every bead tells a story.
              Each Lapritèl Bag  is hand-beaded by skilled artisans using
              time-honored techniques, blending heritage craftsmanship with
              modern, elegant design.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-block border-b border-burgundy text-sm font-semibold uppercase tracking-wide text-burgundy"
            >
              Read Our Story
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
