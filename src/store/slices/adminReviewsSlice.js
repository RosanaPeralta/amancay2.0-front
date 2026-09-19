import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as adminReviewsService from '../../services/adminReviewsService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchAdminReviews = createAsyncThunk(
  'adminReviews/fetchPage',
  async ({ status, page = 0, size = 20 } = {}) => {
    const data = await adminReviewsService.listReviews({ status, page, size })
    return { items: data.content, page: data.page, totalPages: data.totalPages, totalElements: data.totalElements }
  },
)

export const changeReviewStatus = mutationThunk('adminReviews/changeStatus', ({ id, status }) =>
  adminReviewsService.updateReviewStatus(id, status),
)

export const deleteAdminReview = mutationThunk('adminReviews/delete', async (id) => {
  await adminReviewsService.deleteReview(id)
  return id
})

const initialState = {
  items: [],
  page: 0,
  totalPages: 1,
  totalElements: 0,
  status: 'idle',
  error: null,
}

const adminReviewsSlice = createSlice({
  name: 'adminReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(changeReviewStatus.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminReviewsSlice.reducer
