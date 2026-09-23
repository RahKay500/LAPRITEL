import * as Sentry from '@sentry/react'

// Error monitoring is opt-in: set VITE_SENTRY_DSN to activate it. Without it
// this is a no-op, same pattern as the server side (server/config/sentry.js)
// and the optional third-party services already handled this way elsewhere
// in the codebase (email, Redis rate limiting).
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  })
}

export { Sentry }
