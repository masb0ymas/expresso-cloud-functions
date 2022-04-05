import { currentToken } from '@expresso/helpers/Token'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import { NextFunction, Request, Response } from 'express'
import * as admin from 'firebase-admin'
import _ from 'lodash'

async function Authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const getToken = currentToken(req)

  if (_.isEmpty(getToken)) {
    const httpResponse = HttpResponse.get({
      code: 401,
      message: 'Unauthorized, token not found!',
    })
    return res.status(401).json(httpResponse)
  }

  try {
    const decodeToken = await admin.auth().verifyIdToken(getToken)
    const userLogin = { uid: decodeToken.uid }

    req.setState({ userLogin })

    next()
  } catch (err: any) {
    if (err.code ?? err.code.startsWith('auth/')) {
      const httpResponse = HttpResponse.get({
        code: 401,
        message: 'the login session has ended, please re-login',
        original: err.message,
      })
      return res.status(401).json(httpResponse)
    }
  }
}

export default Authorization
