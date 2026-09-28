import SidebarLayout from './SidebarLayout'

const links = [
  { to: '/account', label: 'Perfil', end: true, icon: 'M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { to: '/account/addresses', label: 'Direcciones', icon: 'M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { to: '/account/favorites', label: 'Favoritos', icon: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z' },
  { to: '/account/reviews', label: 'Mis reseñas', icon: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z' },
]

function AccountLayout() {
  return <SidebarLayout title="Mi cuenta" subtitle="Administra tu perfil, tus direcciones y tu equipo guardado." links={links} />
}

export default AccountLayout
