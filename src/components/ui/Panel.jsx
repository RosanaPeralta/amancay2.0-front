function Panel({ title, description, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-dark/5 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      {title && <h2 className="text-lg font-bold text-dark">{title}</h2>}
      {description && <p className="mt-1 text-sm text-dark/60">{description}</p>}
      <div className={title || description ? 'mt-6' : ''}>{children}</div>
    </section>
  )
}

export default Panel
