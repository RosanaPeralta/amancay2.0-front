// Labels for the backend's PaymentMethod values.
export const PAYMENT_METHOD_LABELS = {
  TARJETA_CREDITO: 'Tarjeta de crédito',
  TARJETA_DEBITO: 'Tarjeta de débito',
  TRANSFERENCIA: 'Transferencia bancaria',
  MERCADO_PAGO: 'Mercado Pago',
}

export const paymentMethodLabel = (method) => PAYMENT_METHOD_LABELS[method] ?? method

// A Mercado Pago payment that is still waiting for the buyer to pay in the checkout.
export function isPendingMercadoPago(payment) {
  return payment?.method === 'MERCADO_PAGO' && payment?.status === 'PENDIENTE' && Boolean(payment?.checkoutUrl)
}

// Mercado Pago cannot send the buyer back to localhost (back_urls must be a real domain).
// There the checkout opens in a new tab and this tab waits for the payment instead.
export function canReturnFromMercadoPago() {
  return !['localhost', '127.0.0.1'].includes(window.location.hostname)
}

export function waitingForPaymentPath(orderId) {
  return `/checkout/resultado?external_reference=${orderId}&espera=1`
}

// Remembered before leaving for Mercado Pago, in case the return URL does not bring the order back.
const STORAGE_KEY = 'amancay.mercadoPagoCheckout'

export function rememberMercadoPagoCheckout(payment) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ orderId: payment.orderId, paymentId: payment.id }))
  } catch {
    // Storage can be unavailable (private mode); the return URL still carries the order id.
  }
}

export function readMercadoPagoCheckout() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function forgetMercadoPagoCheckout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clean up.
  }
}

// Opens the tab for Mercado Pago right away, while the click still counts as a user action
// (browsers block pop-ups opened after waiting for the server). Only needed on localhost.
export function prepareMercadoPagoTab() {
  if (canReturnFromMercadoPago()) return null
  const tab = window.open('', '_blank')
  if (!tab) return null
  tab.opener = null
  tab.document.title = 'Mercado Pago'
  tab.document.body.innerHTML =
    '<p style="font-family: system-ui, sans-serif; color: #2e5e4e; padding: 2rem">Conectando con Mercado Pago…</p>'
  return tab
}

// Sends the buyer to Mercado Pago: same tab when Mercado Pago can bring them back,
// otherwise a new tab, while this one waits for the payment.
export function openMercadoPagoCheckout(payment, navigate, preparedTab = null) {
  rememberMercadoPagoCheckout(payment)
  if (canReturnFromMercadoPago()) {
    window.location.assign(payment.checkoutUrl)
    return
  }
  if (preparedTab && !preparedTab.closed) {
    preparedTab.location.href = payment.checkoutUrl
  } else {
    // If the browser blocks it, the waiting page has a button to open it.
    window.open(payment.checkoutUrl, '_blank', 'noopener')
  }
  navigate(waitingForPaymentPath(payment.orderId))
}
