import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import StatusBadge from '../../components/ui/StatusBadge'
import PaymentStatusIcon from '../../components/checkout/PaymentStatusIcon'
import { getOrder } from '../../services/ordersService'
import { listPayments, verifyPayment } from '../../services/paymentsService'
import {
  forgetMercadoPagoCheckout,
  readMercadoPagoCheckout,
  rememberMercadoPagoCheckout,
} from '../../lib/mercadoPagoCheckout'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

// Mercado Pago can take a few seconds to make an approved payment searchable,
// so when it reports "approved" we keep checking for a little while.
const MAX_ATTEMPTS = 5
const RETRY_DELAY_MS = 2500

const IN_PROGRESS_STATUSES = ['pending', 'in_process']

// Mercado Pago sends the buyer back here (back_urls) with external_reference = order id.
function MercadoPagoReturn() {
  const [searchParams] = useSearchParams()
  // Read once: the remembered checkout is cleared when the payment is approved.
  const [orderId] = useState(() => searchParams.get('external_reference') || readMercadoPagoCheckout()?.orderId)
  const providerStatus = searchParams.get('collection_status') || searchParams.get('status')

  const [phase, setPhase] = useState('checking')
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState(null)
  const timer = useRef(null)

  const check = useCallback(() => {
    clearTimeout(timer.current)
    setPhase('checking')
    setError(null)

    async function attemptCheck(attempt) {
      try {
        const payments = await listPayments(orderId)
        let current = payments.find((item) => item.method === 'MERCADO_PAGO')
        if (!current) {
          setPhase('missing')
          return
        }
        if (current.status === 'PENDIENTE') {
          current = await verifyPayment(current.id)
        }
        // Read the order after verifying: an approved payment moves it forward.
        setOrder(await getOrder(orderId))
        setPayment(current)

        if (current.status === 'APROBADO') {
          forgetMercadoPagoCheckout()
          setPhase('approved')
        } else if (current.status === 'RECHAZADO') {
          setPhase('not_paid')
        } else if (providerStatus === 'approved' && attempt + 1 < MAX_ATTEMPTS) {
          timer.current = setTimeout(() => attemptCheck(attempt + 1), RETRY_DELAY_MS)
        } else if (providerStatus === 'approved' || IN_PROGRESS_STATUSES.includes(providerStatus)) {
          setPhase('pending')
        } else {
          setPhase('not_paid')
        }
      } catch (err) {
        setError(err.message)
        setPhase('error')
      }
    }

    attemptCheck(0)
  }, [orderId, providerStatus])

  useEffect(() => {
    if (!orderId) return undefined
    // Defer so the first render shows the spinner before any request starts.
    timer.current = setTimeout(() => check(), 0)
    return () => clearTimeout(timer.current)
  }, [orderId, check])

  if (!orderId || phase === 'missing') {
    return (
      <Container className="py-12 text-center">
        <Notice variant="error">
          No encontramos el pago de Mercado Pago de este pedido.
          <div className="mt-4">
            <Button to="/account/orders" variant="outline">
              Ir a mis pedidos
            </Button>
          </div>
        </Notice>
      </Container>
    )
  }

  if (phase === 'error') {
    return (
      <Container className="py-12 text-center">
        <Notice variant="error">
          No pudimos verificar tu pago: {error}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button onClick={() => check()}>Reintentar</Button>
            <Button to={`/account/orders/${orderId}`} variant="outline">
              Ver mi pedido
            </Button>
          </div>
        </Notice>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-lg animate-fade-in-up rounded-2xl border border-dark/5 bg-white p-8 text-center shadow-sm sm:p-10">
        {phase === 'checking' && (
          <div className="space-y-4 py-6" role="status">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-dark/10 border-t-primary" />
            <h1 className="text-2xl font-bold text-primary">Confirmando tu pago…</h1>
            <p className="text-sm text-dark/60">Estamos consultando a Mercado Pago. Esto puede tardar unos segundos.</p>
          </div>
        )}

        {phase === 'approved' && (
          <div className="space-y-4">
            <PaymentStatusIcon variant="approved" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">¡Pago aprobado!</h1>
            <p className="text-dark/70">
              Recibimos tu pago con Mercado Pago. Ya estamos preparando tu pedido.
            </p>
          </div>
        )}

        {phase === 'pending' && (
          <div className="space-y-4">
            <PaymentStatusIcon variant="pending" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">Tu pago está en proceso</h1>
            <p className="text-dark/70">
              Mercado Pago todavía no lo acreditó. Apenas se acredite, tu pedido se confirma solo. También podés
              verificarlo desde el detalle del pedido.
            </p>
          </div>
        )}

        {phase === 'not_paid' && (
          <div className="space-y-4">
            <PaymentStatusIcon variant="failed" />
            <h1 className="text-3xl font-bold tracking-tight text-primary">No se completó el pago</h1>
            <p className="text-dark/70">Tu pedido quedó guardado. Podés volver a intentarlo cuando quieras.</p>
          </div>
        )}

        {phase !== 'checking' && order && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-mist px-5 py-4 text-left">
            <div>
              <p className="text-sm font-medium text-dark">Pedido #{order.id.slice(0, 8)}</p>
              <p className="text-lg font-semibold text-primary">{currencyFormatter.format(order.total)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        )}

        {phase !== 'checking' && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {phase === 'approved' && (
              <>
                <Button to={`/account/orders/${orderId}`}>Ver mi pedido</Button>
                <Button to="/products" variant="outline">
                  Seguir comprando
                </Button>
              </>
            )}
            {phase === 'pending' && (
              <>
                <Button onClick={() => check()}>Verificar de nuevo</Button>
                <Button to={`/account/orders/${orderId}`} variant="outline">
                  Ver mi pedido
                </Button>
              </>
            )}
            {phase === 'not_paid' && (
              <>
                {payment?.status === 'PENDIENTE' && payment.checkoutUrl && (
                  <Button href={payment.checkoutUrl} onClick={() => rememberMercadoPagoCheckout(payment)}>
                    Volver a Mercado Pago
                  </Button>
                )}
                <Button to={`/account/orders/${orderId}`} variant="outline">
                  Ver mi pedido
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

export default MercadoPagoReturn
