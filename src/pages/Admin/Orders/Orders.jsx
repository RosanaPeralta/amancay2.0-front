import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import FilterChips from '../../../components/admin/FilterChips'
import SearchField from '../../../components/admin/SearchField'
import { rowClass, tableWrapClass, tdClass, thClass } from '../../../components/admin/styles'
import { fetchAdminOrders } from '../../../store/slices/adminOrdersSlice'
import OrderStatusPill from './OrderStatusPill'
import OrderDetail from './OrderDetail'
import { ORDER_STATUSES, itemCount, shortId, statusLabel } from './orderStatus'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatDate = (date) => new Date(date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })

function Orders() {
  const dispatch = useDispatch()
  const { items: orders, status, error } = useSelector((state) => state.adminOrders)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminOrders())
  }, [dispatch])

  const query = search.trim().toLowerCase().replace('#', '')
  const visible = orders.filter(
    (order) =>
      (filter === 'ALL' || order.status === filter) &&
      (!query || order.id.toLowerCase().includes(query) || order.buyerEmail?.toLowerCase().includes(query)),
  )
  const selected = orders.find((order) => order.id === selectedId) ?? visible[0]
  const toShip = orders.filter((order) => order.status === 'EN_PREPARACION').length

  const isLoading = status === 'idle' || (status === 'loading' && orders.length === 0)

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos · ${toShip} para despachar`}
        actions={<SearchField value={search} onChange={setSearch} placeholder="Número de pedido o correo" />}
      />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar los pedidos: {error}</Notice>
      ) : orders.length === 0 ? (
        <Notice>Todavía no hay pedidos.</Notice>
      ) : (
        <>
          <div className="mb-4">
            <FilterChips
              label="Filtrar por estado"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'ALL', label: 'Todos', count: orders.length },
                ...ORDER_STATUSES.map((value) => ({
                  value,
                  label: statusLabel(value),
                  count: orders.filter((order) => order.status === value).length,
                })),
              ]}
            />
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
            {visible.length === 0 ? (
              <Notice>Ningún pedido coincide con estos filtros.</Notice>
            ) : (
              <div className={tableWrapClass}>
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr>
                      <th className={thClass}>Pedido</th>
                      <th className={thClass}>Fecha</th>
                      <th className={thClass}>Cliente</th>
                      <th className={thClass}>Artículos</th>
                      <th className={thClass}>Total</th>
                      <th className={thClass}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((order) => (
                      <tr
                        key={order.id}
                        className={`${rowClass(order.id === selected?.id)} cursor-pointer`}
                        onClick={() => setSelectedId(order.id)}
                      >
                        <td className={tdClass}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(order.id)}
                            className="font-bold text-dark hover:text-primary focus-visible:outline-none focus-visible:underline"
                          >
                            #{shortId(order.id)}
                          </button>
                        </td>
                        <td className={`${tdClass} text-dark/70`}>{formatDate(order.createdAt)}</td>
                        <td className={`${tdClass} text-dark/80`}>{order.buyerEmail || '—'}</td>
                        <td className={`${tdClass} text-dark/80`}>{itemCount(order)}</td>
                        <td className={`${tdClass} font-bold text-dark`}>{currency.format(order.total)}</td>
                        <td className={tdClass}>
                          <OrderStatusPill status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selected && <OrderDetail key={`${selected.id}-${selected.status}`} order={selected} />}
          </div>
        </>
      )}
    </>
  )
}

export default Orders
