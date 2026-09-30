import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const METHODS = [
  { value: 'TARJETA_CREDITO', label: 'Tarjeta de crédito' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta de débito' },
  { value: 'TRANSFERENCIA', label: 'Transferencia bancaria' },
]

const EMPTY_CARD = { number: '', holderName: '', expiry: '', cvv: '' }

// Shared by the checkout page (first payment attempt) and, later, the order
// detail page (retrying a rejected one): both just need method + card and a
// place to call the API, so the submit itself is the caller's job via onSubmit.
function PaymentMethodForm({ onSubmit, submitLabel = 'Pagar', disabled = false }) {
  const [method, setMethod] = useState('TARJETA_CREDITO')
  const [card, setCard] = useState(EMPTY_CARD)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isCard = method === 'TARJETA_CREDITO' || method === 'TARJETA_DEBITO'
  const set = (field) => (event) => setCard((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({ method, card: isCard ? card : null })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1.5 text-sm font-medium text-dark">Método de pago</label>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMethod(option.value)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                method === option.value
                  ? 'bg-primary text-white border-primary'
                  : 'border-dark/10 text-dark hover:border-primary/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isCard ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Número de tarjeta"
            required
            placeholder="4111 1111 1111 1111"
            value={card.number}
            onChange={set('number')}
            className="sm:col-span-2"
          />
          <Input
            label="Nombre del titular"
            required
            value={card.holderName}
            onChange={set('holderName')}
            className="sm:col-span-2"
          />
          <Input label="Vencimiento" required placeholder="MM/YY" value={card.expiry} onChange={set('expiry')} />
          <Input label="CVV" required value={card.cvv} onChange={set('cvv')} />
        </div>
      ) : (
        <p className="text-dark text-sm">
          El pedido queda registrado y el pago figura como pendiente hasta que lo confirmemos manualmente.
        </p>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" className="w-full" disabled={disabled || submitting}>
        {submitting ? 'Procesando...' : submitLabel}
      </Button>
    </form>
  )
}

export default PaymentMethodForm
