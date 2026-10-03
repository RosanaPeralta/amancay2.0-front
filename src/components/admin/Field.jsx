import { cloneElement, useId } from 'react'

// Label + control + hint/error. Pass the control as the only child; it gets the id and aria wiring.
function Field({ label, hint, error, className = '', children }) {
  const id = useId()
  return (
    <div className={`text-left ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-dark">
        {label}
      </label>
      {cloneElement(children, { id, 'aria-invalid': Boolean(error) || undefined })}
      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-dark/50">{hint}</p>
      )}
    </div>
  )
}

export default Field
