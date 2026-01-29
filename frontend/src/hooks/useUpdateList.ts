import { useState } from 'react'
import type { List } from '../types/list'
import { updateListById } from '../api/list.api'

export function useUpdateList() {
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [errorUpdate, setErrorUpdate] = useState<string | null>(null)

  const update = async (list: List) => {
    setLoadingUpdate(true)
    setErrorUpdate(null)

    try {
      const response = await updateListById(list.id, list)
      return response
    } catch (err: any) {
      setErrorUpdate(err.message)
      return null
    } finally {
      setLoadingUpdate(false)
    }
  }
  return { update, loadingUpdate, errorUpdate }
}