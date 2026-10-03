import { useState } from 'react'
import { useDispatch } from 'react-redux'
import AdminCard from '../../../components/admin/AdminCard'
import Button from '../../../components/ui/Button'
import { changeOrderStatus } from '../../../store/slices/adminOrdersSlice'
import OrderStatusPill from './OrderStatusPill'
import { NEXT_STATUS, shortId, statusLabel } from './orderStatus'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function OrderDetail({ order }) {
  const dispatch = useDispatch()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const nextStatus = NEXT_STATUS[order.status]

  async function handleAdvance() {
    setError(null)
    setSaving(true)
    try {
      await dispatch(changeOrderStatus({ id: order.id, status: nextStatus })).unwrap()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-primary">Pedido #{shortId(order.id)}</h2>
          <p className="truncate text-xs text-dark/60">
            {formatDate(order.createdAt)} · {order.buyerEmail || 'Comprador desconocido'}
          </p>
        </div>
        <OrderStatusPill status={order.status} />
      </div>

      <ul className="mt-5 space-y-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-bold text-dark">{item.productName ?? 'Producto no disponible'}</p>
              <p className="text-xs text-dark/60">
                {item.quantity} × {currency.format(item.unitPrice)}
              </p>
            </div>
            <span className="shrink-0 font-bold text-dark">{currency.format(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-1 border-t border-dark/10 pt-4 text-sm text-dark">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currency.format(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{currency.format(order.shippingCost)}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">{currency.format(order.total)}</span>
        </div>
      </div>

      <div className="mt-5">
        {nextStatus ? (
          <>
            <Button className="w-full" onClick={handleAdvance} disabled={saving}>
              {saving ? 'Actualizando...' : `Marcar como ${statusLabel(nextStatus).toLowerCase()}`}
            </Button>
            {order.status === 'CREADO' && (
              <p className="mt-2 text-xs text-dark/50">
                Pasa a preparación sola cuando se aprueba el pago. Avánzalo a mano solo si ya lo cobraste por otro medio.
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-dark/50">Este pedido ya no admite más cambios de estado.</p>
        )}
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </div>
    </AdminCard>
  )
}

export default OrderDetail
