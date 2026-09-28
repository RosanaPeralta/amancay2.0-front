import AdminCard from '../../../../components/admin/AdminCard'
import Toggle from '../../../../components/admin/Toggle'

function StatusSection({ values, setField, onDelete, deleting }) {
  return (
    <AdminCard title="Estado">
      <Toggle
        label="Activo"
        description={values.active ? 'Visible y disponible para comprar en la tienda.' : 'Borrador: oculto en la tienda.'}
        checked={values.active}
        onChange={(checked) => setField('active', checked)}
      />
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="mt-4 w-full border-t border-dark/10 pt-4 text-left text-xs font-bold text-danger hover:underline disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar este producto'}
        </button>
      )}
    </AdminCard>
  )
}

export default StatusSection
