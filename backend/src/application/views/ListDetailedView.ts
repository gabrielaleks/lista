import { ItemDetailedView } from "./ItemDetailedView"

export class ListDetailedView {
  constructor(
    public id: string,
    public totalListPrice: number | null,
    public updatedAt: Date,
    public createdAt: Date,
    public items: ItemDetailedView[] | null,
  ) {
  }

  static fromPersistence(data: {
    id: string,
    totalListPrice: number | null,
    updatedAt: Date,
    createdAt: Date,
    items: ItemDetailedView[] | null,
  }): ListDetailedView {
    return new ListDetailedView(
      data.id,
      data.totalListPrice ? Math.round(data.totalListPrice * 100) / 100 : null,
      data.updatedAt,
      data.createdAt,
      data.items,
    )
  }
}
