function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
    </svg>
  )
}

// Rendered inline (span) so it can sit inside a heading's subtitle paragraph.
function describeBasis(favoritesCount, basedOnCount) {
  if (basedOnCount > 0 && basedOnCount < favoritesCount) return `${basedOnCount} de tus ${favoritesCount} favoritos`
  return favoritesCount === 1 ? 'tu favorito' : `tus ${favoritesCount} favoritos`
}

function RecommendationSourceNote({ source, favoritesCount, basedOnCount }) {
  const basedOn = describeBasis(favoritesCount, basedOnCount)

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm text-dark/60">
      {source === 'AI' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
          <SparkleIcon />
          IA
        </span>
      )}
      {source === 'AI' ? `Sugerencias pensadas a partir de ${basedOn}.` : `Basadas en las categorías de ${basedOn}.`}
    </span>
  )
}

export default RecommendationSourceNote
