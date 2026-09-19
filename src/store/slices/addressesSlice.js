import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as addressesService from '../../services/addressesService'
import { mutationThunk } from '../mutationThunk'
import { sessionChanged, signOut } from './authSlice'

export const fetchAddresses = createAsyncThunk('addresses/fetchAll', () => addressesService.listAddresses())

export const createAddress = mutationThunk('addresses/create', (data) => addressesService.createAddress(data))

export const updateAddress = mutationThunk('addresses/update', ({ id, data }) =>
  addressesService.updateAddress(id, data),
)

export const deleteAddress = mutationThunk('addresses/delete', async (id) => {
  await addressesService.deleteAddress(id)
  return id
})

export const setDefaultAddress = mutationThunk('addresses/setDefault', (id) =>
  addressesService.setDefaultAddress(id),
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : { ...item, isDefault: false },
        )
      })
      .addCase(signOut.fulfilled, () => initialState)
      .addCase(sessionChanged, (state, action) => (action.payload ? state : initialState))
  },
})

export default addressesSlice.reducer
