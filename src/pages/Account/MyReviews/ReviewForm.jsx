import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

function ReviewForm({ review, onSubmit, onCancel }) {
  const [rating, setRating] = useState(review.rating)
  const [title, setTitle] = useState(review.title ?? '')
  const [comment, setComment] = useState(review.comment ?? '')
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setSubmitting(true)
    try {
      await onSubmit({ rating, title: title.trim() || null, comment: comment.trim() || null })
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-dark/10 pt-4 mt-4">
      <div>
        <label className="block mb-1.5 text-sm font-medium text-dark">Calificación</label>
        <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
              onClick={() => setRating(value)}
              className={`text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded ${
                value <= rating ? 'text-info' : 'text-dark/20'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {fieldErrors.rating && <p className="mt-1.5 text-sm text-danger">{fieldErrors.rating}</p>}
      </div>
      <Input label="Título" maxLength={150} value={title} onChange={(event) => setTitle(event.target.value)} error={fieldErrors.title} />
      <div>
        <label className="block mb-1.5 text-sm font-medium text-dark">Comentario</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
        {fieldErrors.comment && <p className="mt-1.5 text-sm text-danger">{fieldErrors.comment}</p>}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ReviewForm
