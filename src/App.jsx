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
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import Profile from './pages/Account/Profile/Profile'
import Addresses from './pages/Account/Addresses/Addresses'
import Favorites from './pages/Account/Favorites/Favorites'
import MyReviews from './pages/Account/MyReviews/MyReviews'
import Users from './pages/Admin/Users/Users'
import Reviews from './pages/Admin/Reviews/Reviews'
import AdminProducts from './pages/Admin/Products/AdminProducts'
import ProductEdit from './pages/Admin/Products/ProductEdit'
import Categories from './pages/Admin/Categories/Categories'
import Discounts from './pages/Admin/Discounts/Discounts'
import Orders from './pages/Admin/Orders/Orders'

function App() {
  return (
    <>
      <AuthListener />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<Profile />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="reviews" element={<MyReviews />} />
            </Route>
          </Route>
        </Route>

        {/* Admin has its own chrome (top nav, no store navbar/footer). */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductEdit />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
