import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { signIn } from '../../store/slices/authSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await dispatch(signIn({ email, password })).unwrap()
      navigate(location.state?.from ?? '/account', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para ver tus favoritos, reseñas y la configuración de tu cuenta."
      footer={
        <>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-bold text-primary hover-primary-light">
            Crear cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="-mt-2 text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-secondary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </AuthCard>
  )
}

export default Login
