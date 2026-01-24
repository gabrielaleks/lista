export class CreateItemDTO {
  constructor(
    public name: string,
    public itemType: string,
    public wasBought: boolean,
    public totalUnities: number,
    public unitPrice: number,
    public totalWeight: number,
    public kgPrice: number,
  ) {
  }

  static fromRequest(data: {
    name: string,
    itemType: string,
    wasBought: boolean,
    totalUnities: number,
    unitPrice: number,
    totalWeight: number,
    kgPrice: number,
  }): CreateItemDTO {
    return new CreateItemDTO(
      data.name,
      data.itemType,
      data.wasBought,
      data.totalUnities,
      data.unitPrice,
      data.totalWeight,
      data.kgPrice,
    )
  }
}
