import { httpClient } from './httpClient'

export function listReviews({ status, page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (status) params.set('status', status)
  return httpClient.get(`/admin/reviews?${params.toString()}`)
}

export function updateReviewStatus(id, status) {
  return httpClient.patch(`/admin/reviews/${id}/status`, { status })
}

export function deleteReview(id) {
  return httpClient.delete(`/admin/reviews/${id}`)
}
