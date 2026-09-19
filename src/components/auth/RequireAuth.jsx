import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loading from '../Loading/Loading'
import Container from '../ui/Container'

function RequireAuth() {
  const status = useSelector((state) => state.auth.status)
  const location = useLocation()

  if (status === 'idle') {
    return (
      <Container className="py-12">
        <Loading />
      </Container>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
