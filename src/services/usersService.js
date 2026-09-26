import { httpClient } from './httpClient'

export function getMe() {
  return httpClient.get('/me')
}

export function updateMe(data) {
  return httpClient.patch('/me', data)
}
