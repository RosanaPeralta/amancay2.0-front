const styles = {
  PUBLISHED: 'border-primary/30 text-primary',
  HIDDEN: 'border-dark/10 text-dark/60',
  // Order status
  CREADO: 'border-dark/10 text-dark/60',
  EN_PREPARACION: 'border-primary/30 text-primary',
  DESPACHADO: 'border-primary/30 text-primary',
  ENTREGADO: 'border-primary/30 text-primary',
  DEVUELTO: 'border-danger/30 text-danger',
  // Payment status
  PENDIENTE: 'border-dark/10 text-dark/60',
  APROBADO: 'border-primary/30 text-primary',
  RECHAZADO: 'border-danger/30 text-danger',
}

const labels = {
  PUBLISHED: 'Publicada',
  HIDDEN: 'Oculta',
  CREADO: 'Creado',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  DEVUELTO: 'Devuelto',
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
}

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${styles[status] || styles.HIDDEN}`}>
      {labels[status] || status}
    </span>
  )
}

export default StatusBadge
