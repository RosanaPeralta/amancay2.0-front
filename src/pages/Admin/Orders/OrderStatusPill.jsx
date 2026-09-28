import StatusPill from '../../../components/admin/StatusPill'
import { statusLabel } from './sampleOrders'

const TONES = { PENDING: 'yellow', PAID: 'blue', SHIPPED: 'green', DELIVERED: 'green', CANCELLED: 'red' }

function OrderStatusPill({ status }) {
  return <StatusPill tone={TONES[status]}>{statusLabel(status)}</StatusPill>
}

export default OrderStatusPill
