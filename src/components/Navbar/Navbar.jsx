import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import Container from '../ui/Container'
import Button from '../ui/Button'
import BrandLogo from '../Brand/BrandLogo'
import UserMenu from './UserMenu'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import CartIcon from '../cart/CartIcon'

// The full list lives in the Products page chips; the navbar only has room for a few.
const NAV_CATEGORY_LIMIT = 5

const linkClass = (active) =>
  `whitespace-nowrap font-semibold rounded transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    active ? 'text-primary' : 'text-dark'
  }`

const iconButtonClass =
  'inline-flex items-center justify-center h-9 w-9 rounded-full border border-dark/10 bg-white text-dark transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

function CategoryLinks() {
  const categories = useSelector((state) => state.categories.items)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeCategory = location.pathname === '/products' ? searchParams.get('category') : null

  return (
    <div className="hidden lg:flex items-center gap-6 text-sm">
      <NavLink to="/products" end className={() => linkClass(location.pathname === '/products' && !activeCategory)}>
        Ver todo
      </NavLink>
      {categories.slice(0, NAV_CATEGORY_LIMIT).map((category) => (
        <Link
          key={category.id}
          to={`/products?category=${category.id}`}
          className={linkClass(activeCategory === category.id)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}

function Navbar() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.auth.status)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <header className="sticky top-0 z-20 border-b border-dark/10 bg-white/90 backdrop-blur">
      <Container as="nav" className="flex items-center justify-between gap-6 h-16">
        <div className="flex items-center gap-10 min-w-0">
          <Link
            to="/"
            aria-label="Inicio de Amancay"
            className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <BrandLogo compact />
          </Link>
          <CategoryLinks />
        </div>
        <div className="flex items-center gap-3 text-sm shrink-0">
          <Link to="/products" className={`lg:hidden ${iconButtonClass}`} aria-label="Ver productos">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </Link>
          <Link to="/account/favorites" className={iconButtonClass} aria-label="Favoritos">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </Link>
          <CartIcon />
          {status === 'authenticated' && <UserMenu />}
          {status === 'anonymous' && (
            <Button to="/login" className="!py-2 !px-4">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
              Iniciar sesión
            </Button>
          )}
        </div>
      </Container>
    </header>
  )
}

export default Navbar
