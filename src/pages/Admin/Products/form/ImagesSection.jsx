import { useState } from 'react'
import AdminCard from '../../../../components/admin/AdminCard'
import { inputClass } from '../../../../components/admin/styles'
import { imageUrlSchema } from './productSchema'

function ImagesSection({ values, errors, setField }) {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState(null)

  function handleAdd() {
    const result = imageUrlSchema.safeParse(url.trim())
    if (!result.success) {
      setUrlError(result.error.issues[0].message)
      return
    }
    setField('images', [...values.images, { id: null, imageUrl: result.data }])
    setUrl('')
    setUrlError(null)
  }

  function handleRemove(index) {
    setField(
      'images',
      values.images.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const rowError = values.images.map((_, index) => errors[`images.${index}.imageUrl`]).find(Boolean)

  return (
    <AdminCard title="Imágenes" action={<span className="text-xs text-dark/50">La primera imagen es la portada.</span>}>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          placeholder="https://.../imagen.jpg"
          aria-label="URL de la imagen"
          aria-invalid={Boolean(urlError) || undefined}
          className={inputClass(urlError)}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAdd()
            }
          }}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 rounded-full border border-dark/15 bg-white px-4 text-sm font-bold text-dark hover:border-primary/40 hover:text-primary"
        >
          + Agregar imagen
        </button>
      </div>
      {(urlError || rowError) && <p className="mt-1 text-xs text-danger">{urlError || rowError}</p>}

      {values.images.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {values.images.map((image, index) => (
            <div key={`${image.id ?? 'new'}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-xl bg-mist">
              <img src={image.imageUrl} alt="" className="h-full w-full object-contain mix-blend-multiply" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label="Quitar imagen"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-dark/60 shadow hover:text-danger"
              >
                ×
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[0.6rem] font-bold text-white">
                  Portada
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-dark/50">Todavía no hay imágenes. Los productos sin imagen muestran una imagen genérica.</p>
      )}
    </AdminCard>
  )
}

export default ImagesSection
