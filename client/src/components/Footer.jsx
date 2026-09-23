import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'

const linkClass =
  'underline underline-offset-2 decoration-burgundy/30 text-ink/70 transition-colors hover:text-burgundy hover:decoration-burgundy'

function Footer() {
  return (
    <footer className="border-t border-burgundy-tint bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <p className="text-xl font-extrabold tracking-widest text-burgundy">LAPRITEL</p>
          <p className="mt-3 max-w-xs text-sm text-ink/70">
            Handmade beaded bags, crafted with care for the modern, elegant
            woman.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink">
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
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
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
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Help
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className={linkClass}>
                About LAPRITEL
              </Link>
            </li>
            <li>
              <Link to="/faq" className={linkClass}>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/shipping-returns" className={linkClass}>
                Shipping & Returns
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
          <p className="text-sm font-semibold uppercase tracking-wide text-ink">
            Follow Us
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com/lapritel"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
              style={{
                background:
                  'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              }}
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://wa.me/233243416943"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@lapritel"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-110"
            >
              <FaTiktok size={16} />
            </a>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-6xl border-t border-burgundy-tint pt-2 text-center text-xs text-ink/70">
        © {new Date().getFullYear()} LAPRITEL. All rights reserved. &middot; Made by{' '}
        <a
          href="https://www.instagram.com/rahkay.y"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 decoration-burgundy/30 transition-colors hover:text-burgundy hover:decoration-burgundy"
        >
          @rahkay.y
        </a>
      </p>
    </footer>
  )
}

export default Footer
