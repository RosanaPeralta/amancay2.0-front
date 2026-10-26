import Notice from '../ui/Notice'
import ProductCard from '../ProductCard/ProductCard'
import { ProductGridSkeleton } from '../ProductCard/ProductCardSkeleton'

// Without emptyMessage an empty list renders nothing, so the caller can hide the section.
function RecommendedProducts({ items, status, error, gridClass, skeletonCount = 4, emptyMessage }) {
  if (status === 'idle' || status === 'loading') {
    return <ProductGridSkeleton count={skeletonCount} className={gridClass} />
  }
  if (status === 'failed') {
    return <Notice variant="error">No pudimos cargar tus recomendaciones: {error}</Notice>
  }
  if (items.length === 0) {
    return emptyMessage ? <Notice>{emptyMessage}</Notice> : null
  }

  return (
    <div className={`grid grid-cols-1 ${gridClass} animate-fade-in-up`}>
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default RecommendedProducts
