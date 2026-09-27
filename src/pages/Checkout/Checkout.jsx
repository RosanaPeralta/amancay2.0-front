import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
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

  // Pick a default address as soon as the list loads, the same way ProductDetail
  // resets its own state during render instead of in an effect.
  if (!selectedAddressId && addresses.length > 0) {
    const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0]
    setSelectedAddressId(defaultAddress.id)
  }

  // Runs as the checkout form's onSubmit: only throws (letting the form show the
  // error) while the order itself hasn't been created yet. Once it exists the
  // cart is cleared and the view switches to the order screen no matter what
  // happens with this first payment attempt.
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

  // Reused for "the first attempt blew up before creating a Payment" (no payment
  // yet) and for "it was rejected, try again" (retryPayment on that same payment).
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
          Your cart is empty.
          <div className="mt-4">
            <Button to="/products" variant="outline">
              Browse products
            </Button>
          </div>
        </Notice>
      </Container>
    )
  }

  if (order) {
    return (
      <Container className="py-12">
        <SectionHeading>Order placed</SectionHeading>
        <div className="max-w-md mx-auto space-y-6">
          <div className="rounded-lg border border-dark/10 bg-white p-6 space-y-1 text-center">
            <p className="text-sm text-dark/60">Order #{order.id}</p>
            <p className="text-2xl font-semibold text-primary">{currencyFormatter.format(order.total)}</p>
          </div>

          {attemptingPayment && <Loading />}

          {!attemptingPayment && payment?.status === 'APROBADO' && (
            <Notice>Payment approved. Your order is now being prepared.</Notice>
          )}

          {!attemptingPayment && payment?.status === 'PENDIENTE' && (
            <Notice>Payment pending confirmation (bank transfer). We'll update your order once it's confirmed.</Notice>
          )}

          {!attemptingPayment && payment?.status === 'RECHAZADO' && (
            <>
              <Notice variant="error">Payment declined{payment.reason ? `: ${payment.reason}` : '.'}</Notice>
              <PaymentMethodForm onSubmit={handleRetryPayment} submitLabel="Retry payment" />
            </>
          )}

          {!attemptingPayment && !payment && (
            <>
              <Notice variant="error">We couldn't process the payment. You can try again below.</Notice>
              <PaymentMethodForm onSubmit={handleRetryPayment} submitLabel="Try payment again" />
            </>
          )}

          <div className="text-center">
            <Button to="/products" variant="outline">
              Continue shopping
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <SectionHeading>Checkout</SectionHeading>

      <div className="grid md:grid-cols-[1fr_320px] gap-10 max-w-4xl mx-auto items-start">
        <div className="space-y-8">
          <div>
            <h2 className="subtitle-primary text-lg text-dark font-semibold mb-4">Shipping address</h2>
            {addressesStatus === 'idle' || addressesStatus === 'loading' ? (
              <Loading />
            ) : addresses.length === 0 ? (
              <Notice>
                You don't have any saved addresses yet.
                <div className="mt-4">
                  <Button to="/account/addresses" variant="outline">
                    Add an address
                  </Button>
                </div>
              </Notice>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer ${
                      selectedAddressId === address.id ? 'border-primary' : 'border-dark/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <span className="text-sm">
                      <span className="block font-medium text-dark">
                        {address.street} {address.number}
                      </span>
                      <span className="block body-text-light">
                        {[address.city, address.province, address.country].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {addresses.length > 0 && (
            <div>
              <h2 className="subtitle-primary text-lg text-dark font-semibold mb-4">Payment</h2>
              <PaymentMethodForm
                onSubmit={handlePlaceOrder}
                submitLabel="Place order"
                disabled={!selectedAddressId}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-dark/10 bg-white p-6 space-y-4">
          <h2 className="subtitle-primary text-lg text-dark font-semibold">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between gap-2">
                <span className="body-text-light">
                  {item.productName} × {item.quantity}
                </span>
                <span className="text-dark">{currencyFormatter.format(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-dark/10 pt-4 font-semibold text-dark">
            <span>Total</span>
            <span>{currencyFormatter.format(subtotal)}</span>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Checkout
