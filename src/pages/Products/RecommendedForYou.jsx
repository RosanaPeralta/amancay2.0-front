import CompactProductCard from '../../components/Recommendations/CompactProductCard'
import RecommendationSourceNote from '../../components/Recommendations/RecommendationSourceNote'

const SKELETON_ROWS = 4

function CompactSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dark/5 bg-white p-2.5 animate-pulse">
      <div className="h-20 w-20 shrink-0 rounded-xl bg-mist" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-2 w-1/3 rounded bg-dark/10" />
        <div className="h-3 w-3/4 rounded bg-dark/10" />
        <div className="h-3 w-1/4 rounded bg-dark/10" />
      </div>
    </div>
  )
}

// Sidebar next to the catalog. It scrolls with the page (not sticky) so it never hides the grid.
function RecommendedForYou({ items, status, source, favoritesCount, basedOnCount, categoryName }) {
  const isLoading = status === 'idle' || status === 'loading'

  return (
    <aside className="rounded-3xl bg-mist/70 p-4" aria-labelledby="recommended-heading">
      <h2 id="recommended-heading" className="text-xl font-bold tracking-tight text-primary">
        {categoryName ? `Para vos en ${categoryName}` : 'Para vos'}
      </h2>
      <p className="mb-4 mt-1">
        {status === 'succeeded' && <RecommendationSourceNote source={source} favoritesCount={favoritesCount} basedOnCount={basedOnCount} />}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {isLoading
          ? Array.from({ length: SKELETON_ROWS }).map((_, index) => <CompactSkeleton key={index} />)
          : items.map((product) => <CompactProductCard key={product.id} product={product} />)}
      </div>
    </aside>
  )
}

export default RecommendedForYou
