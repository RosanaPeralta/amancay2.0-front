import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import heroImage from '../../assets/gallery/gallery1.png'
import sideImage from '../../assets/gallery/gallery4.png'

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function FeaturedProductCard({ product }) {
  if (!product) return <div className="rounded-2xl bg-mist animate-pulse" />

  const image = product.images?.[0]
  const price = product.variants?.[0]?.price
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-dark/5 bg-mist p-4 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <div className="flex flex-1 items-center justify-center">
        {image && (
          <img
            src={image.imageUrl}
            alt=""
            className="max-h-28 w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 text-left">
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-secondary">Destacado</p>
        <p className="font-bold leading-snug text-dark group-hover:text-primary">{product.name}</p>
        {price !== undefined && <p className="mt-1 text-sm font-bold text-primary">{currencyFormatter.format(price)}</p>}
      </div>
    </Link>
  )
}

function HomeHero({ featuredProduct }) {
  return (
    <section className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
      <div className="text-left animate-fade-in-up">
        <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-info" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1.2 3 1.2 5.5 0 8 2.6-1.4 5.1-1.6 7.6-.7-2.2 2-4.6 3-7.2 3 2.3 1.8 3.6 4 4 6.7-2.6-1.2-4.4-3-4.4-5.8 0 2.8-1.8 4.6-4.4 5.8.4-2.7 1.7-4.9 4-6.7-2.6 0-5-1-7.2-3 2.5-.9 5-.7 7.6.7-1.2-2.5-1.2-5 0-8z" />
          </svg>
          Inspirado en una flor andina
        </p>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Tu equipo que te acompaña a tus aventuras en las montañas
        </h1>
        <p className="mt-6 max-w-md text-dark/70">
          Amancay es una radiante flor andina, símbolo de belleza, resiliencia y devoción. Encuentra todo lo que
          necesitas para seguir la montaña arriba.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/products">Ver productos</Button>
          <Button href="#categories" variant="outline">
            Explorar categorías
          </Button>
        </div>
      </div>

      <div className="grid h-[420px] grid-cols-[1.4fr_1fr] gap-4 sm:h-[480px]">
        <div className="overflow-hidden rounded-3xl">
          <img src={heroImage} alt="Excursionista celebrando frente a una montaña" className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-rows-[1fr_1.2fr] gap-4 min-h-0">
          <div className="overflow-hidden rounded-3xl">
            <img src={sideImage} alt="Excursionista con bastones de trekking" className="h-full w-full object-cover" />
          </div>
          <FeaturedProductCard product={featuredProduct} />
        </div>
      </div>
    </section>
  )
}

export default HomeHero
