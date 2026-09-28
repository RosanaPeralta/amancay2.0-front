const tones = {
  green: 'bg-primary/10 text-primary',
  yellow: 'bg-info/40 text-dark',
  blue: 'bg-sky-100 text-sky-800',
  red: 'bg-danger/10 text-danger',
  gray: 'bg-dark/10 text-dark/70',
}

function StatusPill({ tone = 'gray', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

export default StatusPill
