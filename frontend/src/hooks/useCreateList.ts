import { useState } from 'react'
import type { List } from '../types/list'
import { createList } from '../api/list.api'

export function useCreateList() {
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [errorCreate, setErrorCreate] = useState<string | null>(null)

  const create = async (list: List) => {
    setLoadingCreate(true)
    setErrorCreate(null)

    try {
      const response = await createList(list)
      return response
    } catch (err: any) {
      setErrorCreate(err.message)
      return null
    } finally {
      setLoadingCreate(false)
    }
  }
  return { create, loadingCreate, errorCreate }
}