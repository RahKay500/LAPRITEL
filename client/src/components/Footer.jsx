import { Link } from 'react-router-dom'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-burgundy-tint bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <p className="font-heading text-xl text-burgundy">LAPRITEL</p>
          <p className="mt-3 max-w-xs text-sm text-ink/70">
            Handmade beaded bags, crafted with care for the modern, elegant
            woman.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-ink/70">
            <li>
              <a href="https://wa.me/233243416943" className="hover:text-burgundy">
                +233 24 341 6943
              </a>
            </li>
            <li>
              <a href="mailto:lapritel@gmail.com" className="hover:text-burgundy">
                lapritel@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Shop
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li>
              <Link to="/shop" className="hover:text-burgundy">
                All Bags
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-burgundy">
                The Ivy Bag
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Help
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li>
              <Link to="/contact" className="hover:text-burgundy">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-burgundy">
                About LAPRITEL
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-burgundy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-burgundy">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-burgundy">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Follow
          </p>
          <div className="mt-4 flex gap-4 text-ink/70">
            <a
              href="https://instagram.com/lapritel"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-burgundy"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://wa.me/233243416943"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-burgundy"
            >
              <FaWhatsapp size={22} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-6xl border-t border-burgundy-tint pt-3 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} LAPRITEL. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
