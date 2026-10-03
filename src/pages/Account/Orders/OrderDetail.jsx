import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Panel from '../../../components/ui/Panel'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import StatusBadge from '../../../components/ui/StatusBadge'
import PaymentMethodForm from '../../../components/checkout/PaymentMethodForm'
import TransferReferenceForm from '../../../components/checkout/TransferReferenceForm'
import { fetchOrderById, fetchOrderPayments } from '../../../store/slices/ordersSlice'
import { attachTransferReference, retryPayment } from '../../../services/paymentsService'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

const METHOD_LABELS = {
  TARJETA_CREDITO: 'Tarjeta de crédito',
  TARJETA_DEBITO: 'Tarjeta de débito',
  TRANSFERENCIA: 'Transferencia bancaria',
}

function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { item: order, status: orderStatus, error: orderError } = useSelector((state) => state.orders.current)
  const { items: payments, status: paymentsStatus } = useSelector((state) => state.orders.payments)
  // Order items only carry a productVariantId (the API doesn't return product name/image),
  // so names are resolved against whatever's already cached from browsing the catalog.
  const cachedProducts = useSelector((state) =>
    [...state.products.list.items, ...state.products.featured.items, state.products.current.item].filter(Boolean),
  )

  useEffect(() => {
    dispatch(fetchOrderById(id))
    dispatch(fetchOrderPayments(id))
  }, [dispatch, id])

  function nameForVariant(variantId) {
    const product = cachedProducts.find((item) => item.variants?.some((variant) => variant.id === variantId))
    return product ? product.name : `Variante #${variantId.slice(0, 8)}`
  }

  async function handleRetry({ method, card }) {
    await retryPayment(payments[0].id, { method, card })
    dispatch(fetchOrderPayments(id))
    dispatch(fetchOrderById(id))
  }

  async function handleAttachTransferReference(transferReference) {
    await attachTransferReference(payments[0].id, transferReference)
    dispatch(fetchOrderPayments(id))
  }

  const isLoading = orderStatus === 'idle' || orderStatus === 'loading'

  if (isLoading) return <Loading />

  if (orderError) {
    return (
      <div className="text-center">
        <Notice variant="error">No se pudo cargar este pedido: {orderError}</Notice>
        <div className="mt-6">
          <Button to="/account/orders" variant="outline">
            Volver a mis pedidos
          </Button>
        </div>
      </div>
    )
  }

  const latestPayment = payments[0]
  const canRetry = latestPayment?.status === 'RECHAZADO'
  const canSubmitTransferReference =
    latestPayment?.method === 'TRANSFERENCIA' && latestPayment?.status === 'PENDIENTE'

  return (
    <div className="space-y-6">
      <div>
        <Button to="/account/orders" variant="outline">
          ← Volver a mis pedidos
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark">Pedido #{order.id.slice(0, 8)}</h2>
            <p className="caption-text">{dateFormatter.format(new Date(order.createdAt))}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <Panel title="Productos">
          <ul className="space-y-2 text-sm mb-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-dark">
                  {nameForVariant(item.productVariantId)} × {item.quantity}
                </span>
                <span className="text-dark">{currencyFormatter.format(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-dark/10 pt-4 text-sm">
            <div className="flex justify-between text-dark">
              <span>Subtotal</span>
              <span>{currencyFormatter.format(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-dark">
              <span>Envío</span>
              <span>{currencyFormatter.format(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-dark">
              <span>Total</span>
              <span>{currencyFormatter.format(order.total)}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Pagos">
          <div className="space-y-4">
            {paymentsStatus === 'idle' || paymentsStatus === 'loading' ? (
              <Loading />
            ) : payments.length === 0 ? (
              <p className="text-dark text-sm">Todavía no hay intentos de pago.</p>
            ) : (
              <ul className="space-y-3">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="text-dark">{METHOD_LABELS[payment.method] ?? payment.method}</p>
                      <p className="caption-text">{dateFormatter.format(new Date(payment.createdAt))}</p>
                      {payment.reason && <p className="caption-text">{payment.reason}</p>}
                      {payment.transferReference && (
                        <p className="caption-text">Referencia: {payment.transferReference}</p>
                      )}
                    </div>
                    <StatusBadge status={payment.status} />
                  </li>
                ))}
              </ul>
            )}

            {canRetry && (
              <div className="border-t border-dark/10 pt-4">
                <h3 className="font-semibold text-dark mb-3">Reintentar pago</h3>
                <PaymentMethodForm onSubmit={handleRetry} submitLabel="Reintentar pago" />
              </div>
            )}

            {canSubmitTransferReference && (
              <div className="border-t border-dark/10 pt-4">
                <p className="text-dark text-sm mb-3">
                  Cuando hayas hecho la transferencia, envíanos la referencia para que podamos confirmarla.
                </p>
                <TransferReferenceForm
                  initialValue={latestPayment.transferReference}
                  onSubmit={handleAttachTransferReference}
                />
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default OrderDetail
