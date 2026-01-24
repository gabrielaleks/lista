import { CreateItemDTO } from "./CreateItemDTO"

export class CreateListDTO {
  constructor(
    public items: CreateItemDTO[],
  ) {
  }

  static fromRequest(data: {
    items: any[],
  }): CreateListDTO {
    const items = data.items.map(row => CreateItemDTO.fromRequest({
      name: row.name,
      itemType: row.itemType,
      wasBought: row.wasBought,
      totalUnities: row.totalUnities,
      unitPrice: row.unitPrice,
      totalWeight: row.totalWeight,
      kgPrice: row.kgPrice
    }))

    return new CreateListDTO(items)
  }
}
