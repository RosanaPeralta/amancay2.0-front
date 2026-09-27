import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as paymentsService from '../../services/paymentsService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchPendingPayments = createAsyncThunk('adminPayments/fetchPending', () =>
  paymentsService.listPendingPayments(),
)

export const decidePendingPayment = mutationThunk('adminPayments/decide', ({ paymentId, status }) =>
  paymentsService.confirmPayment(paymentId, status),
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const adminPaymentsSlice = createSlice({
  name: 'adminPayments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingPayments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPendingPayments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPendingPayments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(decidePendingPayment.fulfilled, (state, action) => {
        // The confirm endpoint returns a PaymentDto (its payment id is `.id`), not the
        // admin list's shape (`.paymentId`): a decided payment just leaves the queue.
        state.items = state.items.filter((item) => item.paymentId !== action.payload.id)
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminPaymentsSlice.reducer
