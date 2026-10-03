import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as productsService from '../../services/productsService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

// Admin needs price, stock and categories for every product (active or not), so load the
// catalog once with details and filter it client-side. Fine for a catalog of this size.
// Loaded once per session and kept up to date by the mutations below, so switching admin tabs
// doesn't refetch every product.
export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async () => {
    const page = await productsService.listProducts({ page: 0, size: 100 })
    return Promise.all(page.content.map((summary) => productsService.getProduct(summary.id)))
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().adminProducts
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

export const createProduct = mutationThunk('adminProducts/create', (data) => productsService.createProduct(data))
// The update endpoint ignores a null discountId, so clearing a discount is a separate call.
export const updateProduct = mutationThunk('adminProducts/update', async ({ id, data, removeDiscount }) => {
  const product = await productsService.updateProduct(id, data)
  if (!removeDiscount) return product
  await productsService.removeProductDiscount(id)
  return productsService.getProduct(id)
})
export const deleteProduct = mutationThunk('adminProducts/delete', async (id) => {
  await productsService.deleteProduct(id)
  return id
})

const initialState = { items: [], status: 'idle', error: null }

function upsert(state, product) {
  const index = state.items.findIndex((item) => item.id === product.id)
  if (index === -1) state.items.push(product)
  else state.items[index] = product
  state.items.sort((a, b) => a.name.localeCompare(b.name))
}

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createProduct.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(updateProduct.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminProductsSlice.reducer
