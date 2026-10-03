import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProduct, listProducts } from '../../services/productsService'

// The list endpoint returns lightweight summaries (no price/images), so
// hydrate each one with a detail call to render a real product card.
async function hydrateSummaries(summaries) {
  return Promise.all(summaries.map((summary) => getProduct(summary.id)))
}

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async () => {
    const page = await listProducts({ page: 0, size: 8, isActive: true })
    return hydrateSummaries(page.content)
  },
  {
    condition: (_, { getState }) => getState().products.featured.status !== 'loading',
  },
)

export const fetchProductsList = createAsyncThunk(
  'products/fetchList',
  async ({ page = 0, size = 12, name, categoryId, sort } = {}) => {
    const data = await listProducts({ page, size, isActive: true, name, categoryId, sort })
    const items = await hydrateSummaries(data.content)
    return { items, page: data.page, totalPages: data.totalPages, totalElements: data.totalElements }
  },
)

export const fetchProductById = createAsyncThunk('products/fetchById', (id) => getProduct(id))

const initialState = {
  featured: { items: [], status: 'idle', error: null },
  list: { items: [], page: 0, totalPages: 1, totalElements: 0, status: 'idle', error: null, requestId: null },
  current: { item: null, status: 'idle', error: null },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featured.status = 'loading'
        state.featured.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured.status = 'succeeded'
        state.featured.items = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featured.status = 'failed'
        state.featured.error = action.error.message
      })

      // Filters can fire several requests in a row; only the latest one wins.
      .addCase(fetchProductsList.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.requestId = action.meta.requestId
      })
      .addCase(fetchProductsList.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.items
        state.list.page = action.payload.page
        state.list.totalPages = action.payload.totalPages
        state.list.totalElements = action.payload.totalElements
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'failed'
        state.list.error = action.error.message
      })

      .addCase(fetchProductById.pending, (state) => {
        state.current.status = 'loading'
        state.current.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.current.status = 'succeeded'
        state.current.item = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.current.status = 'failed'
        state.current.error = action.error.message
      })
  },
})

export default productsSlice.reducer
