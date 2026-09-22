import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info)
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
            <h1 className="mt-3 font-heading text-2xl text-ink sm:text-3xl">
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
                className="rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
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
