import axios from "axios"
import type { List } from "../types/list"

const API_BASE = import.meta.env.VITE_API_URL + '/api'

export async function fetchLists(): Promise<List[]> {
  const client = axios.create({ baseURL: API_BASE })
  const response = await client.get(`${API_BASE}/lists`)

  return response.data.data
}

export async function fetchListById(id: string): Promise<List> {
  const client = axios.create({ baseURL: API_BASE })
  const response = await client.get(`${API_BASE}/lists/${id}`)

  return response.data.data
}