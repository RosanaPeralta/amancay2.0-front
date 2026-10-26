import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Pagination from '../../../components/ui/Pagination'
import ProductCard from '../../../components/ProductCard/ProductCard'
import { ProductGridSkeleton } from '../../../components/ProductCard/ProductCardSkeleton'
import { fetchFavoritesPage } from '../../../store/slices/favoritesSlice'
import { fetchCategories } from '../../../store/slices/categoriesSlice'

const PAGE_SIZE = 12

const GRID_CLASS = 'sm:grid-cols-2 xl:grid-cols-3 gap-5'

function FavoriteCard({ favorite }) {
  const product = favorite.product ?? { id: favorite.productId, name: favorite.name }

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex-1 ${favorite.active ? '' : 'opacity-60'}`}>
        <ProductCard product={product} />
      </div>
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="caption-text text-left">
          Guardado el {new Date(favorite.createdAt).toLocaleDateString('es-AR')}
        </span>
        {!favorite.active && (
          <span className="rounded-full border border-dark/10 px-2 py-0.5 text-xs text-dark/60">No disponible</span>
        )}
      </div>
    </div>
  )
}

function Favorites() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status, error } = useSelector((state) => state.favorites.list)
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchFavoritesPage({ page: pageNumber, size: PAGE_SIZE }))
  }, [dispatch, pageNumber])

  const isLoading = status === 'idle' || status === 'loading'

  if (isLoading) return <ProductGridSkeleton count={6} className={GRID_CLASS} />
  if (error) return <Notice variant="error">No se pudieron cargar tus favoritos: {error}</Notice>
  if (items.length === 0) {
    return (
      <Notice>
        <p>Todavía no guardaste ningún favorito.</p>
        <Button to="/products" className="mt-4">
          Explorar productos
        </Button>
      </Notice>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-1 ${GRID_CLASS} animate-fade-in-up`}>
        {items.map((favorite) => (
          <FavoriteCard key={favorite.productId} favorite={favorite} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPageNumber} />
    </>
  )
}

export default Favorites
