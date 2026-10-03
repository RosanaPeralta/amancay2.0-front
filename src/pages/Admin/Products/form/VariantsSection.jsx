import AdminCard from '../../../../components/admin/AdminCard'
import { inputClass } from '../../../../components/admin/styles'

const labelClass = 'text-[0.65rem] font-bold uppercase tracking-wider text-dark/50'

function VariantRow({ variant, index, errors, onChange }) {
  const priceError = errors[`variants.${index}.price`]
  const stockError = errors[`variants.${index}.stockQuantity`]

  return (
    <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-3 sm:grid-cols-[1fr_1fr_1.6fr_auto]">
      <div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dark/50">$</span>
          <input
            inputMode="decimal"
            aria-label={`Precio de la variante ${index + 1}`}
            className={`${inputClass(priceError)} pl-7`}
            value={variant.price}
            onChange={(event) => onChange({ ...variant, price: event.target.value })}
          />
        </div>
        {priceError && <p className="mt-1 text-xs text-danger">{priceError}</p>}
      </div>
      <div>
        <input
          inputMode="numeric"
          aria-label={`Stock de la variante ${index + 1}`}
          className={inputClass(stockError)}
          value={variant.stockQuantity}
          onChange={(event) => onChange({ ...variant, stockQuantity: event.target.value })}
        />
        {stockError && <p className="mt-1 text-xs text-danger">{stockError}</p>}
      </div>
    </div>
  )
}

function VariantsSection({ values, errors, setField }) {
  const { variants } = values
  const totalStock = variants.reduce((sum, variant) => sum + (Number(variant.stockQuantity) || 0), 0)

  const update = (index, next) =>
    setField(
      'variants',
      variants.map((variant, itemIndex) => (itemIndex === index ? next : variant)),
    )

  return (
    <AdminCard
      title="Variantes"
      action={
        <button
          type="button"
          onClick={() => setField('variants', [...variants, { id: null, price: '', stockQuantity: '0' }])}
          className="rounded-full border border-dark/15 bg-white px-4 py-1.5 text-sm font-bold text-dark hover:border-primary/40 hover:text-primary"
        >
          + Agregar variante
        </button>
      }
    >
      <div className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-3 sm:grid-cols-[1fr_1fr_1.6fr_auto]">
        <span className={labelClass}>Precio (USD)</span>
        <span className={labelClass}>Cantidad en stock</span>
        <span className="w-9" />
      </div>
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <VariantRow
            key={variant.id ?? `new-${index}`}
            variant={variant}
            index={index}
            errors={errors}
            canRemove={variants.length > 1}
            onChange={(next) => update(index, next)}
            onRemove={() => setField('variants', variants.filter((_, itemIndex) => itemIndex !== index))}
          />
        ))}
      </div>
      {errors.variants && <p className="mt-2 text-xs text-danger">{errors.variants}</p>}
      <p className="mt-3 text-xs text-dark/60">
        Stock total: <strong className="text-dark">{totalStock}</strong> en {variants.length}{' '}
        {variants.length === 1 ? 'variante' : 'variantes'}. Un producto necesita al menos una variante.
      </p>
    </AdminCard>
  )
}

export default VariantsSection
