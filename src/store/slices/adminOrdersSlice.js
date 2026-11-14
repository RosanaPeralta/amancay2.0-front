import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as ordersService from '../../services/ordersService'
import { sessionChanged, signOut } from './authSlice'

export const fetchAdminOrders = createAsyncThunk('adminOrders/fetchAll', () => ordersService.listAllOrders())


const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminOrdersSlice.reducer
