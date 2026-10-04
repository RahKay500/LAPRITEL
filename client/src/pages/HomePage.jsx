import Hero from '../components/Hero'
import OurBags from '../components/OurBags'
import BrandStory from '../components/BrandStory'
import InstagramStrip from '../components/InstagramStrip'
import FeaturedCustomers from '../components/FeaturedCustomers'
import Newsletter from '../components/Newsletter'
import { usePageMeta } from '../hooks/usePageMeta'

function HomePage() {
  usePageMeta()

  return (
    <>
      <Hero />
      <OurBags />
      <BrandStory />
      <InstagramStrip />
      <FeaturedCustomers />
      <Newsletter />
    </>
  )
}

export default HomePage
