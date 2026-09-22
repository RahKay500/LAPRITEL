import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Menu, ShoppingBag, User, X } from 'lucide-react'
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
      <nav className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-12">
        <button
          type="button"
          aria-label="Toggle menu"
          className="text-ink md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold tracking-widest text-burgundy md:static md:left-auto md:top-auto md:order-1 md:translate-x-0 md:translate-y-0"
        >
          LAPRITEL
        </Link>

        <ul className="hidden items-center gap-8 md:order-2 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-widest transition-colors hover:text-burgundy ${
                    isActive ? 'text-burgundy' : 'text-ink'
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
              className="text-ink hover:text-burgundy"
            >
              <LayoutDashboard size={22} strokeWidth={1.5} />
            </Link>
          )}
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
