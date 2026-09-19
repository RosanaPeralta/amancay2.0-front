import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loading from '../Loading/Loading'
import Container from '../ui/Container'
import Notice from '../ui/Notice'

function RequireAdmin() {
  const { status, profile, profileStatus, error } = useSelector((state) => state.auth)
  const location = useLocation()

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (status === 'idle' || profileStatus === 'idle' || profileStatus === 'loading') {
    return (
      <Container className="py-12">
        <Loading />
      </Container>
    )
  }

  if (profileStatus === 'failed') {
    return (
      <Container className="py-12">
        <Notice variant="error">Couldn't load your profile: {error}</Notice>
      </Container>
    )
  }

  if (profile?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RequireAdmin
