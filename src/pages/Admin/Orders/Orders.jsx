import { useState } from 'react'
import Notice from '../../../components/ui/Notice'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import FilterChips from '../../../components/admin/FilterChips'
import SearchField from '../../../components/admin/SearchField'
import { rowClass, tableWrapClass, tdClass, thClass } from '../../../components/admin/styles'
import OrderStatusPill from './OrderStatusPill'
import OrderDetail from './OrderDetail'
import { ORDER_STATUSES, orderTotal, sampleOrders, statusLabel } from './sampleOrders'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })

function PreviewBanner() {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-info bg-info/25 px-4 py-3 text-left text-sm text-dark">
      <span className="mt-0.5 rounded-full bg-info px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider">Vista previa</span>
      <p>
        Un compañero está desarrollando los pedidos. Esta pantalla muestra <strong>datos de ejemplo</strong> y los cambios de
        estado todavía no se guardan.
      </p>
    </div>
  )
}

function Orders() {
  // Local copy so "Update" visibly works in the preview.
  const [orders, setOrders] = useState(sampleOrders)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(orders[0].id)

  const query = search.trim().toLowerCase().replace('#', '')
  const visible = orders.filter(
    (order) =>
      (filter === 'ALL' || order.status === filter) &&
      (!query || String(order.id).includes(query) || order.email.toLowerCase().includes(query)),
  )
  const selected = orders.find((order) => order.id === selectedId)
  const waiting = orders.filter((order) => order.status === 'PAID' || order.status === 'PENDING').length

  function handleStatusChange(id, status) {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos recientes · ${waiting} pendientes de envío`}
        actions={<SearchField value={search} onChange={setSearch} placeholder="Número de pedido o correo" />}
      />
      <PreviewBanner />

      <div className="mb-4">
        <FilterChips
          label="Filtrar por estado"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'ALL', label: 'Todos', count: orders.length },
            ...ORDER_STATUSES.map((status) => ({
              value: status,
              label: statusLabel(status),
              count: orders.filter((order) => order.status === status).length,
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
                    className={`${rowClass(order.id === selectedId)} cursor-pointer`}
                    onClick={() => setSelectedId(order.id)}
                  >
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(order.id)}
                        className="font-bold text-dark hover:text-primary focus-visible:outline-none focus-visible:underline"
                      >
                        #{order.id}
                      </button>
                    </td>
                    <td className={`${tdClass} text-dark/70`}>{formatDate(order.date)}</td>
                    <td className={`${tdClass} text-dark/80`}>{order.email}</td>
                    <td className={`${tdClass} text-dark/80`}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className={`${tdClass} font-bold text-dark`}>{currency.format(orderTotal(order))}</td>
                    <td className={tdClass}>
                      <OrderStatusPill status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && <OrderDetail key={`${selected.id}-${selected.status}`} order={selected} onStatusChange={handleStatusChange} />}
      </div>
    </>
  )
}

export default Orders
