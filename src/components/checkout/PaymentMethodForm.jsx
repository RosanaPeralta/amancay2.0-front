import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const METHODS = [
  { value: 'TARJETA_CREDITO', label: 'Tarjeta de crédito' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta de débito' },
  { value: 'TRANSFERENCIA', label: 'Transferencia bancaria' },
]

const EMPTY_CARD = { number: '', holderName: '', expiry: '', cvv: '' }

const onlyDigits = (value) => value.replace(/\D/g, '')

function formatCardNumber(value) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value, previous) {
  let digits = onlyDigits(value).slice(0, 4)
  // A single 2-9 can only be a month like 02-09, so pad it right away.
  if (digits.length === 1 && digits > '1') digits = `0${digits}`
  // Let backspace remove the slash instead of re-adding it immediately.
  if (digits.length === 2 && value.length < previous.length) return digits
  return digits.length >= 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function validateCard(card) {
  const errors = {}
  const number = onlyDigits(card.number)
  if (number.length < 13) errors.number = 'Ingresá un número de tarjeta válido.'

  if (!card.holderName.trim()) errors.holderName = 'Ingresá el nombre del titular.'

  const match = card.expiry.match(/^(\d{2})\/(\d{2})$/)
  const month = match ? Number(match[1]) : 0
  if (!match || month < 1 || month > 12) {
    errors.expiry = 'Usá el formato MM/AA.'
  } else {
    // Cards are valid through the end of their expiry month, so it has to be
    // strictly after the current month to be accepted.
    const now = new Date()
    const expiry = (2000 + Number(match[2])) * 12 + month
    const current = now.getFullYear() * 12 + now.getMonth() + 1
    if (expiry <= current) errors.expiry = 'La fecha debe ser posterior al mes actual.'
  }

  if (card.cvv.length < 3) errors.cvv = 'El CVV tiene 3 o 4 dígitos.'

  return errors
}

function PaymentMethodForm({ onSubmit, submitLabel = 'Pagar', disabled = false }) {
  const [method, setMethod] = useState('TARJETA_CREDITO')
  const [card, setCard] = useState(EMPTY_CARD)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const isCard = method === 'TARJETA_CREDITO' || method === 'TARJETA_DEBITO'
  const FORMATTERS = {
    number: formatCardNumber,
    expiry: formatExpiry,
    cvv: (value) => onlyDigits(value).slice(0, 4),
  }
  const set = (field) => (event) => {
    const { value } = event.target
    setCard((prev) => ({ ...prev, [field]: FORMATTERS[field] ? FORMATTERS[field](value, prev[field]) : value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    if (isCard) {
      const errors = validateCard(card)
      setFieldErrors(errors)
      if (Object.keys(errors).length > 0) return
    }
    setSubmitting(true)
    try {
      await onSubmit({ method, card: isCard ? { ...card, number: onlyDigits(card.number) } : null })
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
            inputMode="numeric"
            autoComplete="off"
            value={card.number}
            onChange={set('number')}
            error={fieldErrors.number}
            className="sm:col-span-2"
          />
          <Input
            label="Nombre del titular"
            required
            autoComplete="off"
            value={card.holderName}
            onChange={set('holderName')}
            error={fieldErrors.holderName}
            className="sm:col-span-2"
          />
          <Input
            label="Vencimiento"
            required
            placeholder="MM/AA"
            inputMode="numeric"
            autoComplete="off"
            value={card.expiry}
            onChange={set('expiry')}
            error={fieldErrors.expiry}
          />
          <Input
            label="CVV"
            required
            placeholder="123"
            inputMode="numeric"
            autoComplete="off"
            value={card.cvv}
            onChange={set('cvv')}
            error={fieldErrors.cvv}
          />
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
