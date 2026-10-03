const pageClass = (active) =>
  `inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-40 disabled:pointer-events-none ${
    active ? 'bg-primary text-white' : 'bg-white border border-dark/10 text-dark hover:border-primary/30 hover:text-primary'
  }`

// Current page ±1 plus first/last, with gaps collapsed into "…".
function visiblePages(current, total) {
  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 0 && page < total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? ['gap-' + page, page] : [page]))
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginación">
      <button type="button" className={pageClass(false)} onClick={() => onPageChange(page - 1)} disabled={page === 0}>
        Anterior
      </button>
      {visiblePages(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-1 text-dark/40">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={pageClass(item === page)}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item + 1}
          </button>
        ),
      )}
      <button
        type="button"
        className={pageClass(false)}
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
      >
        Siguiente
      </button>
    </nav>
  )
}

export default Pagination
