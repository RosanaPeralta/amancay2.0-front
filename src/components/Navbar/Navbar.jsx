import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import Container from '../ui/Container'
import Button from '../ui/Button'
import CartIcon from '../cart/CartIcon'
import logo from '../../assets/brand/amancay_logo.png'
import { selectIsAdmin, signOut } from '../../store/slices/authSlice'

const linkClass = ({ isActive }) =>
  `hover-primary-light font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    isActive ? 'text-primary' : 'text-dark'
  }`

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, supabaseUser, profile } = useSelector((state) => state.auth)
  const isAdmin = useSelector(selectIsAdmin)

  async function handleSignOut() {
    await dispatch(signOut())
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-dark/10 bg-light/90 backdrop-blur">
      <Container as="nav" className="flex items-center justify-between h-20">
        <NavLink
          to="/"
          className="flex items-center h-full rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <img src={logo} alt="Amancay" className="h-full w-auto max-h-32 py-2" />
        </NavLink>
        <div className="flex items-center gap-6 text-sm">
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <CartIcon />
          {status === 'authenticated' && (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/account" className={linkClass}>
                {profile?.name || supabaseUser?.email}
              </NavLink>
              <Button variant="outline" onClick={handleSignOut}>
                Log out
              </Button>
            </>
          )}
          {status === 'anonymous' && (
            <Button to="/login" variant="outline">
              Log in
            </Button>
          )}
        </div>
      </Container>
    </header>
  )
}

export default Navbar
