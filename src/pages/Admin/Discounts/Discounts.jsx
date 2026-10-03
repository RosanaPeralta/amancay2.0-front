import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import EditButton from '../../../components/admin/EditButton'
import { rowClass, tableWrapClass, tdClass, thClass } from '../../../components/admin/styles'
import { fetchDiscounts } from '../../../store/slices/discountsSlice'
import { fetchAdminProducts } from '../../../store/slices/adminProductsSlice'
import DiscountForm from './DiscountForm'

function Discounts() {
  const dispatch = useDispatch()
  const { items: discounts, status, error } = useSelector((state) => state.discounts)
  const products = useSelector((state) => state.adminProducts.items)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    dispatch(fetchDiscounts())
    dispatch(fetchAdminProducts())
  }, [dispatch])

  const countFor = (id) => products.filter((product) => product.discount?.id === id).length
  const selected = discounts.find((discount) => discount.id === editing) ?? null

  return (
    <>
      <AdminPageHeader
        title="Descuentos"
        subtitle="Asigna un descuento a un producto desde su formulario de edición."
        actions={<Button onClick={() => setEditing('new')}>+ Nuevo descuento</Button>}
      />

      {status === 'idle' || status === 'loading' ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar los descuentos: {error}</Notice>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
          {discounts.length === 0 ? (
            <Notice>Todavía no hay descuentos.</Notice>
          ) : (
            <div className={tableWrapClass}>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={thClass}>ID</th>
                    <th className={thClass}>Nombre</th>
                    <th className={thClass}>Descuento</th>
                    <th className={thClass}>Usado en</th>
                    <th className={`${thClass} text-right`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((discount) => {
                    const count = countFor(discount.id)
                    return (
                      <tr key={discount.id} className={rowClass(editing === discount.id)}>
                        <td className={`${tdClass} text-dark/60`}>#{discount.id}</td>
                        <td className={`${tdClass} font-bold text-dark`}>{discount.description}</td>
                        <td className={tdClass}>
                          <span className="rounded-full bg-info/50 px-2.5 py-0.5 text-xs font-bold text-dark">
                            {Number(discount.percentage)}% de descuento
                          </span>
                        </td>
                        <td className={`${tdClass} ${count === 0 ? 'text-dark/40' : 'text-dark/80'}`}>
                          {count} {count === 1 ? 'producto' : 'productos'}
                        </td>
                        <td className={`${tdClass} text-right`}>
                          <EditButton onClick={() => setEditing(discount.id)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {editing ? (
            <DiscountForm
              key={editing}
              discount={selected}
              productCount={selected ? countFor(selected.id) : 0}
              onDone={(id) => setEditing(id)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-dark/15 p-6 text-center text-sm text-dark/50">
              Elige un descuento para editarlo o crea uno nuevo.
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Discounts
