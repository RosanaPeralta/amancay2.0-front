// Mirrors the backend's OrderStatus.
export const ORDER_STATUSES = [
  'CREADO',
  'EN_PREPARACION',
  'LISTO_PARA_DESPACHAR',
  'DESPACHADO',
  'ENTREGADO',
  'ESPERANDO_RETIRO',
  'RETIRADO',
  'DEVUELTO',
]

// Who moves each status forward (mirrors OrderStatus/OrderTransitionTrigger in the backend):
// the approved payment, external logistics (RabbitMQ) or an approved return request.
const ADVANCED_BY = {
  CREADO: 'PAYMENT',
  EN_PREPARACION: 'LOGISTICS',
  LISTO_PARA_DESPACHAR: 'LOGISTICS',
  DESPACHADO: 'LOGISTICS',
  ENTREGADO: 'RETURN_REQUEST',
  ESPERANDO_RETIRO: 'LOGISTICS',
  RETIRADO: 'LOGISTICS',
}

export const advancedBy = (status) => ADVANCED_BY[status] ?? null

const STATUS_LABELS = {
  CREADO: 'Creado',
  EN_PREPARACION: 'En preparación',
  LISTO_PARA_DESPACHAR: 'Listo para despachar',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  ESPERANDO_RETIRO: 'Esperando retiro',
  RETIRADO: 'Retirado',
  DEVUELTO: 'Devuelto',
}

export const statusLabel = (status) => STATUS_LABELS[status] ?? status

export const shortId = (id) => id.slice(0, 8)

export const itemCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
