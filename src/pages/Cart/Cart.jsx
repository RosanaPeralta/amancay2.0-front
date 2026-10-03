import { useSelector } from 'react-redux'
import Container from '../../components/ui/Container'
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
    <Container className="py-10 text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-8">Tu carrito</h1>

      {items.length === 0 ? (
        <Notice>
          Tu carrito está vacío.
          <div className="mt-4">
            <Button to="/products" variant="outline">
              Ver productos
            </Button>
          </div>
        </Notice>
      ) : (
        <div className="max-w-3xl space-y-6">
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
              Seguir comprando
            </Button>
            <Button to="/checkout">Finalizar compra</Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export default Cart
