import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import route from '@routes/v1'
import { Request, Response } from 'express'
import RoleService from './service'

const RoleServices = new RoleService()

route.get(
  '/role',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await RoleServices.getAll(req)

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

route.get(
  '/role/:id',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { id } = req.getParams()
    const data = await RoleServices.findById(id)

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

route.post(
  '/role',
  asyncHandler(async function created(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await RoleServices.created(formData)

    const httpResponse = HttpResponse.created({ data })
    return res.status(201).json(httpResponse)
  })
)

route.put(
  '/role/:id',
  asyncHandler(async function updated(req: Request, res: Response) {
    const { id } = req.getParams()
    const formData = req.getBody()

    const data = await RoleServices.updated(id, formData)

    const httpResponse = HttpResponse.updated({ data })
    return res.status(200).json(httpResponse)
  })
)

route.delete(
  '/role/:id',
  asyncHandler(async function deleted(req: Request, res: Response) {
    const { id } = req.getParams()

    await RoleServices.deleted(id)

    const httpResponse = HttpResponse.deleted({})
    return res.status(200).json(httpResponse)
  })
)
