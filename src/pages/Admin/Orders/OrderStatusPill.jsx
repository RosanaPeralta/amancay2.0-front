import StatusPill from '../../../components/admin/StatusPill'
import { statusLabel } from './orderStatus'

const TONES = { CREADO: 'yellow', EN_PREPARACION: 'blue', DESPACHADO: 'green', ENTREGADO: 'green', DEVUELTO: 'red' }

function OrderStatusPill({ status }) {
  return <StatusPill tone={TONES[status]}>{statusLabel(status)}</StatusPill>
}

export default OrderStatusPill
