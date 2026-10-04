import { useEffect, useState } from 'react'

export function usePagedList(fetchPage, pageSize = 25) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadFirstPage() {
      try {
        const data = await fetchPage({ page: 1, limit: pageSize })
        if (ignore) return
        setHasMore(data.length === pageSize)
        setItems(data)
        setPage(1)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadFirstPage()
    return () => {
      ignore = true
    }
  }, [fetchPage, pageSize])

  async function loadMore() {
    setIsLoadingMore(true)
    setError('')
    try {
      const data = await fetchPage({ page: page + 1, limit: pageSize })
      setHasMore(data.length === pageSize)
      setItems((current) => [...current, ...data])
      setPage((current) => current + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return { items, setItems, hasMore, isLoading, isLoadingMore, error, setError, loadMore }
}
