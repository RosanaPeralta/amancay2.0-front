import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import { changeUserRole, fetchAdminUsers } from '../../../store/slices/adminUsersSlice'

const ROLES = ['BUYER', 'ADMIN']

function Users() {
  const dispatch = useDispatch()
  const { items, page, totalPages, totalElements, status, error } = useSelector((state) => state.adminUsers)
  const currentUserId = useSelector((state) => state.auth.profile?.id)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => clearTimeout(handle)
  }, [search])

  if (debouncedSearch !== prevDebouncedSearch) {
    setPrevDebouncedSearch(debouncedSearch)
    setPageNumber(0)
  }

  useEffect(() => {
    dispatch(fetchAdminUsers({ page: pageNumber, size: 20, q: debouncedSearch || undefined }))
  }, [dispatch, pageNumber, debouncedSearch])

  async function handleRoleChange(user, role) {
    setActionError(null)
    try {
      await dispatch(changeUserRole({ id: user.id, role })).unwrap()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by email or name..."
        className="w-full max-w-md px-4 py-2.5 rounded-full border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />

      {actionError && <Notice variant="error">{actionError}</Notice>}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Notice variant="error">Couldn't load users: {error}</Notice>
      ) : items.length === 0 ? (
        <Notice>{debouncedSearch ? `No users match "${debouncedSearch}".` : 'No users yet.'}</Notice>
      ) : (
        <>
          <p className="caption-text">{totalElements} users</p>
          <div className="overflow-x-auto rounded-lg border border-dark/10 bg-white">
            <table className="w-full text-sm">
              <thead className="text-left caption-text border-b border-dark/10">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Member since</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user.id} className="border-b border-dark/5 last:border-0">
                    <td className="px-4 py-3 text-dark">{user.email}</td>
                    <td className="px-4 py-3 text-dark">{user.name || <span className="text-dark/40">—</span>}</td>
                    <td className="px-4 py-3 text-dark/70">{new Date(user.createdAt).toLocaleDateString('en-US')}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        disabled={user.id === currentUserId}
                        onChange={(event) => handleRoleChange(user, event.target.value)}
                        aria-label={`Role for ${user.email}`}
                        className="px-3 py-1.5 rounded-full border border-dark/10 bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => setPageNumber((n) => Math.max(0, n - 1))} disabled={pageNumber === 0}>
                Previous
              </Button>
              <span className="text-sm text-dark/70">
                Page {page + 1} of {totalPages || 1}
              </span>
              <Button variant="outline" onClick={() => setPageNumber((n) => n + 1)} disabled={pageNumber + 1 >= totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Users
