export class ListSummaryView {
  constructor(
    public id: string,
    public totalListPrice: number | null,
    public updatedAt: Date,
    public createdAt: Date,
  ) {
  }

  static fromPersistence(data: {
    id: string
    totalListPrice: number | null
    updatedAt: Date
    createdAt: Date
  }): ListSummaryView {
    return new ListSummaryView(
      data.id,
      data.totalListPrice ? Math.round(data.totalListPrice * 100) / 100 : null,
      data.updatedAt,
      data.createdAt,
    )
  }
}
