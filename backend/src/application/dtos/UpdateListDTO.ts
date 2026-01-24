import { UpdateItemDTO } from "./UpdateItemDTO"

export class UpdateListDTO {
  constructor(
    public items: UpdateItemDTO[],
  ) {
  }

  static fromRequest(data: {
    items: any[],
  }): UpdateListDTO {
    const items = data.items.map(row => UpdateItemDTO.fromRequest({
      name: row.name,
      itemType: row.itemType,
      wasBought: row.wasBought,
      totalUnities: row.totalUnities,
      unitPrice: row.unitPrice,
      totalWeight: row.totalWeight,
      kgPrice: row.kgPrice
    }))

    return new UpdateListDTO(items)
  }
}
