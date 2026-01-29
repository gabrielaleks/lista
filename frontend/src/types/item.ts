export const ItemType = {
  UNIT: 'UNIT',
  KG: 'KG'
} as const

export type ItemType = typeof ItemType[keyof typeof ItemType]

export type Item =
  | {
    id: string
    name: string
    itemType: 'UNIT'
    wasBought: boolean
    totalUnities: number
    unitPrice: string
  }
  | {
    id: string
    name: string
    itemType: 'KG'
    wasBought: boolean
    totalWeight: string
    kgPrice: string
  }