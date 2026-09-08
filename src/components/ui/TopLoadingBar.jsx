function TopLoadingBar({ active }) {
  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-30 h-0.5 overflow-hidden bg-primary/10 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-full w-1/3 bg-primary animate-loading-bar" />
    </div>
  )
}

export default TopLoadingBar
