const styles = {
  PUBLISHED: 'border-primary/30 text-primary',
  HIDDEN: 'border-dark/10 text-dark/60',
}

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${styles[status] || styles.HIDDEN}`}>
      {status}
    </span>
  )
}

export default StatusBadge
