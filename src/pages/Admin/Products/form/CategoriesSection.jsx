import { Link } from 'react-router-dom'
import AdminCard from '../../../../components/admin/AdminCard'

function CategoriesSection({ values, setField, categories }) {
  const selected = values.categoryIds

  function toggle(id) {
    setField('categoryIds', selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id])
  }

  return (
    <AdminCard
      title="Categorías"
      action={
        <Link to="/admin/categories" className="text-xs font-bold text-dark hover:text-primary">
          Administrar
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = selected.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(category.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                active ? 'border-primary bg-primary text-white' : 'border-dark/15 bg-white text-dark hover:border-primary/40'
              }`}
            >
              {active && '✓ '}
              {category.name}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-dark/60">
        {selected.length} {selected.length === 1 ? 'categoría seleccionada' : 'categorías seleccionadas'}
      </p>
    </AdminCard>
  )
}

export default CategoriesSection
