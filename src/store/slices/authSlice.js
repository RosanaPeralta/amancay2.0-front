import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'
import { getMe, updateMe } from '../../services/usersService'

const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con este correo.',
  'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
}

function authErrorMessage(error) {
  if (error.status === 429) return 'Demasiados intentos. Espera un momento y vuelve a intentarlo.'
  return AUTH_ERROR_MESSAGES[error.message] || error.message
}

function toSupabaseUser(session) {
  return session ? { id: session.user.id, email: session.user.email } : null
}

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(authErrorMessage(error))
  return data.session
})

export const signUp = createAsyncThunk('auth/signUp', async ({ name, email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) throw new Error(authErrorMessage(error))
  return data.session
})

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(authErrorMessage(error))
})

export const loadProfile = createAsyncThunk('auth/loadProfile', () => getMe())

export const updateProfile = createAsyncThunk('auth/updateProfile', (name) => updateMe({ name }))

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    supabaseUser: null,
    profile: null,
    status: 'idle',
    profileStatus: 'idle',
    error: null,
  },
  reducers: {
    sessionChanged(state, action) {
      state.supabaseUser = toSupabaseUser(action.payload)
      state.status = action.payload ? 'authenticated' : 'anonymous'
      if (!action.payload) {
        state.profile = null
        state.profileStatus = 'idle'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.supabaseUser = toSupabaseUser(action.payload)
        state.status = 'authenticated'
      })
      .addCase(signUp.fulfilled, (state, action) => {
        if (action.payload) {
          state.supabaseUser = toSupabaseUser(action.payload)
          state.status = 'authenticated'
        }
      })
      .addCase(signOut.fulfilled, (state) => {
        state.supabaseUser = null
        state.profile = null
        state.status = 'anonymous'
        state.profileStatus = 'idle'
      })
      .addCase(loadProfile.pending, (state) => {
        state.profileStatus = 'loading'
        state.error = null
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded'
        state.profile = action.payload
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.profileStatus = 'failed'
        state.error = action.error.message
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
  },
})

export const { sessionChanged } = authSlice.actions

export const selectIsAuthenticated = (state) => state.auth.status === 'authenticated'
export const selectIsAdmin = (state) => state.auth.profile?.role === 'ADMIN'

export default authSlice.reducer
