import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Notice from '../../components/ui/Notice'
import Button from '../../components/ui/Button'
import TopLoadingBar from '../../components/ui/TopLoadingBar'
import ProductCard from '../../components/ProductCard/ProductCard'
import { ProductGridSkeleton } from '../../components/ProductCard/ProductCardSkeleton'
import { fetchFeaturedProducts } from '../../store/slices/productsSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import gallery1 from '../../assets/gallery/gallery1.png'
import gallery2 from '../../assets/gallery/gallery2.png'
import gallery3 from '../../assets/gallery/gallery3.png'
import gallery4 from '../../assets/gallery/gallery4.png'

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

      <section className="relative h-[80vh] grid grid-cols-4">
        <div className="relative overflow-hidden">
          <img src={gallery1} alt="Fishing" className="w-full h-full object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <img src={gallery2} alt="Water bottle" className="w-full h-full object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <img src={gallery3} alt="Hiking" className="w-full h-full object-cover" />
        </div>
        <div className="relative overflow-hidden">
          <img src={gallery4} alt="Fly fishing" className="w-full h-full object-cover" />
        </div>

        <div className="absolute inset-0 bg-dark/40 backdrop-blur-[3px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6 text-center animate-fade-in-up">
            <h1 className="title text-6xl md:text-8xl mb-2 text-white">AMANCAY</h1>
            <p className="subtitle-secondary text-light max-w-xl">
              Amancay, a radiant Andean bloom, symbol of beauty, resilience, and devotion — a
              flower that thrives where the mountains meet the sky.
            </p>
            <Button className="bg-primary text-white mt-5" to="/products">
              Shop products
            </Button>
          </div>
        </div>
      </section>
      <Container as="section" className="py-12">
        <SectionHeading>Top products</SectionHeading>
        {isLoadingProducts ? (
          <ProductGridSkeleton />
        ) : productsError ? (
          <Notice variant="error">Couldn't load products: {productsError}</Notice>
        ) : products.length === 0 ? (
          <Notice>No products yet.</Notice>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in-up">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>

      <Container as="section" className="py-12">
        <SectionHeading>Categories</SectionHeading>
        {isLoadingCategories ? (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-9 w-28 rounded-full bg-dark/10 animate-pulse" />
            ))}
          </div>
        ) : categoriesError ? (
          <Notice variant="error">Couldn't load categories: {categoriesError}</Notice>
        ) : categories.length === 0 ? (
          <Notice>No categories yet.</Notice>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up">
            {categories.map((category) => (
              <span
                key={category.id}
                className="px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Home
