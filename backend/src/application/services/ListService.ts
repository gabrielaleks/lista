import { Item } from "../../domain/entities/Item"
import { List } from "../../domain/entities/List"
import { IListRepository } from "../../domain/repositories/IListRepository"
import { DatabaseConnection } from "../../utils/DatabaseConnection"
import { CreateListDTO } from "../dtos/CreateListDTO"
import { ListDetailedView } from "../views/ListDetailedView"
import { ListSummaryView } from "../views/ListSummaryView"

export class ListService {
  constructor(
    private db: DatabaseConnection,
    private listRepository: IListRepository
  ) { }

  async getAllLists(): Promise<ListSummaryView[]> {
    const lists = await this.listRepository.getAllLists()
    return lists
  }

  async getListById(id: string): Promise<ListDetailedView | null> {
    const list = await this.listRepository.getListById(id)
    return list
  }

  async createList(createListDto: CreateListDTO): Promise<ListDetailedView> {
    const items = createListDto.items.map(row => Item.create({
      name: row.name,
      itemType: row.itemType,
      wasBought: row.wasBought,
      totalUnities: row.totalUnities,
      unitPrice: row.unitPrice,
      totalWeight: row.totalWeight,
      kgPrice: row.kgPrice,
    }))

    const list = List.create({ items })

    await this.db.transaction(async (transactionContext) => {
      await this.listRepository.createList(list, transactionContext)
    })

    const addedList = await this.listRepository.getListById(list.id)
    return addedList!
  }

  async deleteListById(id: string): Promise<boolean> {
    const list = await this.listRepository.getListById(id)

    if (!list) {
      return false
    }

    await this.listRepository.deleteListById(id)
    return true
  }
}
