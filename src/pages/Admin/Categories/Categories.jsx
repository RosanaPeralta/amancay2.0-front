import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import EditButton from '../../../components/admin/EditButton'
import { rowClass, tableWrapClass, tdClass, thClass } from '../../../components/admin/styles'
import { fetchCategories } from '../../../store/slices/categoriesSlice'
import { fetchAdminProducts } from '../../../store/slices/adminProductsSlice'
import CategoryForm from './CategoryForm'

function Categories() {
  const dispatch = useDispatch()
  const { items: categories, status, error } = useSelector((state) => state.categories)
  const products = useSelector((state) => state.adminProducts.items)
  // null = panel closed, 'new' = creating, otherwise the id being edited
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchAdminProducts())
  }, [dispatch])

  const countFor = (id) => products.filter((product) => product.categoryIds?.includes(id)).length
  const selected = categories.find((category) => category.id === editing) ?? null

  return (
    <>
      <AdminPageHeader
        title="Categorías"
        subtitle={`${categories.length} categorías`}
        actions={<Button onClick={() => setEditing('new')}>+ Nueva categoría</Button>}
      />

      {status === 'idle' || status === 'loading' ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar las categorías: {error}</Notice>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className={tableWrapClass}>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={thClass}>Nombre</th>
                  <th className={`${thClass} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  return (
                    <tr key={category.id} className={rowClass(editing === category.id)}>
                      <td className={`${tdClass} font-bold text-dark`}>{category.name}</td>
                      <td className={`${tdClass} text-right`}>
                        <EditButton onClick={() => setEditing(category.id)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {editing ? (
            <CategoryForm
              key={editing}
              category={selected}
              productCount={selected ? countFor(selected.id) : 0}
              otherNames={categories.filter((category) => category.id !== selected?.id).map((category) => category.name)}
              onDone={(id) => setEditing(id)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-dark/15 p-6 text-center text-sm text-dark/50">
              Elige una categoría para editarla o crea una nueva.
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Categories
