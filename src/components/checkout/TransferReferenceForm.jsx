import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

// Reference code for a pending transfer; the admin checks it before confirming.
function TransferReferenceForm({ initialValue, onSubmit }) {
  const [value, setValue] = useState(initialValue ?? '')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(value.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Referencia de la transferencia"
        required
        placeholder="Número de operación de tu banco"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : initialValue ? 'Actualizar referencia' : 'Enviar referencia'}
      </Button>
    </form>
  )
}

export default TransferReferenceForm
