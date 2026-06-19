import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { count: cartCount } = useCart()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-burgundy-tint bg-white">
      <nav className="flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-12">
        <Link to="/" className="font-heading text-2xl tracking-wide text-burgundy">
          LAPRITEL
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-burgundy ${
                    isActive ? 'text-burgundy' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to={user ? '/profile' : '/login'}
            aria-label="Account"
            className="text-ink hover:text-burgundy"
          >
            <User size={22} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-ink hover:text-burgundy">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-ink md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <ul className="flex flex-col gap-1 border-t border-burgundy-tint bg-white px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-2 py-2.5 text-sm font-medium ${
                    isActive ? 'text-burgundy' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
