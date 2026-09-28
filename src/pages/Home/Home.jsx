import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import Notice from '../../components/ui/Notice'
import TopLoadingBar from '../../components/ui/TopLoadingBar'
import ProductCard from '../../components/ProductCard/ProductCard'
import { ProductGridSkeleton } from '../../components/ProductCard/ProductCardSkeleton'
import { fetchFeaturedProducts } from '../../store/slices/productsSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import HomeHero from './HomeHero'
import CategoryGrid from './CategoryGrid'
import BrandBanner from './BrandBanner'

const GRID_CLASS = 'sm:grid-cols-2 lg:grid-cols-4 gap-5'

function SectionHeader({ title, subtitle, linkLabel }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 text-left">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-dark/60">{subtitle}</p>}
      </div>
      <Link to="/products" className="flex shrink-0 items-center gap-1 text-sm font-bold text-dark hover:text-primary">
        {linkLabel}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  )
}

function Home() {
  const dispatch = useDispatch()

  const {
    items: products,
    status: productsStatus,
    error: productsError,
  } = useSelector((state) => state.products.featured)

  const {
    items: categories,
    status: categoriesStatus,
    error: categoriesError,
  } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const isLoadingProducts = productsStatus === 'idle' || productsStatus === 'loading'
  const isLoadingCategories = categoriesStatus === 'idle' || categoriesStatus === 'loading'

  return (
    <div>
      <TopLoadingBar active={isLoadingProducts || isLoadingCategories} />

      <Container>
        <HomeHero featuredProduct={products[0]} />

        <section id="categories" className="scroll-mt-24 py-12">
          <SectionHeader title="Compra por categoría" linkLabel="Todos los productos" />
          {isLoadingCategories ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-mist animate-pulse" />
              ))}
            </div>
          ) : categoriesError ? (
            <Notice variant="error">No se pudieron cargar las categorías: {categoriesError}</Notice>
          ) : (
            <CategoryGrid categories={categories} products={products} />
          )}
        </section>

        <section className="py-12">
          <SectionHeader title="Productos destacados" subtitle="Algunos favoritos de toda la tienda." linkLabel="Ver todo" />
          {isLoadingProducts ? (
            <ProductGridSkeleton count={8} className={GRID_CLASS} />
          ) : productsError ? (
            <Notice variant="error">No se pudieron cargar los productos: {productsError}</Notice>
          ) : products.length === 0 ? (
            <Notice>Todavía no hay productos.</Notice>
          ) : (
            <div className={`grid grid-cols-1 ${GRID_CLASS} animate-fade-in-up`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <div className="pt-6 pb-16">
          <BrandBanner />
        </div>
      </Container>
    </div>
  )
}

export default Home
