import { Navigate, Route, Routes } from 'react-router-dom'
import AuthListener from './components/auth/AuthListener'
import RequireAuth from './components/auth/RequireAuth'
import RequireAdmin from './components/auth/RequireAdmin'
import MainLayout from './layouts/MainLayout'
import AccountLayout from './layouts/AccountLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import Profile from './pages/Account/Profile/Profile'
import Addresses from './pages/Account/Addresses/Addresses'
import Favorites from './pages/Account/Favorites/Favorites'
import MyReviews from './pages/Account/MyReviews/MyReviews'
import Orders from './pages/Account/Orders/Orders'
import OrderDetail from './pages/Account/Orders/OrderDetail'
import Users from './pages/Admin/Users/Users'
import Reviews from './pages/Admin/Reviews/Reviews'

function App() {
  return (
    <>
      <AuthListener />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<Profile />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
            </Route>
          </Route>

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/users" replace />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
