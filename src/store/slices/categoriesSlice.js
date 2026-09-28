import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as categoriesService from '../../services/categoriesService'
import { mutationThunk } from '../mutationThunk'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  () => categoriesService.listCategories(),
  {
    // Categories rarely change and are needed on several screens (Home,
    // ProductDetail) — skip re-fetching once we already have them or a
    // fetch is already in flight.
    condition: (_, { getState }) => {
      const { status } = getState().categories
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

export const createCategory = mutationThunk('categories/create', (data) => categoriesService.createCategory(data))
export const updateCategory = mutationThunk('categories/update', ({ id, data }) =>
  categoriesService.updateCategory(id, data),
)
export const deleteCategory = mutationThunk('categories/delete', async (id) => {
  await categoriesService.deleteCategory(id)
  return id
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export default categoriesSlice.reducer
