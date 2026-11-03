import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as recommendationsService from '../../services/recommendationsService'
import { sessionChanged, signOut } from './authSlice'

const RECOMMENDATIONS_LIMIT = 8

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async () => {
    const data = await recommendationsService.getRecommendations({ limit: RECOMMENDATIONS_LIMIT })
    return { items: data.products, source: data.source, basedOnCount: data.basedOnCount }
  },
  {
    condition: (_, { getState }) => {
      const { auth, favorites, recommendations } = getState()
      if (auth.status !== 'authenticated' || favorites.idsStatus !== 'succeeded') return false
      // Refetched on every visit: the backend samples different favorites each time, so the
      // suggestions vary.
      return favorites.ids.length > 0 && recommendations.status !== 'loading'
    },
  },
)

const initialState = { items: [], source: null, basedOnCount: 0, status: 'idle', error: null }

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.source = action.payload.source
        state.basedOnCount = action.payload.basedOnCount
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default recommendationsSlice.reducer
