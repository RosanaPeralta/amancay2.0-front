import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { removeItem, updateQuantity } from '../../store/slices/cartSlice'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function CartLineItem({ item }) {
  const dispatch = useDispatch()

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-lg border border-dark/10 bg-white p-5">
      <div className="h-16 w-16 shrink-0 rounded-md bg-light overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
        ) : (
          <span className="caption-text">No image</span>
        )}
      </div>

      <div className="flex-1 min-w-[160px]">
        <Link
          to={`/products/${item.productId}`}
          className="font-medium text-dark hover-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
        >
          {item.productName}
        </Link>
        <p className="text-dark text-sm">{currencyFormatter.format(item.unitPrice)} each</p>
      </div>

      <input
        type="number"
        min={1}
        max={item.maxStock}
        value={item.quantity}
        onChange={(event) =>
          dispatch(updateQuantity({ variantId: item.variantId, quantity: Number(event.target.value) || 1 }))
        }
        className="w-16 px-3 py-2 rounded-full border border-dark/10 bg-white text-sm text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />

      <span className="w-24 text-right font-semibold text-dark">
        {currencyFormatter.format(item.unitPrice * item.quantity)}
      </span>

      <Button
        variant="outline"
        className="text-danger border-danger/30 hover:bg-danger/5"
        onClick={() => dispatch(removeItem(item.variantId))}
      >
        Remove
      </Button>
    </li>
  )
}

export default CartLineItem
