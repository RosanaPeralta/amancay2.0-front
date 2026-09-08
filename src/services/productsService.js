import { httpClient } from './httpClient'

export function listProducts({ page = 0, size = 20, q, isActive } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (q) params.set('q', q)
  if (isActive !== undefined) params.set('is_active', String(isActive))

  return httpClient.get(`/products?${params.toString()}`)
}

export function getProduct(id) {
  return httpClient.get(`/products/${id}`)
}
