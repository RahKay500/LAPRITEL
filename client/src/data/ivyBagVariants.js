import ivyBagWhite from '../assets/images/ivy_bag_white.jpeg'
import ivyBagHotPink from '../assets/images/ivy_bag_hotpink.jpg'
import ivyBagGreen from '../assets/images/ivy_bag_green.jpeg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import ivyBagLightPink from '../assets/images/ivy_bag_lightpink.jpg'
import ivyBagPurple from '../assets/images/ivy_bag_purple.jpg'
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagBlack from '../assets/images/ivy_bag_black.jpg'

// Sea Blue and Rainbow used to be listed here as Ivy Bag colorways, but
// they're actually their own bags ("Bag Marine" and "Daisy") -- see the
// `marine` and `daisy` products instead.
export const ivyBagVariants = [
  { name: 'Red', slug: 'red', hex: '#c41e3a', price: 500, image: ivyBagRed },
  { name: 'Hot Pink', slug: 'hot-pink', hex: '#ff1493', price: 500, image: ivyBagHotPink },
  { name: 'Light Pink', slug: 'light-pink', hex: '#f7cad0', price: 500, image: ivyBagLightPink },
  { name: 'Green', slug: 'green', hex: '#8bc34a', price: 500, image: ivyBagGreen },
  { name: 'White', slug: 'white', hex: '#f5f5f0', price: 500, image: ivyBagWhite },
  { name: 'Black', slug: 'black', hex: '#1a1a1a', price: 500, image: ivyBagBlack },
  { name: 'Purple', slug: 'purple', hex: '#7c3aed', price: 500, image: ivyBagPurple },
  { name: 'Orange', slug: 'orange', hex: '#ff8c00', price: 500, image: ivyBagOrange },
]
