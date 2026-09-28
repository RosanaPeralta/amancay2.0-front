// Sample data only: orders aren't wired to the API yet (a teammate is building that part).
const tent = { name: 'Carpa de mochilero 4 estaciones', price: 349 }
const stove = { name: 'Anafe portátil de camping', price: 89.95 }
const helmet = { name: 'Casco de ciclismo', price: 79 }
const socks = { name: 'Medias de trekking de lana merino (pack x2)', price: 24 }
const rope = { name: 'Cuerda dinámica de escalada 60 m', price: 219 }
const vest = { name: 'Chaleco salvavidas para kayak', price: 64.95 }
const bike = { name: 'Bicicleta de montaña rígida', price: 899 }
const chalk = { name: 'Bolsa de magnesio para escalada', price: 19.95 }

export const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export const sampleOrders = [
  { id: 1048, date: '2026-09-26', email: 'lucia@example.com', status: 'PENDING', items: [{ ...tent, quantity: 1 }, { ...stove, quantity: 1 }] },
  { id: 1047, date: '2026-09-25', email: 'mateo@example.com', status: 'PAID', items: [{ ...rope, quantity: 1 }, { ...vest, quantity: 1 }, { ...socks, quantity: 1 }] },
  { id: 1046, date: '2026-09-25', email: 'sofia@example.com', status: 'SHIPPED', items: [{ ...bike, quantity: 1 }, { ...chalk, quantity: 1 }] },
  { id: 1045, date: '2026-09-24', email: 'diego@example.com', status: 'DELIVERED', items: [{ ...helmet, quantity: 1 }] },
  { id: 1044, date: '2026-09-23', email: 'valentina@example.com', status: 'DELIVERED', items: [{ ...socks, quantity: 2 }] },
  { id: 1043, date: '2026-09-22', email: 'tomas@example.com', status: 'CANCELLED', items: [{ ...bike, quantity: 1 }, { ...helmet, quantity: 1 }] },
  { id: 1042, date: '2026-09-21', email: 'camila@example.com', status: 'SHIPPED', items: [{ ...rope, quantity: 1 }] },
  { id: 1041, date: '2026-09-20', email: 'joaquin@example.com', status: 'DELIVERED', items: [{ ...chalk, quantity: 1 }, { ...socks, quantity: 1 }] },
]

export const orderTotal = (order) => order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const STATUS_LABELS = { PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' }

export const statusLabel = (status) => STATUS_LABELS[status] ?? status
