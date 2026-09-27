import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import Loading from '../../components/Loading/Loading'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'
import { fetchProductById } from '../../store/slices/productsSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import { addItem } from '../../store/slices/cartSlice'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { item: product, status, error } = useSelector((state) => state.products.current)
  const { items: categories } = useSelector((state) => state.categories)

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantities, setQuantities] = useState({})
  const [prevId, setPrevId] = useState(id)

  if (id !== prevId) {
    setPrevId(id)
    setActiveImageIndex(0)
    setQuantities({})
  }

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchCategories())
  }, [dispatch, id])

  const isLoading = status === 'idle' || status === 'loading'

  if (isLoading) {
    return (
      <Container className="py-12">
        <Loading />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-12 text-center">
        <Notice variant="error">Couldn't load this product: {error}</Notice>
        <div className="mt-6">
          <Button to="/products" variant="outline">
            Back to products
          </Button>
        </div>
      </Container>
    )
  }

  function quantityFor(variant) {
    return Math.max(1, Math.min(quantities[variant.id] ?? 1, variant.stockQuantity))
  }

  function handleQuantityChange(variant, value) {
    setQuantities((prev) => ({ ...prev, [variant.id]: Number(value) || 1 }))
  }

  function handleAddToCart(variant) {
    dispatch(
      addItem({
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        imageUrl: images[0]?.imageUrl ?? null,
        unitPrice: variant.price,
        maxStock: variant.stockQuantity,
        quantity: quantityFor(variant),
      }),
    )
  }

  const images = product.images || []
  const activeImage = images[activeImageIndex]
  const categoryNames = (product.categoryIds || [])
    .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
    .filter(Boolean)

  return (
    <Container className="py-12">
      <div className="mb-8">
        <Button to="/products" variant="outline">
          ← Back to products
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-light rounded-lg overflow-hidden flex items-center justify-center">
            {activeImage ? (
              <img
                src={activeImage.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="caption-text">No image</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    index === activeImageIndex ? 'border-primary' : 'border-transparent hover:border-primary/30'
                  }`}
                >
                  <img src={image.imageUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-left">
          {categoryNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryNames.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="title text-3xl">{product.name}</h1>
            <FavoriteButton productId={product.id} className="shrink-0" />
          </div>

          {product.shortDescription && <p className="body-text mb-6">{product.shortDescription}</p>}

          <div className="flex flex-col gap-3 border-t border-dark/10 pt-6">
            {(product.variants || []).length === 0 ? (
              <p className="body-text">No pricing available.</p>
            ) : (
              product.variants.map((variant) => {
                const inStock = variant.stockQuantity > 0
                return (
                  <div key={variant.id} className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-2xl font-semibold text-primary">
                        {currencyFormatter.format(variant.price)}
                      </span>
                      <span className={`block text-sm ${inStock ? 'text-dark/60' : 'text-danger'}`}>
                        {inStock ? `${variant.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    {inStock && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={variant.stockQuantity}
                          value={quantityFor(variant)}
                          onChange={(event) => handleQuantityChange(variant, event.target.value)}
                          className="w-16 px-3 py-2 rounded-full border border-dark/10 bg-white text-sm text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                        <Button onClick={() => handleAddToCart(variant)}>Add to cart</Button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="subtitle-primary text-lg text-dark font-semibold mb-2">Description</h2>
              <p className="body-text whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default ProductDetail
