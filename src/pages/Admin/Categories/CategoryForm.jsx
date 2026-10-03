import { useState } from 'react'
import { useDispatch } from 'react-redux'
import AdminCard from '../../../components/admin/AdminCard'
import Field from '../../../components/admin/Field'
import { inputClass } from '../../../components/admin/styles'
import Button from '../../../components/ui/Button'
import { zodErrors } from '../../../lib/zodErrors'
import { createCategory, deleteCategory, updateCategory } from '../../../store/slices/categoriesSlice'
import { categorySchema } from './categorySchema'

function CategoryForm({ category, productCount, otherNames, onDone }) {
  const dispatch = useDispatch()
  const isNew = !category
  const [name, setName] = useState(category?.name ?? '')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    const result = categorySchema(otherNames).safeParse({ name })
    if (!result.success) {
      setErrors(zodErrors(result.error))
      return
    }
    setErrors({})
    setBusy(true)
    try {
      const saved = isNew
        ? await dispatch(createCategory(result.data)).unwrap()
        : await dispatch(updateCategory({ id: category.id, data: result.data })).unwrap()
      onDone(saved.id)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar la categoría "${category.name}"?`)) return
    setBusy(true)
    try {
      await dispatch(deleteCategory(category.id)).unwrap()
      onDone(null)
    } catch (err) {
      setSubmitError(err.message)
      setBusy(false)
    }
  }

  return (
    <AdminCard title={isNew ? 'Nueva categoría' : 'Editar categoría'}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Nombre" error={errors.name}>
          <input className={inputClass(errors.name)} value={name} onChange={(event) => setName(event.target.value)} autoFocus />
        </Field>
        {submitError && <p className="text-xs text-danger">{submitError}</p>}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={busy}>
            {busy ? 'Guardando...' : isNew ? 'Crear categoría' : 'Guardar cambios'}
          </Button>
          <Button variant="outline" className="!bg-white" onClick={() => onDone(null)}>
            Limpiar
          </Button>
        </div>
        {!isNew && (
          <div className="border-t border-dark/10 pt-4 text-xs text-dark/60">
            {productCount > 0 ? (
              <p>
                Esta categoría tiene {productCount} {productCount === 1 ? 'producto' : 'productos'}. Muévelos a otra
                categoría antes de eliminarla.
              </p>
            ) : (
              <button type="button" onClick={handleDelete} disabled={busy} className="font-bold text-danger hover:underline">
                Eliminar esta categoría
              </button>
            )}
          </div>
        )}
      </form>
    </AdminCard>
  )
}

export default CategoryForm
