import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Panel from '../../../components/ui/Panel'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import StatusBadge from '../../../components/ui/StatusBadge'
import PaymentMethodForm from '../../../components/checkout/PaymentMethodForm'
import TransferReferenceForm from '../../../components/checkout/TransferReferenceForm'
import { fetchOrderById, fetchOrderPayments } from '../../../store/slices/ordersSlice'
import { attachTransferReference, retryPayment, verifyPayment } from '../../../services/paymentsService'
import {
  isPendingMercadoPago,
  paymentMethodLabel,
  rememberMercadoPagoCheckout,
} from '../../../lib/mercadoPagoCheckout'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { item: order, status: orderStatus, error: orderError } = useSelector((state) => state.orders.current)
  const { items: payments, status: paymentsStatus } = useSelector((state) => state.orders.payments)
  const [verifying, setVerifying] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState(null)

  useEffect(() => {
    dispatch(fetchOrderById(id))
    dispatch(fetchOrderPayments(id))
  }, [dispatch, id])

  async function handleRetry({ method, card }) {
    await retryPayment(payments[0].id, { method, card })
    dispatch(fetchOrderPayments(id))
    dispatch(fetchOrderById(id))
  }

  async function handleAttachTransferReference(transferReference) {
    await attachTransferReference(payments[0].id, transferReference)
    dispatch(fetchOrderPayments(id))
  }

  async function handleVerifyMercadoPago() {
    setVerifying(true)
    setVerifyMessage(null)
    try {
      const result = await verifyPayment(payments[0].id)
      if (result.status === 'PENDIENTE') {
        setVerifyMessage('Todavía no vemos el pago acreditado en Mercado Pago. Probá de nuevo en unos minutos.')
      }
      dispatch(fetchOrderPayments(id))
      dispatch(fetchOrderById(id))
    } catch (err) {
      setVerifyMessage(err.message)
    } finally {
      setVerifying(false)
    }
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
  const canPayWithMercadoPago = isPendingMercadoPago(latestPayment)

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
          <ul className="space-y-3 text-sm mb-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-mist">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />}
                  </div>
                  <div className="min-w-0">
                    {item.productId ? (
                      <Link to={`/products/${item.productId}`} className="font-medium text-dark hover:text-primary">
                        {item.productName}
                      </Link>
                    ) : (
                      <span className="font-medium text-dark">Producto no disponible</span>
                    )}
                    <p className="text-xs text-dark/60">
                      {item.quantity} × {currencyFormatter.format(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-dark">{currencyFormatter.format(item.subtotal)}</span>
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
                      <p className="text-dark">{paymentMethodLabel(payment.method)}</p>
                      <p className="caption-text">{dateFormatter.format(new Date(payment.createdAt))}</p>
                      {payment.reason && <p className="caption-text">{payment.reason}</p>}
                      {payment.transferReference && (
                        <p className="caption-text">Referencia: {payment.transferReference}</p>
                      )}
                      {payment.externalId && (
                        <p className="caption-text">Operación de Mercado Pago: {payment.externalId}</p>
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

            {canPayWithMercadoPago && (
              <div className="border-t border-dark/10 pt-4 space-y-3">
                <p className="text-dark text-sm">
                  Tu pago con Mercado Pago todavía no se acreditó. Si ya pagaste, verificalo; si no, podés completarlo
                  ahora.
                </p>
                {verifyMessage && <p className="text-sm text-dark/60">{verifyMessage}</p>}
                <div className="flex flex-wrap gap-2">
                  <Button href={latestPayment.checkoutUrl} onClick={() => rememberMercadoPagoCheckout(latestPayment)}>
                    Pagar con Mercado Pago
                  </Button>
                  <Button variant="outline" onClick={handleVerifyMercadoPago} disabled={verifying}>
                    {verifying ? 'Verificando...' : 'Ya pagué, verificar'}
                  </Button>
                </div>
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
