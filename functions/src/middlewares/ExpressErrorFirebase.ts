import { NextFunction, Request, Response } from 'express'

async function ExpressErrorFirebase(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
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

  next(err)
}

export default ExpressErrorFirebase
