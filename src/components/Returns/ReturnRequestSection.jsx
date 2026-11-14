
import { useEffect, useState } from 'react'
import {
  createReturnRequest,
  getReturnRequest,
} from '../../services/returnsService'

const REASONS = [
  { value: 'EXPECTATION_NOT_MET', label: 'El producto no cumplió mis expectativas' },
  { value: 'WRONG_SIZE', label: 'El talle no es el correcto' },
  { value: 'DAMAGED', label: 'El producto llegó dañado' },
  { value: 'WRONG_PRODUCT', label: 'Recibí otro producto' },
  { value: 'OTHER', label: 'Otro motivo' },
]

const STATUS_LABELS = {
  PENDIENTE: 'Pendiente de revisión',
  APROBADA: 'Devolución aprobada',
  RECHAZADA: 'Devolución rechazada',
}

const STATUS_STYLES = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  APROBADA: 'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-800',
}

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function ReturnRequestSection({ order }) {
  const [returnRequest, setReturnRequest] = useState(null)
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadReturnRequest() {
      if (!['ENTREGADO', 'DEVUELTO'].includes(order.status)) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const result = await getReturnRequest(order.id)
        if (active) setReturnRequest(result)
      } catch (err) {
        if (active) setError(err.message || 'No se pudo consultar la devolución.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReturnRequest()

    return () => {
      active = false
    }
  }, [order.id, order.status])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!reason) {
      setError('Seleccioná un motivo para solicitar la devolución.')
      return
    }

    setSubmitting(true)

    try {
      const result = await createReturnRequest(order.id, {
        reason,
        comment: comment.trim() || null,
      })

      setReturnRequest(result)
    } catch (err) {
      setError(err.message || 'No se pudo crear la solicitud.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!['ENTREGADO', 'DEVUELTO'].includes(order.status)) return null

  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : null
  const deadline = deliveredAt
    ? new Date(deliveredAt.getTime() + 10 * 24 * 60 * 60 * 1000)
    : null

  const canRequest =
    deadline &&
    !Number.isNaN(deadline.getTime()) &&
    Date.now() <= deadline.getTime()

  const daysRemaining = deadline
    ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0

  return (
    <section className="rounded-xl border border-dark/10 bg-white p-5 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-dark">Devolución del pedido</h3>
        <p className="mt-1 text-sm text-dark/60">
          Podés solicitar la devolución completa dentro de los 10 días corridos
          posteriores a la entrega.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-dark/60">Consultando solicitud...</p>
      ) : returnRequest ? (
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              STATUS_STYLES[returnRequest.status] || 'bg-mist text-dark'
            }`}
          >
            {STATUS_LABELS[returnRequest.status] || returnRequest.status}
          </span>

          <p className="text-sm text-dark">
            <strong>Motivo:</strong>{' '}
            {REASONS.find((item) => item.value === returnRequest.reason)?.label ||
              returnRequest.reason}
          </p>

          {returnRequest.comment && (
            <p className="text-sm text-dark">
              <strong>Comentario:</strong> {returnRequest.comment}
            </p>
          )}

          <p className="text-xs text-dark/60">
            Solicitud realizada:{' '}
            {dateFormatter.format(new Date(returnRequest.requestedAt))}
          </p>

          {returnRequest.status === 'RECHAZADA' && returnRequest.resolutionNote && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <strong>Motivo del rechazo:</strong>
              <p className="mt-1">{returnRequest.resolutionNote}</p>
            </div>
          )}

          {returnRequest.status === 'APROBADA' && (
            <p className="text-sm text-dark/70">
              Tu solicitud fue aprobada. El reintegro se gestiona por fuera de la plataforma.
            </p>
          )}
        </div>
      ) : (
        <>
          {!deliveredAt ? (
            <p className="text-sm text-dark/60">
              No hay una fecha de entrega registrada para este pedido.
            </p>
          ) : canRequest ? (
            <>
              <p className="text-sm font-medium text-primary">
                {daysRemaining === 0
                  ? 'Hoy es el último día para solicitar la devolución.'
                  : `Te quedan ${daysRemaining} día(s) para solicitar la devolución.`}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="return-reason"
                    className="mb-1 block text-sm font-semibold text-dark"
                  >
                    Motivo de devolución *
                  </label>

                  <select
                    id="return-reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    required
                    className="w-full rounded-lg border border-dark/20 bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none"
                  >
                    <option value="">Seleccioná un motivo</option>
                    {REASONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="return-comment"
                    className="mb-1 block text-sm font-semibold text-dark"
                  >
                    Comentario adicional (opcional)
                  </label>

                  <textarea
                    id="return-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="Contanos más detalles si lo necesitás..."
                    className="w-full rounded-lg border border-dark/20 bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Enviando solicitud...' : 'Solicitar devolución'}
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-dark/60">
              El plazo de 10 días corridos desde la entrega ya venció. No es posible
              solicitar la devolución desde esta sección.
            </p>
          )}
        </>
      )}

      {error && returnRequest && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  )
}

export default ReturnRequestSection