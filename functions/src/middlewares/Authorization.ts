import UserService from '@controllers/User/service'
import { currentToken } from '@expresso/helpers/Token'
import { NextFunction, Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { isEmpty } from 'lodash'

async function Authorization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> {
  const getToken = currentToken(req)

  if (isEmpty(getToken)) {
    return res.status(401).json({ message: 'Unauthorized, token not found!' })
  }

  try {
    const decodeToken = await admin.auth().verifyIdToken(getToken)
    const userData = await UserService.findById(decodeToken.uid)

    const user = {
      uid: decodeToken.uid,
      name: userData.fullName,
      Role: userData.Role,
      email: userData.email,
    }

    req.setState({ user })

    next()
  } catch (err: any) {
    if (err.code ?? err.code.startsWith('auth/')) {
      return res.status(400).json({
        code: 400,
        message: err.message,
      })
    }
  }
}

export default Authorization
