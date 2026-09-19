import { httpClient } from './httpClient'

export function listUsers({ q, page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (q) params.set('q', q)
  return httpClient.get(`/admin/users?${params.toString()}`)
}

export function changeUserRole(id, role) {
  return httpClient.patch(`/admin/users/${id}/role`, { role })
}
