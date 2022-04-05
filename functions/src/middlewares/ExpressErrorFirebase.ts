import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

async function ExpressErrorFirebase(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  console.log({ err }, err.code)

  if (_.isString(err.code)) {
    if (err.code?.startsWith('auth/')) {
      return res.status(400).json({
        code: 400,
        message: err.message,
      })
    }

    if (err.code?.startsWith('messaging/')) {
      return res.status(400).json({
        code: 400,
        message: err.message,
      })
    }
  } else {
    return res.status(500).json({
      code: 500,
      message: err?.message ?? err?.details,
    })
  }

  next(err)
}

export default ExpressErrorFirebase
