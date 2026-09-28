import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import Container from '../../components/ui/Container'
import Notice from '../../components/ui/Notice'
import Pagination from '../../components/ui/Pagination'
import ProductCard from '../../components/ProductCard/ProductCard'
import SearchInput from '../../components/ProductFilters/SearchInput'
import FilterSelect from '../../components/ProductFilters/FilterSelect'
import { DEFAULT_SORT, SORT_OPTIONS } from '../../components/ProductFilters/sortOptions'
import { ProductGridSkeleton } from '../../components/ProductCard/ProductCardSkeleton'
import { fetchProductsList } from '../../store/slices/productsSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'

const PAGE_SIZE = 12
const GRID_CLASS = 'sm:grid-cols-2 lg:grid-cols-4 gap-5'

function emptyMessage(name, categoryName) {
  if (name && categoryName) return `No hay productos en ${categoryName} que coincidan con "${name}".`
  if (name) return `No hay productos que coincidan con "${name}".`
  if (categoryName) return `Todavía no hay productos en ${categoryName}.`
  return 'Todavía no hay productos.'
}

function Breadcrumb() {
  return (
    <nav aria-label="Ruta de navegación" className="mb-3 text-xs text-dark/50">
      <Link to="/" className="hover:text-primary">
        Inicio
      </Link>
      <span className="mx-1.5">/</span>
      <span className="font-semibold text-dark">Productos</span>
    </nav>
  )
}

function Products() {
  const dispatch = useDispatch()
  const {
    items: products,
    page,
    totalPages,
    totalElements,
    status,
    error,
  } = useSelector((state) => state.products.list)
  const categories = useSelector((state) => state.categories.items)

  // Filters live in the URL so results are shareable and survive back/forward.
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name') ?? ''
  const categoryId = searchParams.get('category')
  const sort = searchParams.get('sort') ?? DEFAULT_SORT
  const pageNumber = Math.max(0, Number(searchParams.get('page')) || 0)
  const categoryName = categories.find((category) => category.id === categoryId)?.name
  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ]

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params)
          Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
          if (!('page' in changes)) next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const handleNameChange = useCallback((value) => updateParams({ name: value }), [updateParams])
  const handleCategoryChange = (value) => updateParams({ category: value || null })
  const handleSortChange = (value) => updateParams({ sort: value === DEFAULT_SORT ? null : value })
  const handlePageChange = (value) => {
    updateParams({ page: value > 0 ? String(value) : null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(
      fetchProductsList({
        page: pageNumber,
        size: PAGE_SIZE,
        name: name || undefined,
        categoryId: categoryId || undefined,
        sort: sort === DEFAULT_SORT ? undefined : sort,
      }),
    )
  }, [dispatch, pageNumber, name, categoryId, sort])

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <Container as="div" className="py-10 text-left">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-2">Productos</h1>
          <p className="text-sm text-dark/70 max-w-md">
            Todo lo que necesitas para tu próxima aventura al aire libre, del campamento a la cumbre.
          </p>
        </div>
        <SearchInput name={name} onNameChange={handleNameChange} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-dark/10">
        <FilterSelect
          label="Categoría"
          value={categoryId ?? ''}
          options={categoryOptions}
          onChange={handleCategoryChange}
        />
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-sm text-dark/60 whitespace-nowrap">
            {status === 'succeeded' && `${totalElements} ${totalElements === 1 ? 'producto' : 'productos'}`}
          </span>
          <FilterSelect label="Ordenar por" value={sort} options={SORT_OPTIONS} onChange={handleSortChange} />
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={PAGE_SIZE} className={GRID_CLASS} />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar los productos: {error}</Notice>
      ) : products.length === 0 ? (
        <Notice>{emptyMessage(name, categoryName)}</Notice>
      ) : (
        <>
          <div className={`grid grid-cols-1 ${GRID_CLASS} animate-fade-in-up`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </Container>
  )
}

export default Products
