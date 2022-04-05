import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/v1'
import { Request, Response } from 'express'
import CategoryService from './service'

route.get(
  '/category',
  asyncHandler(async function findAll(req: Request, res: Response) {
    const data = await CategoryService.findAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/category/:id',
  asyncHandler(async function findById(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await CategoryService.findById(id)

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/category',
  Authorization,
  asyncHandler(async function created(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await CategoryService.created(formData)

    const httpResponse = HttpResponse.created({ data })
    res.status(201).json(httpResponse)
  })
)

route.put(
  '/category/:id',
  Authorization,
  asyncHandler(async function updated(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await CategoryService.updated(id, formData)

    const httpResponse = HttpResponse.updated({ data })
    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/category/:id',
  Authorization,
  asyncHandler(async function deleted(req: Request, res: Response) {
    const { id } = req.getParams()

    await CategoryService.deleted(id)

    const httpResponse = HttpResponse.deleted({})
    res.status(200).json(httpResponse)
  })
)
