import UserService from '@controllers/User/service'
import asyncHandler from '@expresso/helpers/asyncHandler'
import HttpResponse from '@expresso/modules/Response/HttpResponse'
import Authorization from '@middlewares/Authorization'
import route from '@routes/v1'
import { Request, Response } from 'express'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import AuthService from './service'

route.post(
  '/auth/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.signUp(formData)
    const httpResponse = HttpResponse.created(data)

    return res.status(201).json(httpResponse)
  })
)

route.post(
  '/auth/sign-in',
  asyncHandler(async function signIn(req: Request, res: Response) {
    const formData = req.getBody()

    const data = await AuthService.signIn(formData)
    const httpResponse = HttpResponse.get(data)

    return res.status(200).json(httpResponse)
  })
)

route.get(
  '/auth/verify-session',
  Authorization,
  asyncHandler(async function verifySession(req: Request, res: Response) {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const getUser = await UserService.findById(user.uid)

        const httpResponse = HttpResponse.get({ data: getUser })
        return res.status(200).json(httpResponse)
      }

      const message = 'the login session has ended, please re-login'

      const httpResponse = HttpResponse.get({ message })
      return res.status(200).json(httpResponse)
    })
  })
)

route.post(
  '/logout',
  Authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const auth = getAuth()
    await signOut(auth)

    const message = 'You have logged out of the application'

    const httpResponse = HttpResponse.get({ message })
    return res.status(200).json(httpResponse)
  })
)
