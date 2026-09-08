import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-light disabled:opacity-40 disabled:pointer-events-none'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  outline: 'border border-primary/30 text-primary hover:bg-primary/5',
}

function Button({ to, variant = 'primary', className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
