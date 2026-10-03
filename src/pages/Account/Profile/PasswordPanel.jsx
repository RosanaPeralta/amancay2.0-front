import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Panel from '../../../components/ui/Panel'
import { supabase } from '../../../lib/supabaseClient'

function PasswordPanel({ email }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  async function handleClick() {
    setError(null)
    setStatus('sending')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
      setStatus('idle')
    } else {
      setStatus('sent')
    }
  }

  return (
    <Panel title="Contraseña" description="Te enviaremos por correo un enlace seguro para elegir una nueva contraseña.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {status === 'sent' ? (
          <p className="text-sm font-semibold text-primary">
            Revisa <span className="text-dark">{email}</span> para encontrar el enlace de restablecimiento.
          </p>
        ) : (
          <p className="text-sm text-dark/60">{error ? <span className="text-danger">{error}</span> : '••••••••••'}</p>
        )}
        <Button variant="outline" onClick={handleClick} disabled={status !== 'idle'}>
          {status === 'sending' ? 'Enviando...' : status === 'sent' ? 'Enlace enviado' : 'Cambiar contraseña'}
        </Button>
      </div>
    </Panel>
  )
}

export default PasswordPanel
