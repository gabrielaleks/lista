import { Request, Response } from 'express'
import { ListService } from '../../application/services/ListService'
import { CreateListDTO } from '../../application/dtos/CreateListDTO'
import { UpdateListDTO } from '../../application/dtos/UpdateListDTO'
import { CommonError } from '../../application/errors/common.errors'

export class ListController {
  constructor(private listService: ListService) { }

  async getAllLists(_req: Request, res: Response) {
    const result = await this.listService.getAllLists()

    if (result.ok) {
      res.status(200).json({ data: result.data })
      return
    }

    switch (result.error) {
      case CommonError.NotFound:
        res.status(404).json({ message: `No lists found in database` })
        break;
      default:
        res.status(500).json({ message: `Unexpected error` })
        break;
    }
  }

  async getListViewById(req: Request, res: Response) {
    const id = req.params.id as string
    const result = await this.listService.getListViewById(id)

    if (result.ok) {
      res.status(200).json({ data: result.data })
      return
    }

    switch (result.error) {
      case CommonError.NotFound:
        res.status(404).json({ message: `Could not find list with id ${id}` })
        break;
      default:
        res.status(500).json({ message: `Unexpected error` })
        break;
    }
  }

  async createList(req: Request, res: Response) {
    const { data } = req.body

    const createListDto = CreateListDTO.fromRequest(data)

    const result = await this.listService.createList(createListDto)

    if (result.ok) {
      res.status(201).json({ data: result.data })
      return
    }

    switch (result.error) {
      default:
        res.status(500).json({ message: `Unexpected error` })
        break;
    }
  }

  async deleteListById(req: Request, res: Response) {
    const id = req.params.id as string
    const result = await this.listService.deleteListById(id)

    if (result.ok) {
      res.status(200).json({ message: `Deleted list with id ${id}` })
      return
    }

    switch (result.error) {
      case CommonError.NotFound:
        res.status(404).json({ message: `Could not find list with id ${id}` })
        break;
      default:
        res.status(500).json({ message: `Unexpected error` })
        break;
    }
  }

  async updateListById(req: Request, res: Response) {
    const { data } = req.body
    const id = req.params.id as string

    const updateListDto = UpdateListDTO.fromRequest(data)
    const result = await this.listService.updateList(id, updateListDto)

    if (result.ok) {
      res.status(200).json({ data: result.data })
      return
    }

    switch (result.error) {
      case CommonError.NotFound:
        res.status(404).json({ message: `Could not find list with id ${id}` })
        break;
      default:
        res.status(500).json({ message: `Unexpected error` })
        break;
    }
  }
}
