import axios from "axios"
import type { List } from "../types/list"

const API_BASE = import.meta.env.VITE_API_URL + '/api'
const client = axios.create({ baseURL: API_BASE })

export async function fetchLists(): Promise<List[]> {
  const response = await client.get(`${API_BASE}/lists`)

  return response.data.data
}

export async function fetchListById(id: string): Promise<List> {
  const response = await client.get(`${API_BASE}/lists/${id}`)

  return response.data.data
}

export async function updateListById(id: string, list: List): Promise<List> {
  const response = await client.put(`${API_BASE}/lists/${id}`, { data: list })

  return response.data.data
}

export async function deleteListById(id: string): Promise<List> {
  const response = await client.delete(`${API_BASE}/lists/${id}`)

  return response.data.message
}