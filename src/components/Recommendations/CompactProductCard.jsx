import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Horizontal mini card (thumbnail + text) for narrow spots like the catalog sidebar.
function CompactProductCard({ product }) {
  const categories = useSelector((state) => state.categories.items)
  const image = product.images?.[0]
  const price = product.variants?.[0]?.price
  const discountPercentage = Number(product.discount?.percentage) || 0
  const categoryName = categories.find((category) => product.categoryIds?.includes(category.id))?.name

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-dark/5 bg-white p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mist">
        {image ? (
          <img
            src={image.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="caption-text text-[0.6rem]">Sin imagen</span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 text-left">
        {categoryName && (
          <span className="truncate text-[0.6rem] font-bold uppercase tracking-wider text-secondary">{categoryName}</span>
        )}
        <span className="line-clamp-2 text-sm font-bold leading-snug text-dark group-hover:text-primary">
          {product.name}
        </span>
        {price !== undefined && (
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-primary">
              {currencyFormatter.format(price * (1 - discountPercentage / 100))}
            </span>
            {discountPercentage > 0 && (
              <span className="text-[0.65rem] text-dark/40 line-through">{currencyFormatter.format(price)}</span>
            )}
          </span>
        )}
      </span>
    </Link>
  )
}

export default CompactProductCard
