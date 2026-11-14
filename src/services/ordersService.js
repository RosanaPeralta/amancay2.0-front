import { httpClient } from './httpClient'

export function listOrders() {
  return httpClient.get('/orders')
}

export function getOrder(id) {
  return httpClient.get(`/orders/${id}`)
}

export function getShippingQuote(addressId) {
  return httpClient.get(`/orders/shipping-quote?addressId=${addressId}`)
}

export function createOrder(data) {
  return httpClient.post('/orders', data)
}

// Admin only.
export function listAllOrders() {
  return httpClient.get('/admin/orders')
}

// Admin only: any buyer's order.
export function getOrderOf(id, userId) {
  return httpClient.get(`/orders/${id}?userId=${userId}`)
}

// Admin only. From EN_PREPARACION on, the status moves through the logistics queue:
// the API answers 202 with the queued command and the order changes a moment later.
export function requestOrderAdvance(id, status) {
  return httpClient.patch(`/orders/${id}/status`, { status })
}
