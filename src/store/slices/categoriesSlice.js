import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { listCategories } from '../../services/categoriesService'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  () => listCategories(),
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
  },
})

export default categoriesSlice.reducer
