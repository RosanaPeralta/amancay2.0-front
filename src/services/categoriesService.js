import { httpClient } from './httpClient'

export function listCategories() {
  return httpClient.get('/categories')
}

export function createCategory(data) {
  return httpClient.post('/categories', data)
}

export function updateCategory(id, data) {
  return httpClient.put(`/categories/${id}`, data)
}

export function deleteCategory(id) {
  return httpClient.delete(`/categories/${id}`)
}
