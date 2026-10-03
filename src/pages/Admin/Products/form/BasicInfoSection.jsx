import AdminCard from '../../../../components/admin/AdminCard'
import Field from '../../../../components/admin/Field'
import { inputClass } from '../../../../components/admin/styles'

function BasicInfoSection({ values, errors, setField }) {
  return (
    <AdminCard title="Información básica">
      <div className="space-y-4">
        <Field label="Nombre" error={errors.name}>
          <input className={inputClass(errors.name)} value={values.name} onChange={(event) => setField('name', event.target.value)} />
        </Field>
        <Field label="Descripción corta" hint="Se muestra debajo del nombre en las tarjetas de producto." error={errors.shortDescription}>
          <input
            className={inputClass(errors.shortDescription)}
            value={values.shortDescription}
            onChange={(event) => setField('shortDescription', event.target.value)}
          />
        </Field>
        <Field label="Descripción" error={errors.description}>
          <textarea
            rows={5}
            className={`${inputClass(errors.description)} resize-y`}
            value={values.description}
            onChange={(event) => setField('description', event.target.value)}
          />
        </Field>
      </div>
    </AdminCard>
  )
}

export default BasicInfoSection
