import { Link } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function ProductCard({ product }) {
  const variant = product.variants?.[0]
  const image = product.images?.[0]

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col border border-dark/10 rounded-lg overflow-hidden bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-light"
    >
      <div className="aspect-square bg-light overflow-hidden flex items-center justify-center">
        {image ? (
          <img
            src={image.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="caption-text">No image</span>
        )}
      </div>
      <div className="flex flex-col flex-1 gap-2 p-4 text-left">
        <h3 className="text-base font-medium text-dark transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        {product.shortDescription && <p className="body-text line-clamp-2">{product.shortDescription}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-primary">
            {variant ? currencyFormatter.format(variant.price) : 'N/A'}
          </span>
          {variant && (
            <span className={`text-xs ${variant.stockQuantity > 0 ? 'text-dark/60' : 'text-danger'}`}>
              {variant.stockQuantity > 0 ? `${variant.stockQuantity} in stock` : 'Out of stock'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
