import HttpResponse from '@expresso/modules/Response/HttpResponse'
import ResponseError from '@expresso/modules/Response/ResponseError'
import dotenv from 'dotenv'
import v1Route from '@routes/v1'
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

route.get('/v1', function (req: Request, res: Response) {
  throw new ResponseError.Forbidden(
    `Forbidden, wrong access endpoint: ${req.url}`
  )
})

route.use('/v1', v1Route)

export default route
