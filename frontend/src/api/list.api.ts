import axios from "axios"
import type { List } from "../types/list"

const client = axios.create({ baseURL: '/api' })

export async function fetchLists(): Promise<List[]> {
  const response = await client.get(`/lists`)

  return response.data.data
}

export async function fetchListById(id: string): Promise<List> {
  const response = await client.get(`/lists/${id}`)

  return response.data.data
}

export async function updateListById(id: string, list: List): Promise<List> {
  const response = await client.put(`/lists/${id}`, { data: list })

  return response.data.data
}

export async function deleteListById(id: string): Promise<List> {
  const response = await client.delete(`/lists/${id}`)

  return response.data.message
}

export async function createList(list: List): Promise<List> {
  const response = await client.post(`/lists/`, { data: list })

  return response.data.data
}