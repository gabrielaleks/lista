import { ItemType } from "../value-objects/ItemType"
import { v4 as uuidv4 } from 'uuid'

export abstract class Item {
  constructor(
    public id: string,
    public name: string,
    public wasBought: boolean
  ) { }

  abstract getType(): ItemType
  abstract getTotalQuantity(): number
  abstract getFixedPrice(): number

  static create(data: any): Item {
    switch (data.itemType) {
      case 'UNIT':
        return new UnitItem(
          uuidv4(),
          data.name,
          data.wasBought,
          data.totalUnities,
          data.unitPrice
        )
      case 'KG':
        return new KgItem(
          uuidv4(),
          data.name,
          data.wasBought,
          data.totalWeight,
          data.kgPrice
        )
      default:
        throw new Error(`Unknown item itemType: ${data.itemType}`)
    }
  }

  static fromPersistence(data: any): Item {
    switch (data.itemType) {
      case 'UNIT':
        return new UnitItem(
          data.id,
          data.name,
          data.wasBought,
          data.totalUnities,
          data.unitPrice
        )
      case 'KG':
        return new KgItem(
          data.id,
          data.name,
          data.wasBought,
          data.totalWeight,
          data.kgPrice
        )
      default:
        throw new Error(`Unknown item itemType: ${data.itemType}`)
    }
  }
}

export class UnitItem extends Item {
  itemType: string = 'UNIT'

  constructor(
    id: string,
    name: string,
    wasBought: boolean,
    public totalUnities: number,
    public unitPrice: number
  ) {
    super(id, name, wasBought)
  }

  getType(): ItemType {
    return ItemType.UNIT
  }

  getTotalQuantity(): number {
    return this.totalUnities
  }

  getFixedPrice(): number {
    return this.unitPrice
  }
}

export class KgItem extends Item {
  itemType: string = 'KG'

  constructor(
    id: string,
    name: string,
    wasBought: boolean,
    public totalWeight: number,
    public kgPrice: number
  ) {
    super(id, name, wasBought)
  }

  getType(): ItemType {
    return ItemType.KG
  }

  getTotalQuantity(): number {
    return this.totalWeight
  }

  getFixedPrice(): number {
    return this.kgPrice
  }
}
