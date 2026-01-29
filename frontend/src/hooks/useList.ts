import { useState, useEffect } from 'react'
import { fetchListById } from '../api/list.api'
import type { List } from '../types/list'

export function useList(id: string | undefined) {
  const [list, setList] = useState<List | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const fetchedList = await fetchListById(id)
        setList(fetchedList)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return { list, loading, error }
}