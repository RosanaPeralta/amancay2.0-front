import StatusPill from '../../../components/admin/StatusPill'
import { statusLabel } from './orderStatus'

const TONES = {
  CREADO: 'yellow',
  EN_PREPARACION: 'blue',
  LISTO_PARA_DESPACHAR: 'blue',
  DESPACHADO: 'green',
  ENTREGADO: 'green',
  ESPERANDO_RETIRO: 'yellow',
  RETIRADO: 'gray',
  DEVUELTO: 'red',
}

function OrderStatusPill({ status }) {
  return <StatusPill tone={TONES[status]}>{statusLabel(status)}</StatusPill>
}

export default OrderStatusPill
