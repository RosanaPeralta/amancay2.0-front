import { httpClient } from './httpClient'

export function listAddresses() {
  return httpClient.get('/me/addresses')
}

export function createAddress(data) {
  return httpClient.post('/me/addresses', data)
}

export function updateAddress(id, data) {
  return httpClient.put(`/me/addresses/${id}`, data)
}

export function deleteAddress(id) {
  return httpClient.delete(`/me/addresses/${id}`)
}

export function setDefaultAddress(id) {
  return httpClient.put(`/me/addresses/${id}/default`)
}
