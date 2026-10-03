import { z } from 'zod'

// Names must be unique (the backend rejects duplicates), so the schema needs the other names.
export function categorySchema(otherNames) {
  const taken = new Set(otherNames.map((name) => name.trim().toLowerCase()))
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(255, 'El nombre debe tener menos de 255 caracteres')
      .refine((name) => !taken.has(name.toLowerCase()), 'Ya existe una categoría con este nombre'),
  })
}
