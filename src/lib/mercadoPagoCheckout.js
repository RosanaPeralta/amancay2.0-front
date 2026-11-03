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

export function redirectToMercadoPago(payment) {
  rememberMercadoPagoCheckout(payment)
  window.location.assign(payment.checkoutUrl)
}
