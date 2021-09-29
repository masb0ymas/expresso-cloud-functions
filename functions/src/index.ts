import 'module-alias/register'
import './pathAlias'

import { dbConfig } from '@config/database'
import winstonLogger, { winstonStream } from '@config/Logger'
import withState from '@expresso/helpers/withState'
import ExpressErrorFirebase from '@middlewares/ExpressErrorFirebase'
import ExpressErrorResponse from '@middlewares/ExpressErrorResponse'
import ExpressErrorYup from '@middlewares/ExpressErrorYup'
import indexRoute from '@routes/index'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import Cors from 'cors'
import dotenv from 'dotenv'
import Express, { Application, NextFunction, Request, Response } from 'express'
import * as functions from 'firebase-functions'
import { initializeApp } from 'firebase/app'
import fs from 'fs'
import Helmet from 'helmet'
import hpp from 'hpp'
import Logger from 'morgan'
import path from 'path'

dotenv.config()

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  throw new Error(
    'Missing env!!!\nCopy / Duplicate ".env.example" root directory to ".env"'
  )
}

// initial application
const app: Application = Express()
initializeApp(dbConfig)

// Plugins
app.use(Helmet())
app.use(Cors({ origin: '*' }))
app.use(Logger('combined', { stream: winstonStream }))
app.use(Express.urlencoded({ extended: true }))
app.use(Express.json({ limit: '200mb', type: 'application/json' }))
app.use(cookieParser())
app.use(compression())
app.use(hpp())
app.use(function (req: Request, res: Response, next: NextFunction) {
  new withState(req)
  next()
})

// Route
app.use(indexRoute)

// Error handler
app.use(ExpressErrorYup)
app.use(ExpressErrorFirebase)
app.use(ExpressErrorResponse)

app.use(function (err: any, req: Request, res: Response) {
  // Set locals, only providing error in development
  res.locals.message = err?.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Add this line to include winston logging
  winstonLogger.error(
    `${err?.status || 500} - ${err?.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  )

  // Render the error page
  res.status(err?.status || 500)
  res.render('error')
})

const api = functions.region('asia-southeast2').https.onRequest(app)
export { api }
