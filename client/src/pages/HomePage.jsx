import Hero from '../components/Hero'
import OurBags from '../components/OurBags'
import ColorVariants from '../components/ColorVariants'
import BrandStory from '../components/BrandStory'
import InstagramStrip from '../components/InstagramStrip'
import Newsletter from '../components/Newsletter'
import { usePageMeta } from '../hooks/usePageMeta'

function HomePage() {
  usePageMeta()

  return (
    <>
      <Hero />
      <OurBags />
      <BrandStory />
      <ColorVariants />
      <InstagramStrip />
      <Newsletter />
    </>
  )
}

export default HomePage
