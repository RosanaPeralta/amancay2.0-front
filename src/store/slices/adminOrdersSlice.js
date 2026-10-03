import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as ordersService from '../../services/ordersService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchAdminOrders = createAsyncThunk('adminOrders/fetchAll', () => ordersService.listAllOrders())

export const changeOrderStatus = mutationThunk('adminOrders/changeStatus', ({ id, status }) =>
  ordersService.changeOrderStatus(id, status),
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
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        // The status endpoint returns a plain order (no buyerEmail), so merge it into the row.
        const order = state.items.find((item) => item.id === action.payload.id)
        if (order) Object.assign(order, action.payload, { buyerEmail: order.buyerEmail })
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminOrdersSlice.reducer
