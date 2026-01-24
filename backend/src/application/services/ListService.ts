import { Item } from "../../domain/entities/Item"
import { List } from "../../domain/entities/List"
import { IListRepository } from "../../domain/repositories/IListRepository"
import { DatabaseConnection } from "../../utils/DatabaseConnection"
import { CreateListDTO } from "../dtos/CreateListDTO"
import { UpdateListDTO } from "../dtos/UpdateListDTO"
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

  async getListViewById(id: string): Promise<ListDetailedView | null> {
    const list = await this.listRepository.getListViewById(id)
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

    const addedList = await this.listRepository.getListViewById(list.id)
    return addedList!
  }

  async deleteListById(id: string): Promise<boolean> {
    const list = await this.listRepository.getListViewById(id)

    if (!list) {
      return false
    }

    await this.listRepository.deleteListById(id)
    return true
  }

  async updateList(id: string, updateListDto: UpdateListDTO): Promise<ListDetailedView | null> {
    const list = await this.listRepository.getListDomainById(id)

    if (!list) {
      return null
    }

    const updatedItems = updateListDto.items.map(row => Item.create({
      name: row.name,
      itemType: row.itemType,
      wasBought: row.wasBought,
      totalUnities: row.totalUnities,
      unitPrice: row.unitPrice,
      totalWeight: row.totalWeight,
      kgPrice: row.kgPrice,
    }))

    list.items = updatedItems

    await this.db.transaction(async (transactionContext) => {
      await this.listRepository.updateList(list, transactionContext)
    })

    const updatedList = await this.listRepository.getListViewById(id)
    return updatedList
  }
}
