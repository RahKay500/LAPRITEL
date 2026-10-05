import { Navigate, Route, Routes } from 'react-router-dom'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CartDrawer from './components/CartDrawer'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import MyOrdersPage from './pages/MyOrdersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import RefundPolicyPage from './pages/RefundPolicyPage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import FeaturedPage from './pages/FeaturedPage'
import FaqPage from './pages/FaqPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminFeaturedPage from './pages/admin/AdminFeaturedPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <MyOrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="featured" element={<AdminFeaturedPage />} />
            <Route path="*" element={<Navigate to="orders" replace />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default App
