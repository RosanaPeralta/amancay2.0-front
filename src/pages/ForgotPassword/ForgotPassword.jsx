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
      title="Reset password"
      footer={
        <Link to="/login" className="text-primary font-medium hover-primary-light">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <Notice>
          If an account exists for <strong>{email}</strong>, we sent a link to reset your password.
        </Notice>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="body-text-light text-sm">
            Enter your email and we'll send you a link to choose a new password.
          </p>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}

export default ForgotPassword
