import { Link } from 'react-router-dom'
import featuredImage from '../assets/images/ivy_bag_hotpink.jpeg'

function FeaturedProduct() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <img
          src={featuredImage}
          alt="The Ivy Bag in hot pink"
          className="aspect-square w-full rounded-2xl object-cover lg:order-2"
        />
        <div className="lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
            Featured
          </p>
          <h2 className="mt-3 font-heading text-3xl text-ink sm:text-4xl">
            The Ivy Bag
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            Each Ivy Bag is hand-beaded by skilled artisans, taking hours of
            careful work to complete. A statement piece designed to be worn
            for years to come.
          </p>
          <p className="mt-6 font-heading text-2xl text-burgundy">GHS 500</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProduct
