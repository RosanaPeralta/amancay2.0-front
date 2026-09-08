import { NavLink } from 'react-router-dom'
import Container from '../ui/Container'
import logo from '../../assets/brand/amancay_logo.png'

const linkClass = ({ isActive }) =>
  `hover-primary-light font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    isActive ? 'text-primary' : 'text-dark'
  }`

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-dark/10 bg-light/90 backdrop-blur">
      <Container as="nav" className="flex items-center justify-between h-20">
        <NavLink
          to="/"
          className="flex items-center h-full rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <img src={logo} alt="Amancay" className="h-full w-auto max-h-32 py-2" />
        </NavLink>
        <div className="flex gap-6 text-sm">
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
        </div>
      </Container>
    </header>
  )
}

export default Navbar
