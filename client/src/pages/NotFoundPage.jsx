import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

function NotFoundPage() {
  usePageMeta('Page Not Found', "The page you're looking for doesn't exist.")

  return (
    <div className="flex min-h-[60vh] items-center px-4 py-16 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-md text-center">
        <p className="font-heading text-7xl text-burgundy sm:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl text-ink sm:text-3xl">
          This Page Wandered Off
        </h1>
        <p className="mt-4 text-ink/70">
          We couldn't find the page you were looking for. It may have been
          moved, or the link might be outdated.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-burgundy px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-black/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy"
          >
            Shop the Ivy Bag
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
