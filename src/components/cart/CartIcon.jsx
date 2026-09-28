import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectCartCount } from '../../store/slices/cartSlice'

function CartIcon() {
  const count = useSelector(selectCartCount)

  return (
    <NavLink
      to="/cart"
      aria-label="Cart"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-dark/10 bg-white/90 transition-colors hover:border-primary/30 text-dark/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] font-semibold">
          {count}
        </span>
      )}
    </NavLink>
  )
}

export default CartIcon
