import { Request, Response } from 'express'
import { ListService } from '../../application/services/ListService'
import { CreateListDTO } from '../../application/dtos/CreateListDTO'
import { UpdateListDTO } from '../../application/dtos/UpdateListDTO'

export class ListController {
  constructor(private listService: ListService) { }

  async getAllLists(_req: Request, res: Response) {
    const lists = await this.listService.getAllLists()
    res.status(200).json({ data: lists })
  }

  async getListViewById(req: Request, res: Response) {
    const id = req.params.id as string
    const list = await this.listService.getListViewById(id)

    if (!list) {
      res.status(404).json({ message: `Could not find list with id ${id}` })
    }

    res.status(200).json({ data: list })
  }

  async createList(req: Request, res: Response) {
    const { data } = req.body

    const createListDto = CreateListDTO.fromRequest(data)

    const list = await this.listService.createList(createListDto)
    res.status(201).json({ data: list })
  }

  async deleteListById(req: Request, res: Response) {
    const id = req.params.id as string
    const result = await this.listService.deleteListById(id)

    // Service should return structure with code, data etc
    if (result) {
      res.status(200).json({ message: `Deleted list with id ${id}` })
    } else {
      res.status(404).json({ message: `Could not find list with id ${id}` })
    }
  }

  async updateListById(req: Request, res: Response) {
    const { data } = req.body
    const id = req.params.id as string

    const updateListDto = UpdateListDTO.fromRequest(data)
    const list = await this.listService.updateList(id, updateListDto)
    res.status(200).json({ data: list })
  }
}
