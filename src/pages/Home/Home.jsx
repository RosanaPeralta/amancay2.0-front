import { useEffect } from 'react'
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
import SectionHeader from './SectionHeader'
import ForYouSection from './ForYouSection'
import { useRecommendations } from '../../components/Recommendations/useRecommendations'

const GRID_CLASS = 'sm:grid-cols-2 lg:grid-cols-4 gap-5'

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

  const recommendations = useRecommendations()
  // For a logged-in user the hero spotlights their top suggestion instead of a generic product.
  const topRecommendation = recommendations.status === 'succeeded' ? recommendations.items[0] : undefined

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
        <HomeHero
          featuredProduct={topRecommendation ?? products[0]}
          featuredLabel={topRecommendation ? 'Para vos' : 'Destacado'}
        />

        {recommendations.enabled && <ForYouSection recommendations={recommendations} />}

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
