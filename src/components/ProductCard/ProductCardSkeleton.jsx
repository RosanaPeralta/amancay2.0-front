function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-dark/10 rounded-lg overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-dark/5" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 bg-dark/10 rounded w-3/4" />
        <div className="h-3 bg-dark/10 rounded w-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-dark/10 rounded w-1/4" />
          <div className="h-3 bg-dark/10 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
