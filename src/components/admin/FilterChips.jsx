const chipClass = (active) =>
  `px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
    active ? 'bg-primary border-primary text-white' : 'bg-white border-dark/10 text-dark hover:border-primary/30 hover:text-primary'
  }`

function FilterChips({ options, value, onChange, label }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={chipClass(value === option.value)}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label} · {option.count}
        </button>
      ))}
    </div>
  )
}

export default FilterChips
