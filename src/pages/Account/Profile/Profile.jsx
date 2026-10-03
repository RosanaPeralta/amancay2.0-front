import { useSelector } from 'react-redux'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import ProfileHeader from './ProfileHeader'
import ProfileForm from './ProfileForm'
import PasswordPanel from './PasswordPanel'

function Profile() {
  const { profile, profileStatus, error } = useSelector((state) => state.auth)

  if (!profile && (profileStatus === 'idle' || profileStatus === 'loading')) return <Loading />
  if (!profile && profileStatus === 'failed') return <Notice variant="error">No se pudo cargar tu perfil: {error}</Notice>

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} />
      <ProfileForm key={profile.id} profile={profile} />
      <PasswordPanel email={profile.email} />
    </div>
  )
}

export default Profile
