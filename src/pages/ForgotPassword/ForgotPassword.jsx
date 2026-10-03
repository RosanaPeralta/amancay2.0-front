import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Notice from '../../components/ui/Notice'
import { supabase } from '../../lib/supabaseClient'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSubmitting(false)
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <AuthCard
      title="Restablecer contraseña"
      subtitle="Ingresa tu correo y te enviaremos un enlace para elegir una nueva contraseña."
      footer={
        <Link to="/login" className="font-bold text-primary hover-primary-light">
          Volver a iniciar sesión
        </Link>
      }
    >
      {sent ? (
        <Notice>
          Si existe una cuenta para <strong>{email}</strong>, te enviamos un enlace para restablecer tu contraseña.
        </Notice>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar enlace'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default ForgotPassword
