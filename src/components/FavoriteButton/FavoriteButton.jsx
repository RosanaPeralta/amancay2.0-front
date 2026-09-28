import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectIsAuthenticated } from '../../store/slices/authSlice'
import { toggleFavorite } from '../../store/slices/favoritesSlice'

function FavoriteButton({ productId, className = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isFavorite = useSelector((state) => state.favorites.ids.includes(productId))
  const isPending = useSelector((state) => state.favorites.pending.includes(productId))

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    dispatch(toggleFavorite({ productId, favorite: !isFavorite }))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 border border-dark/10 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60 ${
        isFavorite ? 'text-info-pink' : 'text-dark/50 hover:text-info-pink'
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
