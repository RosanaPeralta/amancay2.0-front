import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const EMPTY = { street: '', number: '', floorApt: '', city: '', province: '', country: '', postalCode: '' }

function toValues(address) {
  if (!address) return EMPTY
  return {
    street: address.street ?? '',
    number: address.number ?? '',
    floorApt: address.floorApt ?? '',
    city: address.city ?? '',
    province: address.province ?? '',
    country: address.country ?? '',
    postalCode: address.postalCode ?? '',
  }
}

function toPayload(values) {
  return {
    street: values.street.trim(),
    number: Number(values.number),
    floorApt: values.floorApt === '' ? null : Number(values.floorApt),
    city: values.city.trim(),
    province: values.province.trim() || null,
    country: values.country.trim(),
    postalCode: values.postalCode.trim() || null,
  }
}

function AddressForm({ address, onSubmit, onCancel }) {
  const [values, setValues] = useState(toValues(address))
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field) => (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      await onSubmit(toPayload(values))
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-dark/10 bg-white p-6 space-y-4">
      <div className="grid sm:grid-cols-[1fr_120px_120px] gap-4">
        <Input label="Street" required maxLength={255} value={values.street} onChange={set('street')} error={fieldErrors.street} />
        <Input label="Number" type="number" min={1} required value={values.number} onChange={set('number')} error={fieldErrors.number} />
        <Input label="Floor / Apt" type="number" min={0} value={values.floorApt} onChange={set('floorApt')} error={fieldErrors.floorApt} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="City" required maxLength={120} value={values.city} onChange={set('city')} error={fieldErrors.city} />
        <Input label="Province" maxLength={120} value={values.province} onChange={set('province')} error={fieldErrors.province} />
        <Input label="Country" required maxLength={120} value={values.country} onChange={set('country')} error={fieldErrors.country} />
        <Input label="Postal code" maxLength={20} value={values.postalCode} onChange={set('postalCode')} error={fieldErrors.postalCode} />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : address ? 'Save changes' : 'Add address'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default AddressForm
