import { useId } from 'react'

function FilterSelect({ label, value, options, onChange }) {
  const id = useId()

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor={id} className="text-dark/60 whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="appearance-none max-w-[14rem] truncate pl-4 pr-9 py-2 rounded-full border border-dark/10 bg-white font-semibold text-dark cursor-pointer transition-colors hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark/50 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

export default FilterSelect
