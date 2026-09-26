import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import categoriesReducer from './slices/categoriesSlice'
import authReducer from './slices/authSlice'
import addressesReducer from './slices/addressesSlice'
import favoritesReducer from './slices/favoritesSlice'
import myReviewsReducer from './slices/myReviewsSlice'
import adminUsersReducer from './slices/adminUsersSlice'
import adminReviewsReducer from './slices/adminReviewsSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    auth: authReducer,
    addresses: addressesReducer,
    favorites: favoritesReducer,
    myReviews: myReviewsReducer,
    adminUsers: adminUsersReducer,
    adminReviews: adminReviewsReducer,
  },
})
