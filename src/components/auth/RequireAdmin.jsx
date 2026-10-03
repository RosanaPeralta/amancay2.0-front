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

  // Supabase re-fires SIGNED_IN on tab focus; don't flash a spinner on those profile reloads.
  if (status === 'idle' || (!profile && (profileStatus === 'idle' || profileStatus === 'loading'))) {
    return (
      <Container className="py-12">
        <Loading />
      </Container>
    )
  }

  if (!profile && profileStatus === 'failed') {
    return (
      <Container className="py-12">
        <Notice variant="error">No se pudo cargar tu perfil: {error}</Notice>
      </Container>
    )
  }

  if (profile?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RequireAdmin
