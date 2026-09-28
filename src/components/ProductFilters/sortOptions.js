// Values match the backend's ProductSort enum.
export const SORT_OPTIONS = [
  { value: 'name', label: 'Nombre: A–Z' },
  { value: 'name_desc', label: 'Nombre: Z–A' },
  { value: 'newest', label: 'Más recientes' },
]

export const DEFAULT_SORT = SORT_OPTIONS[0].value
