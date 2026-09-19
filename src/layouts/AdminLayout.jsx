import SidebarLayout from './SidebarLayout'

const links = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/reviews', label: 'Reviews' },
]

function AdminLayout() {
  return <SidebarLayout title="Admin" links={links} />
}

export default AdminLayout
