import { Component } from 'react'
import { Sentry } from '../config/sentry.js'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info)
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.assign('/')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center px-4 py-16 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-md text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-burgundy">
              Something Went Wrong
            </p>
            <h1 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
              We Hit a Snag
            </h1>
            <p className="mt-4 text-ink/70">
              Sorry about that — something on this page didn't load right.
              Please try again, or head back to the homepage.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
