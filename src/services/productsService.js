import { httpClient } from './httpClient'

export function listProducts({ page = 0, size = 20, name, categoryId, isActive, sort } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (name) params.set('name', name)
  if (categoryId) params.set('category_id', categoryId)
  if (sort) params.set('sort', sort)
  if (isActive !== undefined) params.set('is_active', String(isActive))

  return httpClient.get(`/products?${params.toString()}`)
}

export function getProduct(id) {
  return httpClient.get(`/products/${id}`)
}
