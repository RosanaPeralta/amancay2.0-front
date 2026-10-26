import { Link } from 'react-router-dom'

function SectionHeader({ title, subtitle, linkLabel, linkTo = '/products' }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 text-left">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-dark/60">{subtitle}</p>}
      </div>
      <Link to={linkTo} className="flex shrink-0 items-center gap-1 text-sm font-bold text-dark hover:text-primary">
        {linkLabel}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  )
}

export default SectionHeader
