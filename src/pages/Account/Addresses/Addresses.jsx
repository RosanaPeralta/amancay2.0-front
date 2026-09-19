import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/ui/Button'
import Notice from '../../../components/ui/Notice'
import Loading from '../../../components/Loading/Loading'
import AddressForm from './AddressForm'
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from '../../../store/slices/addressesSlice'

const MAX_ADDRESSES = 10

function formatAddress(address) {
  const line = [`${address.street} ${address.number}`, address.floorApt != null && `Floor/Apt ${address.floorApt}`]
    .filter(Boolean)
    .join(', ')
  const place = [address.city, address.province, address.country].filter(Boolean).join(', ')
  return { line, place: address.postalCode ? `${place} (${address.postalCode})` : place }
}

function Addresses() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.addresses)

  const [editing, setEditing] = useState(null) // null | 'new' | address
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  async function handleSubmit(data) {
    if (editing === 'new') {
      await dispatch(createAddress(data)).unwrap()
    } else {
      await dispatch(updateAddress({ id: editing.id, data })).unwrap()
    }
    setEditing(null)
  }

  async function run(action) {
    setActionError(null)
    try {
      await dispatch(action).unwrap()
    } catch (err) {
      setActionError(err.message)
    }
  }

  function handleDelete(address) {
    if (window.confirm('Delete this address?')) run(deleteAddress(address.id))
  }

  const isLoading = status === 'idle' || status === 'loading'
  const limitReached = items.length >= MAX_ADDRESSES

  if (isLoading) return <Loading />
  if (error) return <Notice variant="error">Couldn't load your addresses: {error}</Notice>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="body-text-light text-sm">
          {items.length} of {MAX_ADDRESSES} addresses
        </p>
        {editing === null && (
          <Button onClick={() => setEditing('new')} disabled={limitReached}>
            Add address
          </Button>
        )}
      </div>

      {editing !== null && (
        <AddressForm
          key={editing === 'new' ? 'new' : editing.id}
          address={editing === 'new' ? null : editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      {actionError && <Notice variant="error">{actionError}</Notice>}

      {items.length === 0 ? (
        editing === null && <Notice>You haven't added any addresses yet.</Notice>
      ) : (
        <ul className="space-y-4">
          {items.map((address) => {
            const { line, place } = formatAddress(address)
            return (
              <li key={address.id} className="rounded-lg border border-dark/10 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-dark">
                      {line}
                      {address.isDefault && (
                        <span className="ml-2 px-2 py-0.5 rounded-full border border-primary/30 text-primary text-xs font-medium">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="body-text text-sm">{place}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {!address.isDefault && (
                      <Button variant="outline" onClick={() => run(setDefaultAddress(address.id))}>
                        Set as default
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setEditing(address)}>
                      Edit
                    </Button>
                    <Button variant="outline" className="text-danger border-danger/30 hover:bg-danger/5" onClick={() => handleDelete(address)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Addresses
