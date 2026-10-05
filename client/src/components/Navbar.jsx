import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Heart, LayoutDashboard, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useWishlist } from '../context/useWishlist'
import { useAuth } from '../context/useAuth'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Featured', to: '/featured' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { count: cartCount, openDrawer } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-burgundy-tint bg-white">
      <nav className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-12">
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="flex h-6 w-8 flex-col items-center justify-center gap-[7px] md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span
            className={`block h-[2px] w-8 bg-ink transition-transform duration-300 ease-out ${
              isMenuOpen ? 'translate-y-[4.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-8 bg-ink transition-transform duration-300 ease-out ${
              isMenuOpen ? '-translate-y-[4.5px] -rotate-45' : ''
            }`}
          />
        </button>

        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold tracking-widest text-burgundy md:static md:left-auto md:top-auto md:order-1 md:translate-x-0 md:translate-y-0"
        >
          LAPRITEL
        </Link>

        <ul className="hidden items-center gap-8 md:order-2 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `border-b-2 pb-1 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-burgundy ${
                    isActive ? 'border-burgundy text-burgundy' : 'border-transparent text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 md:order-3">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              aria-label="Admin Dashboard"
              className="hidden text-ink hover:text-burgundy md:block"
            >
              <LayoutDashboard size={22} strokeWidth={1.5} />
            </Link>
          )}
          <Link
            to={user ? '/profile' : '/login'}
            aria-label="Account"
            className="hidden text-ink hover:text-burgundy md:block"
          >
            <User size={22} strokeWidth={1.5} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="flex items-center gap-1.5 text-ink hover:text-burgundy">
            <Heart size={22} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="text-sm font-semibold">{wishlistCount}</span>}
          </Link>
          <button
            type="button"
            aria-label="Cart"
            onClick={openDrawer}
            className="flex items-center gap-1.5 text-ink hover:text-burgundy"
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            <span className="text-sm font-semibold">{cartCount}</span>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-burgundy-tint bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-2 py-2.5 text-sm font-semibold uppercase tracking-widest ${
                      isActive ? 'bg-burgundy-tint/50 text-burgundy' : 'text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="mt-2 flex flex-col gap-1 border-t border-burgundy-tint pt-2">
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-2.5 text-sm font-semibold uppercase tracking-widest text-ink"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                to={user ? '/profile' : '/login'}
                onClick={() => setIsMenuOpen(false)}
                className="block px-2 py-2.5 text-sm font-semibold uppercase tracking-widest text-ink"
              >
                {user ? 'My Account' : 'Login'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
