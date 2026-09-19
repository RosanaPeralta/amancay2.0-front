import { NavLink, Outlet } from 'react-router-dom'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    isActive ? 'bg-primary text-white' : 'text-dark hover:bg-primary/5'
  }`

function SidebarLayout({ title, links }) {
  return (
    <Container className="py-12">
      <SectionHeading>{title}</SectionHeading>
      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <nav className="flex flex-wrap md:flex-col gap-2 self-start">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 text-left">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}

export default SidebarLayout
