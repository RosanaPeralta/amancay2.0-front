import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import BrandLogo from '../Brand/BrandLogo'

const links = [
  { to: '/shipping', label: 'Envíos' },
  { to: '/returns', label: 'Devoluciones' },
  { to: '/contact', label: 'Contacto' },
  { to: '/account/orders', label: 'Pedidos' },
]

function Footer() {
  return (
    <footer className="bg-primary text-white">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-5 py-6">
        <Link
          to="/"
          aria-label="Inicio de Amancay"
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <BrandLogo variant="dark" />
        </Link>
        <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-white/90 rounded transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-white/70">© {new Date().getFullYear()} Amancay. Todos los derechos reservados.</p>
      </Container>
    </footer>
  )
}

export default Footer
