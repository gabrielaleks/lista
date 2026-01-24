import { ListDetailedView } from '../../application/views/ListDetailedView'
import { ListSummaryView } from '../../application/views/ListSummaryView'
import { TransactionContext } from '../../utils/DatabaseConnection'
import { List } from '../entities/List'

export interface IListRepository {
  getAllLists(): Promise<ListSummaryView[]>
  getListById(id: string): Promise<ListDetailedView | null>
  createList(list: List, transactionContext?: TransactionContext): Promise<void>
  deleteListById(id: string): Promise<void>
  // update(list: List): Promise<void>
}