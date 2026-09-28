import { useState } from 'react'
import AdminCard from '../../../components/admin/AdminCard'
import { inputClass } from '../../../components/admin/styles'
import Button from '../../../components/ui/Button'
import OrderStatusPill from './OrderStatusPill'
import { ORDER_STATUSES, orderTotal, statusLabel } from './sampleOrders'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })

function OrderDetail({ order, onStatusChange }) {
  const [status, setStatus] = useState(order.status)

  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary">Pedido #{order.id}</h2>
          <p className="text-xs text-dark/60">
            {formatDate(order.date)} · {order.email}
          </p>
        </div>
        <OrderStatusPill status={order.status} />
      </div>

      <ul className="mt-5 space-y-3">
        {order.items.map((item) => (
          <li key={item.name} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-bold text-dark">{item.name}</p>
              <p className="text-xs text-dark/60">
                {item.quantity} × {currency.format(item.price)}
              </p>
            </div>
            <span className="shrink-0 font-bold text-dark">{currency.format(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-dark/10 pt-4">
        <span className="text-sm font-bold text-dark">Total</span>
        <span className="text-2xl font-bold text-primary">{currency.format(orderTotal(order))}</span>
      </div>

      <div className="mt-5">
        <label htmlFor="order-status" className="mb-1.5 block text-xs font-bold text-dark">
          Actualizar estado
        </label>
        <div className="flex gap-2">
          <select id="order-status" className={`${inputClass(false)} cursor-pointer`} value={status} onChange={(event) => setStatus(event.target.value)}>
            {ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
          <Button onClick={() => onStatusChange(order.id, status)} disabled={status === order.status}>
            Actualizar
          </Button>
        </div>
        <p className="mt-2 text-xs text-dark/50">Cancelar un pedido debería devolver sus artículos al stock.</p>
      </div>
    </AdminCard>
  )
}

export default OrderDetail
