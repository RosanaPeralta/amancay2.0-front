import { createAsyncThunk } from '@reduxjs/toolkit'

// createAsyncThunk only keeps the error message on rejection. Forms need the
// per-field errors the API returns too, so mutations reject with the whole thing.
export function mutationThunk(type, fn) {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg)
    } catch (error) {
      return rejectWithValue({ message: error.message, status: error.status, fields: error.fields || {} })
    }
  })
}
