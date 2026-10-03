export const tableWrapClass = 'overflow-x-auto rounded-2xl border border-dark/5 bg-white shadow-sm'
export const thClass = 'px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-wider text-dark/50 whitespace-nowrap'
export const tdClass = 'px-4 py-3 align-middle'
export const rowClass = (selected) =>
  `border-t border-dark/5 transition-colors ${selected ? 'bg-info/15' : 'hover:bg-mist/60'}`

export const inputClass = (error) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:bg-mist disabled:text-dark/60 ${
    error ? 'border-danger/60' : 'border-dark/15'
  }`
