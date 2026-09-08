import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Notice from '../../components/ui/Notice'
import Button from '../../components/ui/Button'
import ProductCard from '../../components/ProductCard/ProductCard'
import { ProductGridSkeleton } from '../../components/ProductCard/ProductCardSkeleton'
import { fetchProductsList } from '../../store/slices/productsSlice'

function Products() {
  const dispatch = useDispatch()
  const {
    items: products,
    page,
    totalPages,
    status,
    error,
  } = useSelector((state) => state.products.list)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => clearTimeout(handle)
  }, [search])

  if (debouncedSearch !== prevDebouncedSearch) {
    setPrevDebouncedSearch(debouncedSearch)
    setPageNumber(0)
  }

  useEffect(() => {
    dispatch(fetchProductsList({ page: pageNumber, size: 12, q: debouncedSearch || undefined }))
  }, [dispatch, pageNumber, debouncedSearch])

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <Container as="div" className="py-12">
      <SectionHeading>Products</SectionHeading>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2.5 rounded-full border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <Notice variant="error">Couldn't load products: {error}</Notice>
      ) : products.length === 0 ? (
        <Notice>{debouncedSearch ? `No products match "${debouncedSearch}".` : 'No products yet.'}</Notice>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              onClick={() => setPageNumber((n) => Math.max(0, n - 1))}
              disabled={pageNumber === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-dark/70">
              Page {page + 1} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPageNumber((n) => n + 1)}
              disabled={pageNumber + 1 >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  )
}

export default Products
