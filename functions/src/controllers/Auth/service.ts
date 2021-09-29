import { dbAdmin } from '@config/database'
import userSchema from '@controllers/User/schema'
import useValidation from '@expresso/hooks/useValidation'
import useFirestoreDate from '@expresso/modules/FirestoreQuery/useFirestoreDate'
import { LoginAttributes, UserAttributes, UserCollection } from '@models/User'
import * as admin from 'firebase-admin'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'

interface DtoSignUp {
  message: string
  data: any
}

interface DtoLogin {
  message: string
  accessToken: string
  refreshToken: string
  user: {
    uid: string
    fullName: any
    role: any
    email: string
    photoUrl: string | null
  }
}

class AuthService {
  private static readonly _collection = dbAdmin.collection(UserCollection)

  /**
   *
   * @param email
   * @returns
   */
  public static async getUserByEmail(
    email: string
  ): Promise<admin.auth.UserRecord> {
    const getUser = await admin.auth().getUserByEmail(email)

    return getUser
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async signUp(formData: UserAttributes): Promise<DtoSignUp> {
    const validateUser = useValidation(userSchema.register, formData)

    // create user auth
    const auth = getAuth()
    const createUser = await createUserWithEmailAndPassword(
      auth,
      validateUser.email,
      // @ts-expect-error
      validateUser.confirmNewPassword
    )

    const UserId = createUser?.user?.uid

    await admin.auth().setCustomUserClaims(UserId, {
      name: formData.fullName,
      role: formData.role,
    })

    if (validateUser.newPassword ?? validateUser.confirmNewPassword) {
      delete validateUser.newPassword
      delete validateUser.confirmNewPassword
    }

    const newFormData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const value = useValidation(userSchema.create, newFormData)

    // save to db
    const ref = this._collection.doc(UserId)
    await ref.set(value, { merge: true })

    // get data sign up
    const snap = await ref.get()
    const data = useFirestoreDate({ id: ref.id, ...snap.data() })

    return { message: 'Register account successfully', data }
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async signIn(formData: LoginAttributes): Promise<DtoLogin> {
    const getUser = await this.getUserByEmail(formData.email)

    await admin.auth().setCustomUserClaims(getUser.uid, {
      name: getUser.customClaims?.name,
      role: getUser.customClaims?.role,
    })

    // sign in user auth
    const auth = getAuth()
    const data = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    )

    const accessToken = await data.user.getIdToken()
    const refreshToken = data.user.refreshToken

    // return user data
    const user = {
      uid: getUser.uid,
      fullName: getUser.customClaims?.name,
      role: getUser.customClaims?.role,
      email: formData.email,
      photoUrl: data.user.photoURL,
    }

    return { message: 'Login successfully', accessToken, refreshToken, user }
  }
}

export default AuthService
