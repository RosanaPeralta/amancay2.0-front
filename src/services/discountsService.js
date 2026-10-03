import { httpClient } from './httpClient'

export function listDiscounts() {
  return httpClient.get('/discounts')
}

export function createDiscount(data) {
  return httpClient.post('/discounts', data)
}

export function updateDiscount(id, data) {
  return httpClient.put(`/discounts/${id}`, data)
}

export function deleteDiscount(id) {
  return httpClient.delete(`/discounts/${id}`)
}
