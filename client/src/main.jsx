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

// Fades out the static splash screen from index.html. It's a deliberate
// brand moment, not just a loading indicator, so it stays up for at least
// SPLASH_MIN_MS even when the app paints instantly -- but never longer than
// it has to: it still waits for the app to actually paint (two rAFs, so the
// browser has drawn the committed frame) before dismissing once that
// minimum has passed. A hard fallback guarantees it's gone even if
// something keeps the app from mounting at all, so a broken render can
// never leave it stuck on screen.
const SPLASH_MIN_MS = 2200
const SPLASH_MAX_MS = 6000

let splashDismissed = false
function dismissSplash() {
  if (splashDismissed) return
  splashDismissed = true
  const splash = document.getElementById('splash-screen')
  if (!splash) return
  splash.classList.add('splash-hide')
  setTimeout(() => splash.remove(), 400)
}

const appPainted = new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve))
})
const minimumShown = new Promise((resolve) => setTimeout(resolve, SPLASH_MIN_MS))
Promise.all([appPainted, minimumShown]).then(dismissSplash)
setTimeout(dismissSplash, SPLASH_MAX_MS)
