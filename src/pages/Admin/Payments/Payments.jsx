import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import { decidePendingPayment, fetchPendingPayments } from '../../../store/slices/adminPaymentsSlice'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })

function Payments() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.adminPayments)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    dispatch(fetchPendingPayments())
  }, [dispatch])

  async function run(action) {
    setActionError(null)
    try {
      await dispatch(action).unwrap()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="space-y-6">
      {actionError && <Notice variant="error">{actionError}</Notice>}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">Couldn't load pending payments: {error}</Notice>
      ) : items.length === 0 ? (
        <Notice>No transfers waiting for confirmation.</Notice>
      ) : (
        <ul className="space-y-4">
          {items.map((payment) => (
            <li key={payment.paymentId} className="rounded-lg border border-dark/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-dark">{payment.buyerEmail || 'Unknown buyer'}</p>
                  <p className="caption-text">
                    Order #{payment.orderId.slice(0, 8)} · {dateFormatter.format(new Date(payment.createdAt))}
                  </p>
                  <p className="text-dark text-sm mt-1">
                    Reference: {payment.transferReference || '(not submitted yet)'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-semibold text-primary mb-2">
                    {currencyFormatter.format(payment.amount)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => run(decidePendingPayment({ paymentId: payment.paymentId, status: 'APROBADO' }))}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-danger border-danger/30 hover:bg-danger/5"
                      onClick={() =>
                        run(decidePendingPayment({ paymentId: payment.paymentId, status: 'RECHAZADO' }))
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Payments
