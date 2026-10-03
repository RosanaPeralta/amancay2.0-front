import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Notice from '../ui/Notice'
import Stars from '../ui/Stars'
import Loading from '../Loading/Loading'
import ReviewForm from './ReviewForm'
import { createReview, getRatingSummary, listProductReviews } from '../../services/productReviewsService'
import { selectIsAuthenticated } from '../../store/slices/authSlice'

const PAGE_SIZE = 10

// The API answers these in English, so the ones a buyer can hit get a Spanish message here.
function createErrorMessage(err) {
  if (err.status === 409) return 'Ya dejaste una reseña para este producto. Podés editarla desde Mis reseñas.'
  if (err.status === 403) return 'Solo podés reseñar productos que compraste.'
  return err.message
}

function ProductReviews({ productId }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const userId = useSelector((state) => state.auth.profile?.id)

  const [page, setPage] = useState(0)
  const [reloadCount, setReloadCount] = useState(0)
  // Loading = the last result belongs to an older request.
  const requestKey = `${page}:${reloadCount}`
  const [result, setResult] = useState({ key: null, reviews: [], totalPages: 1, summary: null, error: null })
  const [writing, setWriting] = useState(false)
  const [justPosted, setJustPosted] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([listProductReviews(productId, { page, size: PAGE_SIZE }), getRatingSummary(productId)])
      .then(([data, summary]) => {
        if (cancelled) return
        setResult({ key: requestKey, reviews: data.content, totalPages: data.totalPages || 1, summary, error: null })
      })
      .catch((err) => {
        if (!cancelled) setResult((prev) => ({ ...prev, key: requestKey, error: err.message }))
      })
    return () => {
      cancelled = true
    }
  }, [productId, page, requestKey])

  async function handleCreate(data) {
    try {
      await createReview(productId, data)
    } catch (err) {
      throw Object.assign(new Error(createErrorMessage(err)), { fields: err.fields })
    }
    setWriting(false)
    setJustPosted(true)
    setPage(0)
    setReloadCount((n) => n + 1)
  }

  const { reviews, totalPages, summary, error } = result
  const isLoading = result.key !== requestKey
  const alreadyReviewed = justPosted || reviews.some((review) => review.userId === userId)

  return (
    <section className="mt-16 border-t border-dark/10 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="title text-2xl">Reseñas</h2>
          {summary?.total > 0 && (
            <p className="flex items-center gap-2 mt-1 text-sm text-dark/70">
              <Stars rating={Math.round(summary.average)} />
              {summary.average.toFixed(1)} · {summary.total} {summary.total === 1 ? 'reseña' : 'reseñas'}
            </p>
          )}
        </div>
        {isAuthenticated && !alreadyReviewed && !writing && (
          <Button variant="outline" onClick={() => setWriting(true)}>
            Escribir una reseña
          </Button>
        )}
      </div>

      {!isAuthenticated && (
        <p className="body-text text-sm mb-6">
          <Link to="/login" className="text-primary hover-primary-light">
            Iniciá sesión
          </Link>{' '}
          para dejar una reseña.
        </p>
      )}

      {justPosted && <p className="mb-6 text-sm font-medium text-primary">¡Gracias! Tu reseña ya está publicada.</p>}

      {writing && (
        <div className="mb-8 rounded-lg border border-dark/10 bg-white p-5">
          <ReviewForm onSubmit={handleCreate} onCancel={() => setWriting(false)} submitLabel="Publicar reseña" className="" />
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">No se pudieron cargar las reseñas: {error}</Notice>
      ) : reviews.length === 0 ? (
        <p className="body-text text-sm">Todavía no hay reseñas para este producto.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-dark/10 bg-white p-5">
              <Stars rating={review.rating} />
              {review.title && <p className="mt-1 font-medium text-dark">{review.title}</p>}
              {review.comment && <p className="body-text text-sm whitespace-pre-line">{review.comment}</p>}
              <p className="caption-text mt-2">
                {review.authorName || 'Cliente'} · {new Date(review.createdAt).toLocaleDateString('es-AR')}
              </p>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" onClick={() => setPage((n) => Math.max(0, n - 1))} disabled={page === 0}>
            Anterior
          </Button>
          <span className="text-sm text-dark/70">
            Página {page + 1} de {totalPages}
          </span>
          <Button variant="outline" onClick={() => setPage((n) => n + 1)} disabled={page + 1 >= totalPages}>
            Siguiente
          </Button>
        </div>
      )}
    </section>
  )
}

export default ProductReviews
