import asyncHandler from '@expresso/helpers/asyncHandler'
import { formatDateTime } from '@expresso/helpers/Date'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import v1Route from '@routes/v1'
import dotenv from 'dotenv'
import Express, { Request, Response } from 'express'

dotenv.config()

const APP_NAME = process.env.APP_NAME ?? 'expresso cloud functions'

const route = Express.Router()

route.get('/', function indexRoute(req: Request, res: Response) {
  const httpResponse = HttpResponse.get({
    message: APP_NAME,
    maintaner: 'masb0ymas, <n.fajri@outlook.com>',
    source: 'https://github.com/masb0ymas/expresso-cloud-functions',
  })

  return res.status(200).json(httpResponse)
})

route.get(
  '/health',
  asyncHandler(async function getServerHealth(req: Request, res: Response) {
    const startUsage = process.cpuUsage()

    const status = {
      uptime: process.uptime(),
      status: 'Ok',
      timezone: 'ID',
      date: formatDateTime(new Date()),
      node: process.version,
      memory: process.memoryUsage,
      platform: process.platform,
      cpuUsage: process.cpuUsage(startUsage),
    }

    const httpResponse = HttpResponse.get({
      message: 'Server Uptime',
      data: status,
    })
    res.status(200).json(httpResponse)
  })
)

route.get('/v1', function (req: Request, res: Response) {
  throw new ResponseError.Forbidden(
    `Forbidden, wrong access endpoint: ${req.url}`
  )
})

route.use('/v1', v1Route)

route.use('*', function (req: Request, res: Response) {
  throw new ResponseError.NotFound(
    `Sorry, HTTP resource you are looking for was not found.`
  )
})

export default route
