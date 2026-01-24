import { Request, Response } from 'express'
import { ListService } from '../../application/services/ListService'
import { CreateListDTO } from '../../application/dtos/CreateListDTO'

export class ListController {
  constructor(private listService: ListService) { }

  async getAllLists(_req: Request, res: Response) {
    const lists = await this.listService.getAllLists()
    res.status(200).json({ data: lists })
  }

  async getListById(req: Request, res: Response) {
    const id = req.params.id as string
    const list = await this.listService.getListById(id)
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

    if (result) {
      res.status(200).json({ message: `Deleted list with id ${id}` })
    } else {
      res.status(404).json({ message: `Could not find list with id ${id}` })
    }
  }

  // ao invés de deletar lista E items, devo deletar só os itens e adicionar os novos
  // na lista já existente
  async updateListById(req: Request, res: Response) {
    const { data } = req.body
    const id = req.params.id as string

    const result = await this.listService.deleteListById(id)

    if (!result) {
      res.status(404).json({ message: `Could not find list with id ${id}` })
    } else {
      const createListDto = CreateListDTO.fromRequest(data)
      const list = await this.listService.createList(createListDto)
      res.status(200).json({ data: list })
    }
  }
}
