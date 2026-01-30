import { useState } from 'react'
import { deleteListById } from '../api/list.api'

export function useRemoveList() {
  const [loadingRemove, setLoadingRemove] = useState(false)
  const [errorRemove, setErrorRemove] = useState<string | null>(null)

  const remove = async (id: string) => {
    setLoadingRemove(true)
    setErrorRemove(null)

    try {
      const response = await deleteListById(id)
      return response
    } catch (err: any) {
      setErrorRemove(err.message)
      return null
    } finally {
      setLoadingRemove(false)
    }
  }
  return { remove, loadingRemove, errorRemove }
}