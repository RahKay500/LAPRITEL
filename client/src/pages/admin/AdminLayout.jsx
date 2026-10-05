import { NavLink, Outlet } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'

const tabs = [
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Messages', to: '/admin/messages' },
  { label: 'Featured', to: '/admin/featured' },
]

function AdminLayout() {
  usePageMeta('Admin Dashboard')

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Admin Dashboard
        </h1>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-black/15">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-burgundy text-burgundy'
                    : 'border-transparent text-ink/75 hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
