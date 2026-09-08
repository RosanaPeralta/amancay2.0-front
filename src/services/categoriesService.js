import { httpClient } from './httpClient'

export function listCategories() {
  return httpClient.get('/categories')
}
