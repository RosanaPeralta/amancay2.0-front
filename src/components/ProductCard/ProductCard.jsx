import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FavoriteButton from '../FavoriteButton/FavoriteButton'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const LOW_STOCK_THRESHOLD = 5

function Badges({ stockQuantity, discountPercentage }) {
  const lowStock = stockQuantity > 0 && stockQuantity <= LOW_STOCK_THRESHOLD
  if (!lowStock && !discountPercentage) return null

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
      {discountPercentage > 0 && (
        <span className="px-2.5 py-1 rounded-full bg-info-pink text-white text-[0.7rem] font-bold shadow-sm">
          -{Math.round(discountPercentage)}%
        </span>
      )}
      {lowStock && (
        <span className="px-2.5 py-1 rounded-full bg-info text-dark text-[0.7rem] font-bold shadow-sm">
          Solo quedan {stockQuantity}
        </span>
      )}
    </div>
  )
}

function Price({ price, discountPercentage }) {
  if (!discountPercentage) {
    return <span className="text-xl font-bold text-primary">{currencyFormatter.format(price)}</span>
  }
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-primary">
        {currencyFormatter.format(price * (1 - discountPercentage / 100))}
      </span>
      <span className="text-xs text-dark/40 line-through">{currencyFormatter.format(price)}</span>
    </span>
  )
}

function StockStatus({ quantity }) {
  const inStock = quantity > 0
  return (
    <span className="flex items-center gap-1.5 text-xs text-dark/60">
      <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-primary-light' : 'bg-danger'}`} aria-hidden="true" />
      {inStock ? `${quantity} en stock` : 'Sin stock'}
    </span>
  )
}

function ProductCard({ product }) {
  const categories = useSelector((state) => state.categories.items)
  const variant = product.variants?.[0]
  const image = product.images?.[0]
  const discountPercentage = Number(product.discount?.percentage) || 0
  const categoryName = categories.find((category) => product.categoryIds?.includes(category.id))?.name

  return (
    <div className="relative h-full">
      <FavoriteButton productId={product.id} className="absolute top-3 right-3 z-10 shadow-sm" />
      <Badges stockQuantity={variant?.stockQuantity ?? 0} discountPercentage={discountPercentage} />
      <Link
        to={`/products/${product.id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-dark/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <div className="aspect-[1/0.85] bg-mist overflow-hidden flex items-center justify-center">
          {image ? (
            <img
              src={image.imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="caption-text">Sin imagen</span>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-1.5 p-4 text-left">
          {categoryName && (
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-secondary">{categoryName}</span>
          )}
          <h3 className="text-[0.95rem] font-bold text-dark leading-snug transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          {product.shortDescription && <p className="body-text line-clamp-2">{product.shortDescription}</p>}
          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            {variant ? (
              <div className="flex flex-col gap-0.5">
                <Price price={variant.price} discountPercentage={discountPercentage} />
                <StockStatus quantity={variant.stockQuantity} />
              </div>
            ) : (
              <span className="text-sm text-dark/50">Precio no disponible</span>
            )}
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold transition-colors group-hover:bg-primary-light">
              Ver
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
