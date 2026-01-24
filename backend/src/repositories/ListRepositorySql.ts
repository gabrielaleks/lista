import { ItemDetailedView } from '../application/views/ItemDetailedView'
import { ListDetailedView } from '../application/views/ListDetailedView'
import { ListSummaryView } from '../application/views/ListSummaryView'
import { List } from '../domain/entities/List'
import { IListRepository } from '../domain/repositories/IListRepository'
import { ItemType } from '../domain/value-objects/ItemType'
import { DatabaseConnection, TransactionContext } from '../utils/DatabaseConnection'
import { v4 as uuidv4 } from 'uuid'

export class ListRepositorySql implements IListRepository {
  constructor(private db: DatabaseConnection) { }

  async getAllLists(): Promise<ListSummaryView[]> {
    const query = `
      SELECT
        id AS id,
        updated_at,
        created_at
      FROM core.li_lists l
    `

    try {
      const result = await this.db.query(query)
      const listsPromises = result.rows.map(async row => {
        const totalListPrice = await this.getTotalListPriceByListId(row.id)

        return ListSummaryView.fromPersistence({
          id: row.id,
          totalListPrice,
          updatedAt: row.updated_at,
          createdAt: row.created_at
        })
      })

      const lists = await Promise.all(listsPromises)

      return lists
    } catch (error: any) {
      throw new Error(`Failed to get all lists, ${error}`)
    }
  }

  async getTotalListPriceByListId(id: string): Promise<number | null> {
    const query = `
      SELECT
        SUM(
          CASE WHEN li.was_bought THEN
            COALESCE(iu.total_quantity * iu.unity_price, 0)
            + COALESCE(ik.total_weight * ik.kg_price, 0)
          ELSE 0 END
        ) AS total_list_price
      FROM core.li_lists l
      JOIN core.li_list_items li ON l.id = li.list_id
      LEFT JOIN core.li_items_unit iu ON li.id = iu.list_items_id
      LEFT JOIN core.li_items_kg ik ON li.id = ik.list_items_id
      WHERE l.id = $1
    `

    try {
      const result = await this.db.query(query, [id])

      if (result.rows.length === 0) {
        return null
      }

      return result.rows[0]['total_list_price']
    } catch (error: any) {
      throw new Error(`Failed to get all lists, ${error}`)
    }
  }

  async getListById(id: string): Promise<ListDetailedView | null> {
    const query = `
      SELECT
        l.id as list_id,
        l.updated_at as list_updated_at,
        l.created_at as list_created_at,
        li.id as item_id,
        li.name as item_name,
        li.type as item_type,
        li.was_bought as item_was_bought,
        iu.total_quantity as unit_total_quantity,
        iu.unity_price as unit_price,
        ik.total_weight as kg_total_weight,
        ik.kg_price as kg_price,
        (COALESCE(iu.total_quantity * iu.unity_price, 0) + COALESCE(ik.total_weight * ik.kg_price, 0)) AS total_item_price
      FROM core.li_lists l
      JOIN core.li_list_items li on l.id = li.list_id
      LEFT JOIN core.li_items_unit iu on li.id = iu.list_items_id
      LEFT JOIN core.li_items_kg ik on li.id = ik.list_items_id
      WHERE l.id = $1
    `

    const totalListPrice = await this.getTotalListPriceByListId(id)

    try {
      const result = await this.db.query(query, [id])

      if (result.rows.length === 0) {
        return null
      }

      const items: ItemDetailedView[] = result.rows.map(row => ItemDetailedView.fromPersistence({
        id: row.item_id,
        name: row.item_name,
        itemType: row.item_type,
        wasBought: row.item_was_bought,
        totalUnities: row.unit_total_quantity,
        unitPrice: row.unit_price,
        totalWeight: row.kg_total_weight,
        kgPrice: row.kg_price,
      }))

      const list: ListDetailedView = ListDetailedView.fromPersistence({
        id: result.rows[0].list_id,
        items: items,
        updatedAt: result.rows[0].list_updated_at,
        createdAt: result.rows[0].list_created_at,
        totalListPrice,
      })

      return list
    } catch (error: any) {
      throw new Error(`Failed to get list by id, ${error}`)
    }
  }

  async createList(list: List, transactionContext?: TransactionContext): Promise<void> {
    const executor = transactionContext ?? this.db

    const createListQuery = `
      INSERT INTO core.li_lists (id, updated_at, created_at)
      VALUES (
          $1,
          $2,
          $3
      )
    `
    const createItemQuery = `
      INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
    `

    const createUnitItemQuery = `
      INSERT INTO core.li_items_unit (id, list_items_id, total_quantity, unity_price)
      VALUES (
        $1,
        $2,
        $3,
        $4
      )
    `

    const createKgItemQuery = `
      INSERT INTO core.li_items_kg (id, list_items_id, total_weight, kg_price)
      VALUES (
        $1,
        $2,
        $3,
        $4
      )
    `

    try {
      await executor.query(
        createListQuery,
        [list.id, list.updatedAt, list.createdAt]
      )

      for (const item of list.items) {
        await executor.query(createItemQuery, [item.id, list.id, item.name, item.getType().getValue(), item.wasBought])

        switch (item.getType()) {
          case ItemType.UNIT:
            await executor.query(createUnitItemQuery, [uuidv4(), item.id, item.getTotalQuantity(), item.getFixedPrice()])
            break
          case ItemType.KG:
            await executor.query(createKgItemQuery, [uuidv4(), item.id, item.getTotalQuantity(), item.getFixedPrice()])
            break
          default:
            throw new Error(`Invalid item type: ${item.getType()}`)
        }
      }
    } catch (error: any) {
      throw new Error(`Failed to create list, ${error}`)
    }
  }

  async deleteListById(id: string): Promise<void> {
    const query = `
      DELETE FROM core.li_lists
      WHERE id = $1
    `

    try {
      await this.db.query(query, [id])
    } catch (error: any) {
      throw new Error(`Failed to delete list, ${error}`)
    }
  }
}
