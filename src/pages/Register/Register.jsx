import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import registerImage from '../../assets/gallery/gallery2.png'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Notice from '../../components/ui/Notice'
import { signUp } from '../../store/slices/authSlice'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [pendingConfirmation, setPendingConfirmation] = useState(false)

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
    try {
      const session = await dispatch(signUp({ name: name.trim(), email, password })).unwrap()
      if (session) {
        navigate('/account', { replace: true })
      } else {
        setPendingConfirmation(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingConfirmation) {
    return (
      <AuthCard title="Revisa tu bandeja de entrada" image={registerImage}>
        <Notice>
          Enviamos un enlace de confirmación a <strong>{email}</strong>. Ábrelo para activar tu cuenta y luego inicia sesión.
        </Notice>
        <div className="mt-6 text-center">
          <Button to="/login" variant="outline">
            Ir a iniciar sesión
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Crea tu cuenta"
      subtitle="Guarda tu equipo favorito y reseña lo que ya probaste."
      image={registerImage}
      footer={
        <>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-bold text-primary hover-primary-light">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre"
          type="text"
          autoComplete="name"
          required
          maxLength={255}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthCard>
  )
}

export default Register
