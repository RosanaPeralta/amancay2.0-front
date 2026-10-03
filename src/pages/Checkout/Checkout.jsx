import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import Loading from '../../components/Loading/Loading'
import PaymentMethodForm from '../../components/checkout/PaymentMethodForm'
import { fetchAddresses } from '../../store/slices/addressesSlice'
import { clear, selectCartItems, selectCartSubtotal } from '../../store/slices/cartSlice'
import { createOrder } from '../../services/ordersService'
import { createPayment, retryPayment } from '../../services/paymentsService'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function Checkout() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const { items: addresses, status: addressesStatus } = useSelector((state) => state.addresses)

  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)
  const [attemptingPayment, setAttemptingPayment] = useState(false)

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  if (!selectedAddressId && addresses.length > 0) {
    const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0]
    setSelectedAddressId(defaultAddress.id)
  }

  // Once the order exists the cart is cleared, even if the payment fails.
  async function handlePlaceOrder({ method, card }) {
    const createdOrder = await createOrder({
      shippingAddressId: selectedAddressId,
      items: items.map((item) => ({ productVariantId: item.variantId, quantity: item.quantity })),
    })
    dispatch(clear())
    setOrder(createdOrder)
    setAttemptingPayment(true)
    try {
      setPayment(await createPayment(createdOrder.id, { method, card }))
    } finally {
      setAttemptingPayment(false)
    }
  }

  async function handleRetryPayment({ method, card }) {
    const result = payment
      ? await retryPayment(payment.id, { method, card })
      : await createPayment(order.id, { method, card })
    setPayment(result)
  }

  if (items.length === 0 && !order) {
    return (
      <Container className="py-12 text-center">
        <Notice>
          Tu carrito está vacío.
          <div className="mt-4">
            <Button to="/products" variant="outline">
              Ver productos
            </Button>
          </div>
        </Notice>
      </Container>
    )
  }

  if (order) {
    return (
      <Container className="py-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8 text-center">Pedido realizado</h1>
        <div className="max-w-md mx-auto space-y-6">
          <div className="rounded-2xl border border-dark/5 bg-white p-6 shadow-sm space-y-1 text-center">
            <p className="text-sm text-dark/60">Pedido #{order.id.slice(0, 8)}</p>
            <p className="text-2xl font-semibold text-primary">{currencyFormatter.format(order.total)}</p>
          </div>

          {attemptingPayment && <Loading />}

          {!attemptingPayment && payment?.status === 'APROBADO' && (
            <Notice>Pago aprobado. Ya estamos preparando tu pedido.</Notice>
          )}

          {!attemptingPayment && payment?.status === 'PENDIENTE' && (
            <>
              <Notice>Pago pendiente de confirmación (transferencia bancaria).</Notice>
              <div className="text-center">
                <Button to={`/account/orders/${order.id}`}>Ir al pedido para cargar la referencia de la transferencia</Button>
              </div>
            </>
          )}

          {!attemptingPayment && payment?.status === 'RECHAZADO' && (
            <>
              <Notice variant="error">Pago rechazado{payment.reason ? `: ${payment.reason}` : '.'}</Notice>
              <PaymentMethodForm onSubmit={handleRetryPayment} submitLabel="Reintentar pago" />
            </>
          )}

          {!attemptingPayment && !payment && (
            <>
              <Notice variant="error">No pudimos procesar el pago. Puedes intentarlo de nuevo abajo.</Notice>
              <PaymentMethodForm onSubmit={handleRetryPayment} submitLabel="Intentar pagar de nuevo" />
            </>
          )}

          <div className="text-center">
            <Button to="/products" variant="outline">
              Seguir comprando
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-10 text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8">Finalizar compra</h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <Panel title="Dirección de envío">
            {addressesStatus === 'idle' || addressesStatus === 'loading' ? (
              <Loading />
            ) : addresses.length === 0 ? (
              <Notice>
                Todavía no tienes direcciones guardadas.
                <div className="mt-4">
                  <Button to="/account/addresses" variant="outline">
                    Agregar una dirección
                  </Button>
                </div>
              </Notice>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 accent-primary"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <span className="text-sm">
                      <span className="block font-medium text-dark">
                        {address.street} {address.number}
                      </span>
                      <span className="block text-dark">
                        {[address.city, address.province, address.country].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </Panel>

          {addresses.length > 0 && (
            <Panel title="Pago">
              <PaymentMethodForm
                onSubmit={handlePlaceOrder}
                submitLabel="Confirmar pedido"
                disabled={!selectedAddressId}
              />
            </Panel>
          )}
        </div>

        <Panel title="Resumen del pedido" className="md:sticky md:top-24">
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between gap-2">
                <span className="text-dark">
                  {item.productName} × {item.quantity}
                </span>
                <span className="text-dark">{currencyFormatter.format(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-dark/10 pt-4 font-semibold text-dark">
            <span>Total</span>
            <span>{currencyFormatter.format(subtotal)}</span>
          </div>
        </Panel>
      </div>
    </Container>
  )
}

export default Checkout
