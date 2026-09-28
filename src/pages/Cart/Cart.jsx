import { useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import CartLineItem from '../../components/cart/CartLineItem'
import { selectCartItems, selectCartSubtotal } from '../../store/slices/cartSlice'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function Cart() {
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)

  return (
    <Container className="py-12">
      <SectionHeading>Your cart</SectionHeading>

      {items.length === 0 ? (
        <Notice>
          Your cart is empty.
          <div className="mt-4">
            <Button to="/products" variant="outline">
              Browse products
            </Button>
          </div>
        </Notice>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartLineItem key={item.variantId} item={item} />
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-dark/10 pt-6">
            <span className="text-lg font-semibold text-dark">Subtotal</span>
            <span className="text-2xl font-semibold text-primary">{currencyFormatter.format(subtotal)}</span>
          </div>

          <div className="flex justify-end gap-3">
            <Button to="/products" variant="outline">
              Continue shopping
            </Button>
            <Button to="/checkout">Checkout</Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export default Cart
