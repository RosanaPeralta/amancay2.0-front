import { Link, NavLink, Outlet } from 'react-router-dom'
import BrandLogo from '../components/Brand/BrandLogo'
import UserMenu from '../components/Navbar/UserMenu'

const links = [
  { to: '/admin/products', label: 'Productos', icon: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8' },
  { to: '/admin/categories', label: 'Categorías', icon: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01' },
  { to: '/admin/discounts', label: 'Descuentos', icon: 'M19 5 5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { to: '/admin/orders', label: 'Pedidos', icon: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4' },
  { to: '/admin/payments', label: 'Pagos', icon: 'M2 5h20v14H2zM2 10h20M6 15h4' },
  { to: '/admin/reviews', label: 'Reseñas', icon: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z' },
  { to: '/admin/users', label: 'Usuarios', icon: 'M16 21a6 6 0 0 0-12 0M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21a5 5 0 0 0-4-4.9M16 4.1a4 4 0 0 1 0 7.8' },
]

// Admin screens are table-heavy, so they get a wider column than the store.
const WIDTH = 'mx-auto w-full max-w-7xl px-6'

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    isActive ? 'bg-mist text-primary' : 'text-dark hover:text-primary'
  }`

function AdminLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-mist">
      <header className="sticky top-0 z-20 border-b border-dark/10 bg-white">
        <div className={`${WIDTH} flex h-16 items-center justify-between gap-4`}>
          <div className="flex min-w-0 items-center">
            <Link to="/admin" className="flex shrink-0 items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <BrandLogo compact />
              <span className="rounded-full bg-info px-2 py-0.5 text-[0.65rem] font-bold text-dark">Admin</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-sm">
            <Link to="/" className="hidden items-center gap-1 font-semibold text-dark hover:text-primary sm:flex">
              Ver tienda
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
            <UserMenu />
          </div>
        </div>
        <nav className={`${WIDTH} flex flex-wrap gap-1 pb-3`} aria-label="Administración">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={link.icon} />
              </svg>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <div className={`${WIDTH} py-8`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
