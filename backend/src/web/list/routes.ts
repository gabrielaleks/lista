import express, { Router } from 'express'
import { ListController } from './ListController'
import { ListRepositorySql } from '../../repositories/ListRepositorySql'
import { DatabaseConnection } from '../../utils/DatabaseConnection'
import { ListService } from '../../application/services/ListService'

export function createRouter(db: DatabaseConnection): Router {
  const router = express.Router()

  const listRepoSql = new ListRepositorySql(db)
  const listService = new ListService(db, listRepoSql)
  const controller = new ListController(listService)

  router.get('/lists', controller.getAllLists.bind(controller))
  router.get('/lists/:id', controller.getListViewById.bind(controller))
  router.post('/lists', controller.createList.bind(controller))
  router.delete('/lists/:id', controller.deleteListById.bind(controller))
  router.put('/lists/:id', controller.updateListById.bind(controller))

  return router
}