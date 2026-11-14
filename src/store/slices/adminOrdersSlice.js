import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as ordersService from '../../services/ordersService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchAdminOrders = createAsyncThunk('adminOrders/fetchAll', () => ordersService.listAllOrders())

export const requestOrderAdvance = mutationThunk('adminOrders/requestAdvance', ({ id, status }) =>
  ordersService.requestOrderAdvance(id, status),
)

// Re-reads one order to see whether the queue already applied the change.
export const refreshAdminOrder = createAsyncThunk('adminOrders/refreshOne', ({ id, userId }) =>
  ordersService.getOrderOf(id, userId),
)

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
      .addCase(refreshAdminOrder.fulfilled, (state, action) => {
        // The order endpoint returns a plain order (no buyerEmail), so merge it into the row.
        const order = state.items.find((item) => item.id === action.payload.id)
        if (order) Object.assign(order, action.payload, { buyerEmail: order.buyerEmail })
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminOrdersSlice.reducer
