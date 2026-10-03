import { Link } from 'react-router-dom'

const className =
  'inline-flex items-center gap-1.5 rounded-full border border-dark/15 bg-white px-3 py-1 text-xs font-bold text-dark transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

function EditButton({ to, onClick, label = 'Editar' }) {
  if (to) {
    return (
      <Link to={to} className={className}>
        <PencilIcon />
        {label}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      <PencilIcon />
      {label}
    </button>
  )
}

export default EditButton
