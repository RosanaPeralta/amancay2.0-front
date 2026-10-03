import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as discountsService from '../../services/discountsService'
import { mutationThunk } from '../mutationThunk'

export const fetchDiscounts = createAsyncThunk('discounts/fetchAll', () => discountsService.listDiscounts(), {
  condition: (_, { getState }) => {
    const { status } = getState().discounts
    return status !== 'loading' && status !== 'succeeded'
  },
})

export const createDiscount = mutationThunk('discounts/create', (data) => discountsService.createDiscount(data))
export const updateDiscount = mutationThunk('discounts/update', ({ id, data }) => discountsService.updateDiscount(id, data))
export const deleteDiscount = mutationThunk('discounts/delete', async (id) => {
  await discountsService.deleteDiscount(id)
  return id
})

const discountsSlice = createSlice({
  name: 'discounts',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export default discountsSlice.reducer
