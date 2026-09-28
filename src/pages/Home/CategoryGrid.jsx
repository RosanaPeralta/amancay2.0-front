import { Link } from 'react-router-dom'

function ArrowIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CategoryTile({ category, imageUrl }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group relative flex h-32 overflow-hidden rounded-2xl bg-mist p-4 text-left transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <div className="relative z-10 flex flex-col justify-between">
        <span className="max-w-[8rem] font-bold leading-tight text-dark group-hover:text-primary">{category.name}</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-dark/60 group-hover:text-primary">
          Ver <ArrowIcon />
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-center p-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="max-h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 20 6.5-11 4 6.5 2.5-4L21 20z" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  )
}

// 7 tiles + "Shop all gear" fills two rows of four; the rest are one click away in Shop all.
const CATEGORY_TILE_LIMIT = 7

function CategoryGrid({ categories, products }) {
  // Use a loaded product photo for each category when we have one; otherwise fall back to an icon.
  const imageFor = (categoryId) =>
    products.find((product) => product.categoryIds?.includes(categoryId) && product.images?.length)?.images[0].imageUrl

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.slice(0, CATEGORY_TILE_LIMIT).map((category) => (
        <CategoryTile key={category.id} category={category} imageUrl={imageFor(category.id)} />
      ))}
      <Link
        to="/products"
        className="group flex h-32 flex-col justify-between rounded-2xl bg-primary p-4 text-left text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <span className="font-bold">Ver todo el equipo</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-info text-dark transition-transform group-hover:translate-x-1">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </Link>
    </div>
  )
}

export default CategoryGrid
