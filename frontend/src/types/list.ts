import type { Item } from "./item"

export interface List {
  id: string
  createdAt: string
  updatedAt: string
  items?: Item[]
}