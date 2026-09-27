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
