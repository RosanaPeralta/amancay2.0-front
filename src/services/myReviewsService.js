import { httpClient } from './httpClient'

export function listMyReviews({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  return httpClient.get(`/me/reviews?${params.toString()}`)
}

export function updateReview(id, data) {
  return httpClient.put(`/reviews/${id}`, data)
}

export function deleteReview(id) {
  return httpClient.delete(`/reviews/${id}`)
}
