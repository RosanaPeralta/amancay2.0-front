import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import StatusBadge from '../../../components/ui/StatusBadge'
import { fetchOrders } from '../../../store/slices/ordersSlice'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

function Orders() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.orders.list)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const isLoading = status === 'idle' || status === 'loading'

  if (isLoading) return <Loading />
  if (error) return <Notice variant="error">Couldn't load your orders: {error}</Notice>
  if (items.length === 0) return <Notice>You haven't placed any orders yet.</Notice>

  return (
    <ul className="space-y-4">
      {items.map((order) => (
        <li key={order.id}>
          <Link
            to={`/account/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dark/10 bg-white p-5 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <div>
              <p className="font-medium text-dark">Order #{order.id.slice(0, 8)}</p>
              <p className="caption-text">{dateFormatter.format(new Date(order.createdAt))}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-dark">{currencyFormatter.format(order.total)}</span>
              <StatusBadge status={order.status} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Orders
