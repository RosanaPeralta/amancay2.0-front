import { z } from 'zod'

// Mirrors the backend's DiscountRequest: a description plus a 0–100 percentage.
export const discountSchema = z.object({
  description: z.string().trim().min(1, 'El nombre es obligatorio').max(255, 'El nombre debe tener menos de 255 caracteres'),
  percentage: z
    .string()
    .trim()
    .min(1, 'El porcentaje es obligatorio')
    .transform((value) => value.replace(',', '.'))
    .pipe(
      z.coerce
        .number('El porcentaje debe ser un número')
        .gt(0, 'El porcentaje debe ser mayor que 0')
        .max(100, 'El porcentaje no puede ser mayor que 100'),
    ),
})
