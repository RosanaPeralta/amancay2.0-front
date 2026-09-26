import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as favoritesService from '../../services/favoritesService'
import { sessionChanged, signOut } from './authSlice'

export const fetchFavoriteIds = createAsyncThunk('favorites/fetchIds', () => favoritesService.listFavoriteIds())

export const fetchFavoritesPage = createAsyncThunk('favorites/fetchPage', async ({ page = 0, size = 12 } = {}) => {
  const data = await favoritesService.listFavorites({ page, size })
  return { items: data.content, page: data.page, totalPages: data.totalPages }
})

// Optimistic: `pending` applies the wanted state right away and `rejected` reverts it.
// The caller passes the target state because `pending` runs before this function does.
// A 409/404 means the server already agrees with the new state, so it's not an error.
export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async ({ productId, favorite }) => {
    try {
      if (favorite) {
        await favoritesService.addFavorite(productId)
      } else {
        await favoritesService.removeFavorite(productId)
      }
    } catch (error) {
      if (error.status !== 409 && error.status !== 404) throw error
    }
    return { productId, favorite }
  },
  {
    condition: ({ productId }, { getState }) => !getState().favorites.pending.includes(productId),
  },
)

const initialState = {
  ids: [],
  idsStatus: 'idle',
  pending: [],
  list: { items: [], page: 0, totalPages: 1, status: 'idle', error: null },
}

function withFavorite(ids, productId, favorite) {
  const rest = ids.filter((id) => id !== productId)
  return favorite ? [...rest, productId] : rest
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteIds.pending, (state) => {
        state.idsStatus = 'loading'
      })
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.idsStatus = 'succeeded'
        // Keep the optimistic value of any toggle still in flight; the server
        // answer for those arrives with that toggle's own fulfilled action.
        state.ids = [
          ...action.payload.filter((id) => !state.pending.includes(id)),
          ...state.ids.filter((id) => state.pending.includes(id)),
        ]
      })
      .addCase(fetchFavoriteIds.rejected, (state) => {
        state.idsStatus = 'failed'
      })

      .addCase(fetchFavoritesPage.pending, (state) => {
        state.list.status = 'loading'
        state.list.error = null
      })
      .addCase(fetchFavoritesPage.fulfilled, (state, action) => {
        state.list.status = 'succeeded'
        state.list.items = action.payload.items
        state.list.page = action.payload.page
        state.list.totalPages = action.payload.totalPages
      })
      .addCase(fetchFavoritesPage.rejected, (state, action) => {
        state.list.status = 'failed'
        state.list.error = action.error.message
      })

      .addCase(toggleFavorite.pending, (state, action) => {
        const { productId, favorite } = action.meta.arg
        state.ids = withFavorite(state.ids, productId, favorite)
        state.pending.push(productId)
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { productId, favorite } = action.payload
        state.pending = state.pending.filter((id) => id !== productId)
        state.ids = withFavorite(state.ids, productId, favorite)
        if (!favorite) {
          state.list.items = state.list.items.filter((item) => item.productId !== productId)
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const { productId, favorite } = action.meta.arg
        state.pending = state.pending.filter((id) => id !== productId)
        state.ids = withFavorite(state.ids, productId, !favorite)
      })

      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default favoritesSlice.reducer
