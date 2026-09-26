import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Stars from '../../../components/ui/Stars'
import StatusBadge from '../../../components/ui/StatusBadge'
import Loading from '../../../components/Loading/Loading'
import { changeReviewStatus, deleteAdminReview, fetchAdminReviews } from '../../../store/slices/adminReviewsSlice'

const STATUS_FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'HIDDEN', label: 'Hidden' },
]

function Reviews() {
  const dispatch = useDispatch()
  const { items, page, totalPages, totalElements, status, error } = useSelector((state) => state.adminReviews)

  const [statusFilter, setStatusFilter] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminReviews({ page: pageNumber, size: 20, status: statusFilter || undefined }))
  }, [dispatch, pageNumber, statusFilter])

  function handleFilterChange(event) {
    setStatusFilter(event.target.value)
    setPageNumber(0)
  }

  async function run(action) {
    setActionError(null)
    try {
      await dispatch(action).unwrap()
    } catch (err) {
      setActionError(err.message)
    }
  }

  function handleDelete(review) {
    if (window.confirm('Delete this review permanently?')) run(deleteAdminReview(review.id))
  }

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="space-y-6">
      <select
        value={statusFilter}
        onChange={handleFilterChange}
        aria-label="Filter by status"
        className="px-4 py-2.5 rounded-full border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        {STATUS_FILTERS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {actionError && <Notice variant="error">{actionError}</Notice>}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">Couldn't load reviews: {error}</Notice>
      ) : items.length === 0 ? (
        <Notice>No reviews found.</Notice>
      ) : (
        <>
          <p className="caption-text">{totalElements} reviews</p>
          <ul className="space-y-4">
            {items.map((review) => (
              <li key={review.id} className="rounded-lg border border-dark/10 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Stars rating={review.rating} />
                      <StatusBadge status={review.status} />
                    </div>
                    {review.title && <p className="font-medium text-dark">{review.title}</p>}
                    {review.comment && <p className="body-text text-sm whitespace-pre-line">{review.comment}</p>}
                    <p className="caption-text mt-2">
                      {review.authorName || 'Anonymous'} · {new Date(review.createdAt).toLocaleDateString('en-US')} ·{' '}
                      <Link to={`/products/${review.productId}`} className="text-primary hover-primary-light">
                        View product
                      </Link>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {review.status === 'PUBLISHED' ? (
                      <Button variant="outline" onClick={() => run(changeReviewStatus({ id: review.id, status: 'HIDDEN' }))}>
                        Hide
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => run(changeReviewStatus({ id: review.id, status: 'PUBLISHED' }))}>
                        Publish
                      </Button>
                    )}
                    <Button variant="outline" className="text-danger border-danger/30 hover:bg-danger/5" onClick={() => handleDelete(review)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => setPageNumber((n) => Math.max(0, n - 1))} disabled={pageNumber === 0}>
                Previous
              </Button>
              <span className="text-sm text-dark/70">
                Page {page + 1} of {totalPages || 1}
              </span>
              <Button variant="outline" onClick={() => setPageNumber((n) => n + 1)} disabled={pageNumber + 1 >= totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Reviews
