// Mirrors the backend's OrderStatus: each state can only move to the next one.
export const ORDER_STATUSES = ['CREADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'DEVUELTO']

export const NEXT_STATUS = {
  CREADO: 'EN_PREPARACION',
  EN_PREPARACION: 'DESPACHADO',
  DESPACHADO: 'ENTREGADO',
  ENTREGADO: 'DEVUELTO',
}

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
