import { httpClient } from './httpClient'

export function listOrders() {
  return httpClient.get('/orders')
}

export function getOrder(id) {
  return httpClient.get(`/orders/${id}`)
}

export function createOrder(data) {
  return httpClient.post('/orders', data)
}
