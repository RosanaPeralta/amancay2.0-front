import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AdminPageHeader from '../../../components/admin/AdminPageHeader'
import { getProduct } from '../../../services/productsService'
import { createProduct, deleteProduct, updateProduct } from '../../../store/slices/adminProductsSlice'
import { fetchCategories } from '../../../store/slices/categoriesSlice'
import { fetchDiscounts } from '../../../store/slices/discountsSlice'
import { zodErrors } from '../../../lib/zodErrors'
import { productSchema, toFormValues, toPayload } from './form/productSchema'
import BasicInfoSection from './form/BasicInfoSection'
import ImagesSection from './form/ImagesSection'
import VariantsSection from './form/VariantsSection'
import StatusSection from './form/StatusSection'
import CategoriesSection from './form/CategoriesSection'
import DiscountSection from './form/DiscountSection'

const FORM_ID = 'product-form'

function ProductForm({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categories = useSelector((state) => state.categories.items)
  const discounts = useSelector((state) => state.discounts.items)
  const isNew = !product

  const [values, setValues] = useState(() => toFormValues(product))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)
    const result = productSchema.safeParse(values)
    if (!result.success) {
      setErrors(zodErrors(result.error))
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const data = toPayload(result.data, isNew)
      if (isNew) {
        await dispatch(createProduct(data)).unwrap()
      } else {
        const removeDiscount = Boolean(product.discount) && !result.data.discountId
        await dispatch(updateProduct({ id: product.id, data, removeDiscount })).unwrap()
      }
      navigate('/admin/products')
    } catch (err) {
      setSubmitError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    try {
      await dispatch(deleteProduct(product.id)).unwrap()
      navigate('/admin/products')
    } catch (err) {
      setSubmitError(err.message)
      setDeleting(false)
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <>
      <AdminPageHeader
        breadcrumb={
          <nav aria-label="Ruta de navegación" className="mb-2 text-xs text-dark/50">
            <Link to="/admin/products" className="hover:text-primary">
              Productos
            </Link>
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-dark">{isNew ? 'Nuevo producto' : 'Editar producto'}</span>
          </nav>
        }
        title={values.name.trim() || 'Nuevo producto'}
        actions={
          <>
            <Button to="/admin/products" variant="outline" className="!bg-white">
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} disabled={saving}>
              ✓ {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
            </Button>
          </>
        }
      />

      {(submitError || hasErrors) && (
        <p role="alert" className="mb-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-left text-sm text-danger">
          {submitError ? `No se pudo guardar: ${submitError}` : 'Revisa algunos campos antes de guardar.'}
        </p>
      )}

      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <BasicInfoSection values={values} errors={errors} setField={setField} />
          <ImagesSection values={values} errors={errors} setField={setField} />
          <VariantsSection values={values} errors={errors} setField={setField} />
        </div>
        <div className="min-w-0 space-y-5">
          <StatusSection values={values} setField={setField} onDelete={isNew ? null : handleDelete} deleting={deleting} />
          <CategoriesSection values={values} setField={setField} categories={categories} />
          <DiscountSection values={values} setField={setField} discounts={discounts} />
        </div>
      </form>
    </>
  )
}

function ProductEdit() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [state, setState] = useState({ product: null, status: id ? 'loading' : 'ready', error: null, loadedId: null })

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchDiscounts())
  }, [dispatch])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getProduct(id)
      .then((product) => !cancelled && setState({ product, status: 'ready', error: null, loadedId: id }))
      .catch((err) => !cancelled && setState({ product: null, status: 'failed', error: err.message, loadedId: id }))
    return () => {
      cancelled = true
    }
  }, [id])

  if (id && state.loadedId !== id) return <Loading />
  if (state.status === 'failed') return <Notice variant="error">No se pudo cargar este producto: {state.error}</Notice>

  return <ProductForm key={id ?? 'new'} product={id ? state.product : null} />
}

export default ProductEdit
