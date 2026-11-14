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

export function changeOrderStatus(id, status) {
  return httpClient.patch(`/orders/${id}/status`, { status })
}
