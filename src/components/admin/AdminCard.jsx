function AdminCard({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-dark/5 bg-white p-5 text-left shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-bold text-primary">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export default AdminCard
