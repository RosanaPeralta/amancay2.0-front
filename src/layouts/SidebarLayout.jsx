import { Link, NavLink, Outlet } from 'react-router-dom'
import Container from '../components/ui/Container'

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    isActive ? 'bg-primary text-white' : 'text-dark hover:bg-primary/5 hover:text-primary'
  }`

function NavIcon({ path }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function SidebarLayout({ title, subtitle, links }) {
  return (
    <Container className="py-10 text-left">
      <nav aria-label="Ruta de navegación" className="mb-3 text-xs text-dark/50">
        <Link to="/" className="hover:text-primary">
          Inicio
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-dark">{title}</span>
      </nav>
      <h1 className="text-4xl font-bold tracking-tight text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-dark/70">{subtitle}</p>}

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-wrap gap-1 self-start rounded-2xl border border-dark/5 bg-white p-2 shadow-sm md:flex-col">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.icon && <NavIcon path={link.icon} />}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}

export default SidebarLayout
