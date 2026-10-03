import { httpClient } from './httpClient'

export function listPayments(orderId) {
  return httpClient.get(`/orders/${orderId}/payments`)
}

export function createPayment(orderId, data) {
  return httpClient.post(`/orders/${orderId}/payments`, data)
}

export function retryPayment(paymentId, data) {
  return httpClient.post(`/payments/${paymentId}/retry`, data)
}

export function attachTransferReference(paymentId, transferReference) {
  return httpClient.patch(`/payments/${paymentId}/transfer-reference`, { transferReference })
}

// Admin only.
export function listPendingPayments() {
  return httpClient.get('/admin/payments/pending')
}

export function confirmPayment(paymentId, status) {
  return httpClient.patch(`/admin/payments/${paymentId}/confirm`, { status })
}
