import { useEffect, useState } from 'react'

function SearchInput({ name, onNameChange }) {
  const [text, setText] = useState(name)
  const [prevName, setPrevName] = useState(name)

  // Keep the input in sync when the name changes from outside (e.g. "Clear filters").
  if (name !== prevName) {
    setPrevName(name)
    if (name !== text.trim()) setText(name)
  }

  useEffect(() => {
    const value = text.trim()
    if (value === name) return
    const handle = setTimeout(() => onNameChange(value), 400)
    return () => clearTimeout(handle)
  }, [text, name, onNameChange])

  return (
    <label className="relative block w-full md:w-80">
      <span className="sr-only">Buscar productos por nombre</span>
      <svg
        viewBox="0 0 24 24"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Busca carpas, cuerdas, cascos..."
        maxLength={100}
        className="w-full pl-11 pr-4 py-2.5 rounded-full border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />
    </label>
  )
}

export default SearchInput
