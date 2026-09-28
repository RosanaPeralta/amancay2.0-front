import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

// Only for a PENDIENTE transfer payment: the buyer submits (or updates, if they made a
// typo) the reference code so the admin has something to check against their bank
// account before confirming. Doesn't touch stock or the order's status on its own.
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
        label="Transfer reference"
        required
        placeholder="Transaction ID from your bank"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : initialValue ? 'Update reference' : 'Submit reference'}
      </Button>
    </form>
  )
}

export default TransferReferenceForm
