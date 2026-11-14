// Mirrors the backend's OrderStatus: each state can only move to the next one.
export const ORDER_STATUSES = ['CREADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'DEVUELTO']

export const NEXT_STATUS = {
  CREADO: 'EN_PREPARACION',
  EN_PREPARACION: 'DESPACHADO',
  DESPACHADO: 'ENTREGADO',
  ENTREGADO: 'DEVUELTO',
}

// Who moves each status forward (mirrors OrderStatus/OrderTransitionTrigger in the backend):
// the approved payment, the logistics queue (RabbitMQ) or an approved return request.
const ADVANCED_BY = {
  CREADO: 'PAYMENT',
  EN_PREPARACION: 'FULFILLMENT',
  DESPACHADO: 'FULFILLMENT',
  ENTREGADO: 'RETURN_REQUEST',
}

export const advancedBy = (status) => ADVANCED_BY[status] ?? null

// The next status the admin can queue, or null when it is not up to the logistics queue.
export const nextQueuedStatus = (status) => (advancedBy(status) === 'FULFILLMENT' ? NEXT_STATUS[status] : null)

const STATUS_LABELS = {
  CREADO: 'Creado',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  DEVUELTO: 'Devuelto',
}

export const statusLabel = (status) => STATUS_LABELS[status] ?? status

export const shortId = (id) => id.slice(0, 8)

export const itemCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
