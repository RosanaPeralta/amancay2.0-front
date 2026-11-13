
import { useEffect, useState } from 'react'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import AdminCard from '../../../components/admin/AdminCard'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import {
  listPendingReturnRequests,
  approveReturnRequest,
  rejectReturnRequest,
} from '../../../services/returnsService'

const REASONS = {
  EXPECTATION_NOT_MET: 'El producto no cumplió mis expectativas',
  WRONG_SIZE: 'El talle no es el correcto',
  DAMAGED: 'El producto llegó dañado',
  WRONG_PRODUCT: 'Recibí otro producto',
  OTHER: 'Otro motivo',
}

const formatDate = (date) =>
  new Date(date).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

function Returns() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [resolutionNote, setResolutionNote] = useState('')

  async function loadRequests() {
    setLoading(true)
    setError('')

    try {
      const result = await listPendingReturnRequests()
      setRequests(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las devoluciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  async function handleApprove(requestId) {
    setError('')
    setProcessingId(requestId)

    try {
      await approveReturnRequest(requestId)
      setRequests((current) =>
        current.filter((request) => request.id !== requestId)
      )
    } catch (err) {
      setError(err.message || 'No se pudo aprobar la devolución.')
    } finally {
      setProcessingId(null)
    }
  }

  function startReject(requestId) {
    setRejectingId(requestId)
    setResolutionNote('')
    setError('')
  }

  async function handleReject(requestId) {
    const note = resolutionNote.trim()

    if (!note) {
      setError('La nota de rechazo es obligatoria.')
      return
    }

    setError('')
    setProcessingId(requestId)

    try {
      await rejectReturnRequest(requestId, note)
      setRequests((current) =>
        current.filter((request) => request.id !== requestId)
      )
      setRejectingId(null)
      setResolutionNote('')
    } catch (err) {
      setError(err.message || 'No se pudo rechazar la devolución.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Devoluciones"
        subtitle={`${requests.length} solicitudes pendientes de resolución`}
      />

      {error && (
        <div className="mb-5">
          <Notice variant="error">{error}</Notice>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <Notice>¡Todo al día! No hay solicitudes de devolución pendientes.</Notice>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const isProcessing = processingId === request.id
            const isRejecting = rejectingId === request.id

            return (
              <AdminCard key={request.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-primary">
                      Pedido #{request.orderId.slice(0, 8)}
                    </h2>
                    <p className="mt-1 text-xs text-dark/60">
                      Solicitud del {formatDate(request.requestedAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    Pendiente
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-dark">
                    <strong>Motivo:</strong>{' '}
                    {REASONS[request.reason] || request.reason}
                  </p>

                  <div>
                    <strong className="text-dark">Comentario del cliente:</strong>
                    <p className="mt-1 whitespace-pre-wrap text-dark/70">
                      {request.comment || 'Sin comentarios adicionales.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-dark/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleApprove(request.id)}
                    disabled={isProcessing || rejectingId !== null}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? 'Procesando...' : 'Aprobar devolución'}
                  </button>

                  <button
                    type="button"
                    onClick={() => startReject(request.id)}
                    disabled={isProcessing || rejectingId !== null}
                    className="rounded-full border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>

                {isRejecting && (
                  <div className="mt-4 space-y-3 rounded-lg bg-mist p-4">
                    <label
                      htmlFor={`resolution-${request.id}`}
                      className="block text-sm font-semibold text-dark"
                    >
                      Motivo del rechazo *
                    </label>

                    <textarea
                      id={`resolution-${request.id}`}
                      value={resolutionNote}
                      onChange={(event) => setResolutionNote(event.target.value)}
                      rows={3}
                      maxLength={1000}
                      placeholder="Explicá al cliente por qué se rechaza su solicitud..."
                      className="w-full rounded-lg border border-dark/20 bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none"
                    />

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleReject(request.id)}
                        disabled={isProcessing || !resolutionNote.trim()}
                        className="rounded-full bg-danger px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? 'Procesando...' : 'Confirmar rechazo'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(null)
                          setResolutionNote('')
                          setError('')
                        }}
                        disabled={isProcessing}
                        className="rounded-full border border-dark/20 px-5 py-2.5 text-sm font-semibold text-dark hover:bg-white disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </AdminCard>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Returns