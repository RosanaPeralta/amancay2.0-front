import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { supabase } from '../../lib/supabaseClient'

function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      navigate('/account', { replace: true })
    }
  }

  return (
    <AuthCard title="Elige una nueva contraseña" subtitle="Elige una contraseña que no hayas usado antes aquí.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar contraseña'}
        </Button>
      </form>
    </AuthCard>
  )
}

export default ResetPassword
