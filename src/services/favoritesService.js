import { httpClient } from './httpClient'

export function listFavorites({ page = 0, size = 12 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  return httpClient.get(`/me/favorites?${params.toString()}`)
}

export function listFavoriteIds() {
  return httpClient.get('/me/favorites/ids')
}

export function createFavorite(productId) {
  return httpClient.post('/me/favorites', { productId })
}

export function deleteFavorite(productId) {
  return httpClient.delete(`/me/favorites/${productId}`)
}
