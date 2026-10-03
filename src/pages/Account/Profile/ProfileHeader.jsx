const ROLE_LABELS = { ADMIN: 'Administrador', BUYER: 'Comprador' }

function ProfileHeader({ profile }) {
  const displayName = profile.name || profile.email.split('@')[0]
  const memberSince = new Date(profile.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  const isAdmin = profile.role === 'ADMIN'

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-sm sm:p-8">
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary-light/20" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-light text-2xl font-bold uppercase text-primary"
          aria-hidden="true"
        >
          {displayName.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-2xl font-bold">{displayName}</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isAdmin ? 'bg-info text-dark' : 'bg-white/15 text-white'}`}
            >
              {ROLE_LABELS[profile.role] ?? profile.role}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-white/80">{profile.email}</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="text-white/60">Miembro desde</p>
          <p className="font-semibold">{memberSince}</p>
        </div>
      </div>
    </section>
  )
}

export default ProfileHeader
