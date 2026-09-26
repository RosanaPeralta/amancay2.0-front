import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
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
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
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
      <AuthCard title="Check your inbox">
        <Notice>
          We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account, then log in.
        </Notice>
        <div className="mt-6 text-center">
          <Button to="/login" variant="outline">
            Go to log in
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Create account"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover-primary-light">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          required
          maxLength={255}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
    </AuthCard>
  )
}

export default Register
