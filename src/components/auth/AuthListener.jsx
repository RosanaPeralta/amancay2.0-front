import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { loadProfile, sessionChanged } from '../../store/slices/authSlice'
import { fetchFavoriteIds } from '../../store/slices/favoritesSlice'

function AuthListener() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Supabase warns against awaiting its own client inside this callback,
      // so the work is deferred to the next tick.
      setTimeout(() => {
        dispatch(sessionChanged(session))
        if (session && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')) {
          dispatch(loadProfile())
          dispatch(fetchFavoriteIds())
        }
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password')
        }
      }, 0)
    })
    return () => data.subscription.unsubscribe()
  }, [dispatch, navigate])

  return null
}

export default AuthListener
