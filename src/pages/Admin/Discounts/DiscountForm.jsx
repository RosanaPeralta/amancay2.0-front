import { useState } from 'react'
import { useDispatch } from 'react-redux'
import AdminCard from '../../../components/admin/AdminCard'
import Field from '../../../components/admin/Field'
import { inputClass } from '../../../components/admin/styles'
import Button from '../../../components/ui/Button'
import { zodErrors } from '../../../lib/zodErrors'
import { createDiscount, deleteDiscount, updateDiscount } from '../../../store/slices/discountsSlice'
import { discountSchema } from './discountSchema'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function PricePreview({ percentage }) {
  const value = Number(String(percentage).replace(',', '.'))
  if (!percentage || !Number.isFinite(value) || value <= 0 || value > 100) return null
  return (
    <div className="flex items-center justify-between rounded-lg bg-info/30 px-3 py-2 text-xs text-dark">
      <span>Un artículo de {currency.format(100)} se vende a</span>
      <strong className="text-sm">{currency.format(100 - value)}</strong>
    </div>
  )
}

function DiscountForm({ discount, productCount, onDone }) {
  const dispatch = useDispatch()
  const isNew = !discount
  const [values, setValues] = useState({
    description: discount?.description ?? '',
    percentage: discount ? String(Number(discount.percentage)) : '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [busy, setBusy] = useState(false)

  const setField = (name, value) => setValues((current) => ({ ...current, [name]: value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    const result = discountSchema.safeParse(values)
    if (!result.success) {
      setErrors(zodErrors(result.error))
      return
    }
    setErrors({})
    setBusy(true)
    try {
      const saved = isNew
        ? await dispatch(createDiscount(result.data)).unwrap()
        : await dispatch(updateDiscount({ id: discount.id, data: result.data })).unwrap()
      onDone(saved.id)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el descuento "${discount.description}"?`)) return
    setBusy(true)
    try {
      await dispatch(deleteDiscount(discount.id)).unwrap()
      onDone(null)
    } catch (err) {
      setSubmitError(err.message)
      setBusy(false)
    }
  }

  return (
    <AdminCard title={isNew ? 'Nuevo descuento' : `Editar descuento #${discount.id}`}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Nombre" error={errors.description}>
          <input
            className={inputClass(errors.description)}
            value={values.description}
            placeholder="Liquidación de invierno"
            onChange={(event) => setField('description', event.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Porcentaje de descuento" error={errors.percentage}>
          <div className="relative">
            <input
              inputMode="decimal"
              className={`${inputClass(errors.percentage)} pr-8`}
              value={values.percentage}
              placeholder="10"
              onChange={(event) => setField('percentage', event.target.value)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dark/50">%</span>
          </div>
        </Field>
        <PricePreview percentage={values.percentage} />
        {submitError && <p className="text-xs text-danger">{submitError}</p>}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={busy}>
            {busy ? 'Guardando...' : isNew ? 'Crear descuento' : 'Guardar cambios'}
          </Button>
          <Button variant="outline" className="!bg-white" onClick={() => onDone(null)}>
            Limpiar
          </Button>
        </div>
        {!isNew && (
          <div className="border-t border-dark/10 pt-4 text-xs text-dark/60">
            {productCount > 0 ? (
              <p>
                Se usa en {productCount} {productCount === 1 ? 'producto' : 'productos'}. Quítalo desde el formulario de
                cada producto antes de eliminarlo.
              </p>
            ) : (
              <button type="button" onClick={handleDelete} disabled={busy} className="font-bold text-danger hover:underline">
                Eliminar este descuento
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-dark/50">Asigna un descuento a un producto desde su formulario de edición.</p>
      </form>
    </AdminCard>
  )
}

export default DiscountForm
