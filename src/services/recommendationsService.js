import { httpClient } from './httpClient'

export function getRecommendations({ limit = 8 } = {}) {
  return httpClient.get(`/me/recommendations?limit=${limit}`)
}
