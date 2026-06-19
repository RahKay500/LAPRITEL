import Hero from '../components/Hero'
import FeaturedProduct from '../components/FeaturedProduct'
import ColorVariants from '../components/ColorVariants'
import BrandStory from '../components/BrandStory'
import Testimonials from '../components/Testimonials'
import InstagramStrip from '../components/InstagramStrip'
import Newsletter from '../components/Newsletter'

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProduct />
      <ColorVariants />
      <BrandStory />
      <Testimonials />
      <InstagramStrip />
      <Newsletter />
    </>
  )
}

export default HomePage
