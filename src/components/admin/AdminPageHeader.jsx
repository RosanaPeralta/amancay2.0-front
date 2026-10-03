function AdminPageHeader({ title, subtitle, breadcrumb, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 text-left sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumb}
        <h1 className="truncate text-3xl font-bold tracking-tight text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-dark/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

export default AdminPageHeader
