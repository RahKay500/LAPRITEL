import { Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const linkClass =
  'underline underline-offset-2 decoration-white/30 text-white/80 transition-colors hover:text-white hover:decoration-white'

function Footer() {
  return (
    <footer className="border-t border-white/15 bg-burgundy px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <p className="text-xl font-extrabold tracking-widest text-white">LAPRITEL</p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Handmade beaded bags, crafted with care for the modern, elegant
            woman.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white">
            Contact Us
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <a href="https://wa.me/233243416943" className={linkClass}>
                +233 24 341 6943
              </a>
            </li>
            <li>
              <a href="mailto:lapritel@gmail.com" className={linkClass}>
                lapritel@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            Shop
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/shop" className={linkClass}>
                All Bags
              </Link>
            </li>
            <li>
              <Link to="/shop" className={linkClass}>
                Bag Ivy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            Help
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className={linkClass}>
                About LAPRITEL
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className={linkClass}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className={linkClass}>
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white">
            Follow
          </p>
          <div className="mt-4 flex gap-4 text-white/80">
            <a
              href="https://instagram.com/lapritel"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-white"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://wa.me/233243416943"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="transition-colors hover:text-white"
            >
              <FaWhatsapp size={22} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-6xl border-t border-white/15 pt-2 text-center text-xs text-white/50">
        © {new Date().getFullYear()} LAPRITEL. All rights reserved. &middot; Made by{' '}
        <a
          href="https://www.instagram.com/rahkay.y"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 decoration-white/30 transition-colors hover:text-white hover:decoration-white"
        >
          @rahkay.y
        </a>
      </p>
    </footer>
  )
}

export default Footer
