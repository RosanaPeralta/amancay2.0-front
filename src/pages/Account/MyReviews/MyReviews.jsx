import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Stars from '../../../components/ui/Stars'
import StatusBadge from '../../../components/ui/StatusBadge'
import Loading from '../../../components/Loading/Loading'
import ReviewForm from './ReviewForm'
import { deleteMyReview, fetchMyReviews, updateMyReview } from '../../../store/slices/myReviewsSlice'

function MyReviews() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status, error } = useSelector((state) => state.myReviews)

  const [pageNumber, setPageNumber] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    dispatch(fetchMyReviews({ page: pageNumber, size: 10 }))
  }, [dispatch, pageNumber])

  async function handleUpdate(id, data) {
    await dispatch(updateMyReview({ id, data })).unwrap()
    setEditingId(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return
    setActionError(null)
    try {
      await dispatch(deleteMyReview(id)).unwrap()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const isLoading = status === 'idle' || status === 'loading'

  if (isLoading) return <Loading />
  if (error) return <Notice variant="error">Couldn't load your reviews: {error}</Notice>
  if (items.length === 0) return <Notice>You haven't written any reviews yet.</Notice>

  return (
    <div className="space-y-4">
      {actionError && <Notice variant="error">{actionError}</Notice>}

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
                  {new Date(review.createdAt).toLocaleDateString('en-US')} ·{' '}
                  <Link to={`/products/${review.productId}`} className="text-primary hover-primary-light">
                    View product
                  </Link>
                </p>
              </div>
              {editingId !== review.id && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditingId(review.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" className="text-danger border-danger/30 hover:bg-danger/5" onClick={() => handleDelete(review.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
            {editingId === review.id && (
              <ReviewForm
                key={review.id}
                review={review}
                onSubmit={(data) => handleUpdate(review.id, data)}
                onCancel={() => setEditingId(null)}
              />
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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
    </div>
  )
}

export default MyReviews
