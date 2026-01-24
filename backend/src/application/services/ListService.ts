import { Item } from "../../domain/entities/Item"
import { List } from "../../domain/entities/List"
import { IListRepository } from "../../domain/repositories/IListRepository"
import { DatabaseConnection } from "../../utils/DatabaseConnection"
import { CreateListDTO } from "../dtos/CreateListDTO"
import { UpdateListDTO } from "../dtos/UpdateListDTO"
import { CommonError } from "../errors/common.errors"
import { ListDetailedView } from "../views/ListDetailedView"
import { ListSummaryView } from "../views/ListSummaryView"
import { ServiceResponse } from "./ServiceResponse"

export class ListService {
  constructor(
    private db: DatabaseConnection,
    private listRepository: IListRepository
  ) { }

  async getAllLists(): Promise<ServiceResponse<ListSummaryView[]>> {
    const lists = await this.listRepository.getAllLists()

    if (!lists) {
      return {
        ok: false,
        error: CommonError.NotFound
      }
    }

    return { ok: true, data: lists }
  }

  async getListViewById(id: string): Promise<ServiceResponse<ListDetailedView | null>> {
    const list = await this.listRepository.getListViewById(id)

    if (!list) {
      return {
        ok: false,
        error: CommonError.NotFound
      }
    }

    return { ok: true, data: list }
  }

  async createList(createListDto: CreateListDTO): Promise<ServiceResponse<ListDetailedView>> {
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
    return { ok: true, data: addedList! }
  }

  async deleteListById(id: string): Promise<ServiceResponse<void>> {
    const list = await this.listRepository.getListViewById(id)

    if (!list) {
      return {
        ok: false,
        error: CommonError.NotFound
      }
    }

    await this.listRepository.deleteListById(id)
    return { ok: true }
  }

  async updateList(id: string, updateListDto: UpdateListDTO): Promise<ServiceResponse<ListDetailedView | null>> {
    const list = await this.listRepository.getListDomainById(id)


    if (!list) {
      return {
        ok: false,
        error: CommonError.NotFound
      }
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
    return { ok: true, data: updatedList }
  }
}
