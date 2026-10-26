import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../store/slices/authSlice'
import { fetchRecommendations } from '../../store/slices/recommendationsSlice'

export function useRecommendations() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const favoritesStatus = useSelector((state) => state.favorites.idsStatus)
  const favoritesCount = useSelector((state) => state.favorites.ids.length)
  const recommendations = useSelector((state) => state.recommendations)
  const hasFavorites = favoritesCount > 0

  useEffect(() => {
    if (isAuthenticated && favoritesStatus === 'succeeded' && hasFavorites) {
      dispatch(fetchRecommendations())
    }
  }, [dispatch, isAuthenticated, favoritesStatus, hasFavorites])

  // While a refresh is in flight keep showing the previous suggestions instead of a skeleton.
  const refreshing = recommendations.status === 'loading' && recommendations.items.length > 0

  return {
    ...recommendations,
    status: refreshing ? 'succeeded' : recommendations.status,
    enabled: isAuthenticated,
    favoritesReady: favoritesStatus === 'succeeded',
    favoritesCount,
  }
}
