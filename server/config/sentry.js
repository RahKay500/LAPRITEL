import * as Sentry from '@sentry/node'

// Error monitoring is opt-in: set SENTRY_DSN to activate it. Without it this
// is a no-op, same pattern as email (utils/email.js) and Redis rate limiting
// (middleware/rateLimiter.js) elsewhere in this codebase -- optional
// third-party services degrade gracefully instead of requiring every
// environment (local dev, CI) to configure them.
//
// Imported as the first line of app.js so Sentry.init runs before any other
// module loads, which is what its instrumentation needs to auto-capture
// errors from those modules.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Auto-instrumented performance tracing needs Sentry loaded via Node's
    // --import flag under ESM ("type": "module" in package.json), which
    // isn't possible on Vercel's serverless runtime (it controls how the
    // function is invoked, not us). Error capture below doesn't depend on
    // that instrumentation and works regardless, so tracing is left off
    // rather than shipping a half-working version of it.
    tracesSampleRate: 0,
  })
}

export { Sentry }
