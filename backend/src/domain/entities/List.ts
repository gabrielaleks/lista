import { validate as isUUID } from 'uuid'
import { v4 as uuidv4 } from 'uuid'
import { Item } from './Item'

export class List {
  public id: string
  public items: Item[]
  public updatedAt: Date
  public createdAt: Date

  constructor(
    id: string,
    items: Item[],
    updatedAt: Date,
    createdAt: Date,
  ) {
    if (!isUUID(id)) {
      throw new Error('Id must be UUID')
    }

    this.id = id
    this.items = items
    this.updatedAt = updatedAt
    this.createdAt = createdAt
  }

  static create(data: {
    items: Item[]
  }) {
    return new List(
      uuidv4(),
      data.items,
      new Date(),
      new Date(),
    )
  }

  static fromPersistence(data: {
    id: string,
    items: Item[],
    updatedAt: Date,
    createdAt: Date
  }): List {
    return new List(
      data.id,
      data.items,
      data.updatedAt,
      data.createdAt
    )
  }
}
