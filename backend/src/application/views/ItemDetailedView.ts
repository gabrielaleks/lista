export abstract class ItemDetailedView {
  constructor(
    public id: string,
    public name: string,
    public itemType: string,
    public wasBought: boolean
  ) { }

  static fromPersistence(data: any): ItemDetailedView {
    switch (data.itemType) {
      case 'UNIT':
        return new UnitItem(
          data.id,
          data.name,
          data.itemType,
          data.wasBought,
          data.totalUnities,
          data.unitPrice,
        )
      case 'KG':
        return new KgItem(
          data.id,
          data.name,
          data.itemType,
          data.wasBought,
          data.totalWeight,
          data.kgPrice
        )
      default:
        throw new Error(`Unknown item type: ${data.itemType}`)
    }
  }
}

export class UnitItem extends ItemDetailedView {
  constructor(
    id: string,
    name: string,
    itemType: string,
    wasBought: boolean,
    public totalUnities: number,
    public unitPrice: number
  ) {
    super(id, name, itemType, wasBought)
  }
}

export class KgItem extends ItemDetailedView {
  constructor(
    id: string,
    name: string,
    itemType: string,
    wasBought: boolean,
    public totalWeight: number,
    public kgPrice: number
  ) {
    super(id, name, itemType, wasBought)
  }
}
