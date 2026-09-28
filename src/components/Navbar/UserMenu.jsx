import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { selectIsAdmin, signOut } from '../../store/slices/authSlice'

const itemClass =
  'flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-dark transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:bg-primary/5'

function ProfileIcon({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-primary text-white ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    </span>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  )
}

function UserMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { supabaseUser, profile } = useSelector((state) => state.auth)
  const isAdmin = useSelector(selectIsAdmin)
  const [open, setOpen] = useState(false)
  const [prevPath, setPrevPath] = useState(location.pathname)
  const containerRef = useRef(null)

  const username = profile?.name || supabaseUser?.email?.split('@')[0]

  // Close the menu after navigating.
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function handleSignOut() {
    setOpen(false)
    await dispatch(signOut())
    navigate('/')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 border border-dark/10 bg-white transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <ProfileIcon />
        <span className="max-w-[10rem] truncate font-medium text-dark">{username}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-dark/50 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-xl shadow-primary/10 animate-fade-in-up [animation-duration:150ms]"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-mist border-b border-dark/5">
            <ProfileIcon />
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-dark">{username}</p>
              {supabaseUser?.email && <p className="truncate caption-text">{supabaseUser.email}</p>}
            </div>
          </div>
          <div className="py-1">
            <Link to="/account" role="menuitem" className={itemClass}>
              <SettingsIcon />
              Configuración
            </Link>
            {isAdmin && (
              <Link to="/admin" role="menuitem" className={itemClass}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
                </svg>
                Panel de administración
              </Link>
            )}
          </div>
          <div className="py-1 border-t border-dark/5">
            <button type="button" role="menuitem" onClick={handleSignOut} className={`${itemClass} hover:text-danger`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
