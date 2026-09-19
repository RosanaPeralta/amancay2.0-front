import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import { updateProfile } from '../../../store/slices/authSlice'

function ProfileForm({ profile }) {
  const dispatch = useDispatch()
  const [name, setName] = useState(profile.name ?? '')
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setSubmitting(true)
    try {
      await dispatch(updateProfile(name.trim())).unwrap()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        label="Name"
        type="text"
        required
        maxLength={255}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-primary">Profile updated.</p>}
      <Button type="submit" disabled={submitting || name.trim() === (profile.name ?? '')}>
        {submitting ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}

function Profile() {
  const { profile, profileStatus, error } = useSelector((state) => state.auth)

  if (profileStatus === 'idle' || profileStatus === 'loading') return <Loading />
  if (profileStatus === 'failed') return <Notice variant="error">Couldn't load your profile: {error}</Notice>

  return (
    <div className="space-y-8">
      <dl className="grid sm:grid-cols-3 gap-4 rounded-lg border border-dark/10 bg-white p-6 text-sm">
        <div>
          <dt className="caption-text">Email</dt>
          <dd className="font-medium text-dark">{profile.email}</dd>
        </div>
        <div>
          <dt className="caption-text">Role</dt>
          <dd className="font-medium text-dark">{profile.role}</dd>
        </div>
        <div>
          <dt className="caption-text">Member since</dt>
          <dd className="font-medium text-dark">{new Date(profile.createdAt).toLocaleDateString('en-US')}</dd>
        </div>
      </dl>

      <ProfileForm key={profile.id} profile={profile} />
    </div>
  )
}

export default Profile
