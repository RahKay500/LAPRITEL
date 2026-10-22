import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Imported first so Sentry.init runs before anything else renders or fetches.
import './config/sentry.js'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

// Fades out the static splash screen from index.html once the app has
// actually painted (two rAFs, so the browser has drawn the committed
// frame). A fallback timeout guarantees it's gone even if something keeps
// the app from mounting, so a broken render can never leave it stuck.
let splashDismissed = false
function dismissSplash() {
  if (splashDismissed) return
  splashDismissed = true
  const splash = document.getElementById('splash-screen')
  if (!splash) return
  splash.classList.add('splash-hide')
  setTimeout(() => splash.remove(), 400)
}
requestAnimationFrame(() => requestAnimationFrame(dismissSplash))
setTimeout(dismissSplash, 4000)
