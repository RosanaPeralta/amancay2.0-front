import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as adminUsersService from '../../services/adminUsersService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchAdminUsers = createAsyncThunk('adminUsers/fetchPage', async ({ q, page = 0, size = 20 } = {}) => {
  const data = await adminUsersService.listUsers({ q, page, size })
  return { items: data.content, page: data.page, totalPages: data.totalPages, totalElements: data.totalElements }
})

export const changeUserRole = mutationThunk('adminUsers/changeRole', ({ id, role }) =>
  adminUsersService.changeUserRole(id, role),
)

const initialState = {
  items: [],
  page: 0,
  totalPages: 1,
  totalElements: 0,
  status: 'idle',
  error: null,
}

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default adminUsersSlice.reducer
