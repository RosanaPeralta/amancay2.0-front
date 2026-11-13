
import { httpClient } from './httpClient'

// Cliente: crear una solicitud de devolución
export function createReturnRequest(orderId, data) {
  return httpClient.post(`/orders/${orderId}/return-requests`, data)
}

// Cliente: consultar la solicitud de un pedido
export function getReturnRequest(orderId) {
  return httpClient.get(`/orders/${orderId}/return-requests`)
}

// Administrador: listar solicitudes pendientes
export function listPendingReturnRequests() {
  return httpClient.get('/admin/return-requests')
}

// Administrador: aprobar una solicitud
export function approveReturnRequest(requestId) {
  return httpClient.patch(`/admin/return-requests/${requestId}/approve`, {})
}

// Administrador: rechazar una solicitud
export function rejectReturnRequest(requestId, resolutionNote) {
  return httpClient.patch(
    `/admin/return-requests/${requestId}/reject`,
    { resolutionNote }
  )
}