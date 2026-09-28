import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Panel from '../../../components/ui/Panel'
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
    <Panel title="Información personal" description="Este es el nombre que se muestra en tus reseñas y en la barra de navegación.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Nombre"
            type="text"
            required
            maxLength={255}
            placeholder="Tu nombre"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setSaved(false)
            }}
          />
          <Input label="Correo electrónico" type="email" value={profile.email} disabled readOnly />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4 border-t border-dark/10 pt-5">
          {error && <p className="mr-auto text-sm text-danger">{error}</p>}
          {saved && <p className="mr-auto text-sm font-semibold text-primary">Perfil actualizado.</p>}
          <Button type="submit" disabled={submitting || name.trim() === (profile.name ?? '')}>
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Panel>
  )
}

export default ProfileForm
