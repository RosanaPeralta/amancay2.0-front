import SidebarLayout from './SidebarLayout'

const links = [
  { to: '/account', label: 'Profile', end: true },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/favorites', label: 'Favorites' },
  { to: '/account/reviews', label: 'My reviews' },
]

function AccountLayout() {
  return <SidebarLayout title="My account" links={links} />
}

export default AccountLayout
