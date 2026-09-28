import { createSlice } from '@reduxjs/toolkit'

// The cart lives entirely in this browser: it's not tied to the logged-in user and the
// backend never sees it until checkout turns it into a real order.
const STORAGE_KEY = 'amancay:cart'

function loadInitialItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Private browsing / storage disabled: the cart just won't survive a refresh.
  }
}

function clampQuantity(quantity, maxStock) {
  return Math.max(1, Math.min(quantity, maxStock))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadInitialItems(),
  },
  reducers: {
    addItem(state, action) {
      const { variantId, productId, productName, imageUrl, unitPrice, maxStock, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.variantId === variantId)
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + quantity, maxStock)
        existing.maxStock = maxStock
      } else {
        state.items.push({
          variantId,
          productId,
          productName,
          imageUrl,
          unitPrice,
          maxStock,
          quantity: clampQuantity(quantity, maxStock),
        })
      }
      persist(state.items)
    },
    updateQuantity(state, action) {
      const { variantId, quantity } = action.payload
      const item = state.items.find((entry) => entry.variantId === variantId)
      if (item) item.quantity = clampQuantity(quantity, item.maxStock)
      persist(state.items)
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.variantId !== action.payload)
      persist(state.items)
    },
    clear(state) {
      state.items = []
      persist(state.items)
    },
  },
})

export const { addItem, updateQuantity, removeItem, clear } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

export default cartSlice.reducer
