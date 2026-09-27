import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as ordersService from '../../services/ordersService'
import * as paymentsService from '../../services/paymentsService'
import { sessionChanged, signOut } from './authSlice'

export const fetchOrders = createAsyncThunk('orders/fetchAll', () => ordersService.listOrders())

export const fetchOrderById = createAsyncThunk('orders/fetchById', (id) => ordersService.getOrder(id))

export const fetchOrderPayments = createAsyncThunk('orders/fetchPayments', (orderId) =>
  paymentsService.listPayments(orderId),
)

const initialState = {
  list: { items: [], status: 'idle', error: null },
  current: { item: null, status: 'idle', error: null },
  payments: { items: [], status: 'idle', error: null },
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.list.status = 'loading'
        state.list.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list.status = 'succeeded'
        state.list.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.list.status = 'failed'
        state.list.error = action.error.message
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.current.status = 'loading'
        state.current.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current.status = 'succeeded'
        state.current.item = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.current.status = 'failed'
        state.current.error = action.error.message
      })

      .addCase(fetchOrderPayments.pending, (state) => {
        state.payments.status = 'loading'
        state.payments.error = null
      })
      .addCase(fetchOrderPayments.fulfilled, (state, action) => {
        state.payments.status = 'succeeded'
        state.payments.items = action.payload
      })
      .addCase(fetchOrderPayments.rejected, (state, action) => {
        state.payments.status = 'failed'
        state.payments.error = action.error.message
      })

      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default ordersSlice.reducer
