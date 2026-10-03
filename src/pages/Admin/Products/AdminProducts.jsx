import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import FilterChips from '../../../components/admin/FilterChips'
import SearchField from '../../../components/admin/SearchField'
import StatusPill from '../../../components/admin/StatusPill'
import EditButton from '../../../components/admin/EditButton'
import { rowClass, tableWrapClass, tdClass, thClass } from '../../../components/admin/styles'
import { fetchAdminProducts } from '../../../store/slices/adminProductsSlice'
import { fetchCategories } from '../../../store/slices/categoriesSlice'

const LOW_STOCK = 20
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function ProductRow({ product, categoryName }) {
  const variant = product.variants?.[0]
  const stock = product.variants?.reduce((sum, item) => sum + item.stockQuantity, 0) ?? 0
  const image = product.images?.[0]

  return (
    <tr className={rowClass(false)}>
      <td className={tdClass}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist">
            {image && <img src={image.imageUrl} alt="" className="h-full w-full object-contain mix-blend-multiply" />}
          </span>
          <div className="min-w-0 max-w-[22rem]">
            <p className="truncate font-bold text-dark">{product.name}</p>
            <p className="truncate text-xs text-dark/60">{product.shortDescription}</p>
          </div>
        </div>
      </td>
      <td className={`${tdClass} text-dark/80`}>{categoryName ?? <span className="text-dark/40">—</span>}</td>
      <td className={`${tdClass} font-bold text-dark`}>{variant ? currency.format(variant.price) : '—'}</td>
      <td className={tdClass}>
        {stock <= LOW_STOCK ? <span className="font-bold text-secondary">{stock} · bajo</span> : stock}
      </td>
      <td className={tdClass}>
        {product.active ? <StatusPill tone="green">Activo</StatusPill> : <StatusPill>Borrador</StatusPill>}
      </td>
      <td className={`${tdClass} text-right`}>
        <EditButton to={`/admin/products/${product.id}`} />
      </td>
    </tr>
  )
}

function AdminProducts() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.adminProducts)
  const categories = useSelector((state) => state.categories.items)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchAdminProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const activeCount = items.filter((product) => product.active).length
  const query = search.trim().toLowerCase()
  const visible = items.filter(
    (product) =>
      (filter === 'all' || (filter === 'active') === product.active) &&
      (!query || product.name.toLowerCase().includes(query)),
  )
  const categoryName = (product) => categories.find((category) => product.categoryIds?.includes(category.id))?.name

  return (
    <>
      <AdminPageHeader
        title="Productos"
        subtitle={`${items.length} productos · ${categories.length} categorías`}
        actions={
          <Button to="/admin/products/new">
            <span aria-hidden="true">+</span> Nuevo producto
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips
          label="Filtrar por estado"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Todos', count: items.length },
            { value: 'active', label: 'Activos', count: activeCount },
            { value: 'draft', label: 'Borradores', count: items.length - activeCount },
          ]}
        />
        <SearchField value={search} onChange={setSearch} placeholder="Buscar por nombre" />
      </div>

      {status === 'idle' || status === 'loading' ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar los productos: {error}</Notice>
      ) : visible.length === 0 ? (
        <Notice>{query ? `Ningún producto coincide con "${search.trim()}".` : 'Todavía no hay productos.'}</Notice>
      ) : (
        <div className={tableWrapClass}>
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr>
                <th className={thClass}>Producto</th>
                <th className={thClass}>Categoría</th>
                <th className={thClass}>Precio</th>
                <th className={thClass}>Stock</th>
                <th className={thClass}>Estado</th>
                <th className={`${thClass} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <ProductRow key={product.id} product={product} categoryName={categoryName(product)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminProducts
