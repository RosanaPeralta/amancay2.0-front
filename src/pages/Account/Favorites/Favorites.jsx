import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import { ProductGridSkeleton } from '../../../components/ProductCard/ProductCardSkeleton'
import { fetchFavoritesPage, toggleFavorite } from '../../../store/slices/favoritesSlice'

function Favorites() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status, error } = useSelector((state) => state.favorites.list)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    dispatch(fetchFavoritesPage({ page: pageNumber, size: 12 }))
  }, [dispatch, pageNumber])

  const isLoading = status === 'idle' || status === 'loading'

  if (isLoading) return <ProductGridSkeleton count={6} />
  if (error) return <Notice variant="error">Couldn't load your favorites: {error}</Notice>
  if (items.length === 0) return <Notice>You haven't saved any favorites yet.</Notice>

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((favorite) => (
          <div key={favorite.productId} className="flex flex-col gap-3 rounded-lg border border-dark/10 bg-white p-5">
            <Link
              to={`/products/${favorite.productId}`}
              className="font-medium text-dark hover-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              {favorite.name}
            </Link>
            {!favorite.active && (
              <span className="self-start px-2 py-0.5 rounded-full border border-dark/10 text-dark/60 text-xs">
                Unavailable
              </span>
            )}
            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="caption-text">Saved {new Date(favorite.createdAt).toLocaleDateString('en-US')}</span>
              <Button variant="outline" onClick={() => dispatch(toggleFavorite({ productId: favorite.productId, favorite: false }))}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button variant="outline" onClick={() => setPageNumber((n) => Math.max(0, n - 1))} disabled={pageNumber === 0}>
            Previous
          </Button>
          <span className="text-sm text-dark/70">
            Page {page + 1} of {totalPages || 1}
          </span>
          <Button variant="outline" onClick={() => setPageNumber((n) => n + 1)} disabled={pageNumber + 1 >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}

export default Favorites
