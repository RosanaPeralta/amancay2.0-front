import { httpClient } from './httpClient'

export function listProductReviews(productId, { page = 0, size = 10, sort = 'recent' } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort })
  return httpClient.get(`/products/${productId}/reviews?${params.toString()}`)
}

export function getRatingSummary(productId) {
  return httpClient.get(`/products/${productId}/reviews/summary`)
}

export function createReview(productId, data) {
  return httpClient.post(`/products/${productId}/reviews`, data)
}
