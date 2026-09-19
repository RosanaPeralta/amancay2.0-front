import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as myReviewsService from '../../services/myReviewsService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchMyReviews = createAsyncThunk('myReviews/fetchPage', async ({ page = 0, size = 10 } = {}) => {
  const data = await myReviewsService.listMyReviews({ page, size })
  return { items: data.content, page: data.page, totalPages: data.totalPages }
})

export const updateMyReview = mutationThunk('myReviews/update', ({ id, data }) =>
  myReviewsService.updateReview(id, data),
)

export const deleteMyReview = mutationThunk('myReviews/delete', async (id) => {
  await myReviewsService.deleteReview(id)
  return id
})

const initialState = {
  items: [],
  page: 0,
  totalPages: 1,
  status: 'idle',
  error: null,
}

const myReviewsSlice = createSlice({
  name: 'myReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReviews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(updateMyReview.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteMyReview.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default myReviewsSlice.reducer
