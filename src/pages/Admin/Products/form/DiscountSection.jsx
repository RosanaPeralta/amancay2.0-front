import { Link } from 'react-router-dom'
import AdminCard from '../../../../components/admin/AdminCard'
import { inputClass } from '../../../../components/admin/styles'

function DiscountSection({ values, setField, discounts }) {
  return (
    <AdminCard
      title="Descuento"
      action={
        <Link to="/admin/discounts" className="text-xs font-bold text-dark hover:text-primary">
          Administrar
        </Link>
      }
    >
      <select
        aria-label="Descuento"
        className={`${inputClass(false)} cursor-pointer`}
        value={values.discountId}
        onChange={(event) => setField('discountId', event.target.value)}
      >
        <option value="">Sin descuento</option>
        {discounts.map((discount) => (
          <option key={discount.id} value={String(discount.id)}>
            {discount.description} ({Number(discount.percentage)}% de descuento)
          </option>
        ))}
      </select>
    </AdminCard>
  )
}

export default DiscountSection
