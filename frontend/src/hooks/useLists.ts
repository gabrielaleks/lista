import { useState, useEffect } from 'react'
import { fetchLists } from '../api/list.api'
import type { List } from '../types/list'

export function useLists() {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLists()
      .then(fetchedLists => {
        const sortedLists = fetchedLists.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setLists(sortedLists)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { lists, loading, error }
}