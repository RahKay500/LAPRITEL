import ivyBagWhite from '../assets/images/ivy_bag_white.jpeg'
import ivyBagHotPink from '../assets/images/ivy_bag_hotpink.jpg'
import ivyBagGreen from '../assets/images/ivy_bag_green.jpeg'
import ivyBagRed from '../assets/images/ivy_bag_red.jpg'
import ivyBagLightPink from '../assets/images/ivy_bag_lightpink.jpg'
import ivyBagPurple from '../assets/images/ivy_bag_purple.jpg'
import ivyBagSeaBlue from '../assets/images/ivy_bag_seablue.jpg'
import ivyBagOrange from '../assets/images/ivy_bag_orange.jpg'
import ivyBagRainbow from '../assets/images/ivy_bag_rainbow.jpg'

export const ivyBagVariants = [
  { name: 'Red', slug: 'red', hex: '#c41e3a', price: 500, image: ivyBagRed },
  { name: 'Hot Pink', slug: 'hot-pink', hex: '#ff1493', price: 500, image: ivyBagHotPink },
  { name: 'Light Pink', slug: 'light-pink', hex: '#f7cad0', price: 500, image: ivyBagLightPink },
  { name: 'Green', slug: 'green', hex: '#8bc34a', price: 500, image: ivyBagGreen },
  { name: 'White', slug: 'white', hex: '#f5f5f0', price: 500, image: ivyBagWhite },
  { name: 'Black', slug: 'black', hex: '#1a1a1a', price: 500 },
  { name: 'Sea Blue', slug: 'sea-blue', hex: '#2a6f97', price: 500, image: ivyBagSeaBlue },
  { name: 'Purple', slug: 'purple', hex: '#7c3aed', price: 500, image: ivyBagPurple },
  { name: 'Orange', slug: 'orange', hex: '#ff8c00', price: 500, image: ivyBagOrange },
  {
    name: 'Rainbow',
    slug: 'rainbow',
    hex: 'linear-gradient(135deg, #ff1493, #ff8c00, #ffd700, #8bc34a, #2a6f97, #7c3aed)',
    price: 500,
    image: ivyBagRainbow,
  },
]
