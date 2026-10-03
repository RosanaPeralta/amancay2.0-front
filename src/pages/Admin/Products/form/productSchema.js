import { z } from 'zod'

// Accepts "349.00" or "349,00".
const decimal = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label}: campo obligatorio`)
    .transform((value) => value.replace(',', '.'))
    .pipe(z.coerce.number(`${label}: debe ser un número`).min(0, `${label}: no puede ser negativo`))

export const imageUrlSchema = z.url('Ingresa la URL completa de la imagen, por ejemplo https://example.com/carpa.jpg')

export const productSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(255, 'El nombre debe tener menos de 255 caracteres'),
  shortDescription: z.string().trim().max(255, 'Debe tener menos de 255 caracteres'),
  description: z.string().trim(),
  active: z.boolean(),
  images: z.array(z.object({ id: z.string().nullable(), imageUrl: imageUrlSchema })),
  variants: z
    .array(
      z.object({
        id: z.string().nullable(),
        price: decimal('Precio'),
        stockQuantity: decimal('Stock').pipe(z.number().int('Stock: debe ser un número entero')),
      }),
    )
    .min(1, 'Un producto necesita al menos una variante'),
  categoryIds: z.array(z.string()),
  discountId: z.string(),
})

export function toFormValues(product) {
  return {
    name: product?.name ?? '',
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? '',
    active: product?.active ?? true,
    images: product?.images?.map((image) => ({ id: image.id, imageUrl: image.imageUrl })) ?? [],
    variants: product?.variants?.length
      ? product.variants.map((variant) => ({
          id: variant.id,
          price: String(variant.price),
          stockQuantity: String(variant.stockQuantity),
        }))
      : [{ id: null, price: '', stockQuantity: '0' }],
    categoryIds: product?.categoryIds ?? [],
    discountId: product?.discount ? String(product.discount.id) : '',
  }
}

// Shapes validated values into the backend's CreateProductRequest / UpdateProductRequest.
export function toPayload(data, isNew) {
  const base = {
    name: data.name,
    shortDescription: data.shortDescription || null,
    description: data.description || null,
    active: data.active,
  }
  const discountId = data.discountId ? Number(data.discountId) : null
  if (isNew) {
    return {
      ...base,
      variants: data.variants.map(({ price, stockQuantity }) => ({ price, stockQuantity })),
      imageUrls: data.images.map((image) => image.imageUrl),
      categoryIds: data.categoryIds,
      discountId,
    }
  }
  return {
    ...base,
    variants: data.variants.map(({ id, price, stockQuantity }) => ({ id, price, stockQuantity })),
    images: data.images.map(({ id, imageUrl }) => ({ id, imageUrl })),
    categoryIds: data.categoryIds,
    discountId,
  }
}

// Best-effort payload for the live preview, even while the form is still invalid.
export function previewPayload(values, isNew) {
  const toNumber = (value) => {
    const number = Number(String(value).replace(',', '.'))
    return value !== '' && Number.isFinite(number) ? number : value
  }
  return toPayload(
    {
      ...values,
      name: values.name.trim(),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      variants: values.variants.map((variant) => ({
        ...variant,
        price: toNumber(variant.price),
        stockQuantity: toNumber(variant.stockQuantity),
      })),
    },
    isNew,
  )
}
