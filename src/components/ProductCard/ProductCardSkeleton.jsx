function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-dark/5 shadow-sm animate-pulse">
      <div className="aspect-[1/0.85] bg-mist" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="h-2.5 bg-dark/10 rounded w-1/4" />
        <div className="h-4 bg-dark/10 rounded w-3/4" />
        <div className="h-3 bg-dark/10 rounded w-full" />
        <div className="flex items-end justify-between pt-4">
          <div className="h-5 bg-dark/10 rounded w-1/3" />
          <div className="h-7 bg-dark/10 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6, className = 'sm:grid-cols-2 md:grid-cols-3 gap-8' }) {
  return (
    <div className={`grid grid-cols-1 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
