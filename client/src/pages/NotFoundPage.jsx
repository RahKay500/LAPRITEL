import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

function NotFoundPage() {
  usePageMeta('Page Not Found', "The page you're looking for doesn't exist.")

  return (
    <div className="flex min-h-[60vh] items-center px-4 py-16 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-md text-center">
        <p className="text-7xl font-extrabold text-burgundy sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
          This Page Wandered Off
        </h1>
        <p className="mt-4 text-ink/70">
          We couldn't find the page you were looking for. It may have been
          moved, or the link might be outdated.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/"
            className="rounded-full border-2 border-burgundy px-8 py-3 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white"
          >
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-semibold uppercase tracking-wide text-ink/70 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
          >
            Shop All Bags
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
