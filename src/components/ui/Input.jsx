import { useId } from 'react'

function Input({ label, error, className = '', ...props }) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-dark">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2.5 rounded-full border bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:bg-light disabled:text-dark/60 disabled:cursor-not-allowed ${
          error ? 'border-danger/50' : 'border-dark/10'
        }`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

export default Input
