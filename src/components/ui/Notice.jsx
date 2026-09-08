function Notice({ variant = 'empty', children }) {
  const isError = variant === 'error'

  return (
    <div
      className={`max-w-md mx-auto text-center rounded-lg border px-6 py-8 ${
        isError ? 'border-danger/30 bg-danger/5 text-danger' : 'border-dark/10 bg-white body-text'
      }`}
    >
      {children}
    </div>
  )
}

export default Notice
