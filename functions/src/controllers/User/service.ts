import { dbAdmin } from '@config/database'
import useFirestoreDate from '@expresso/modules/FirestoreQuery/useFirestoreDate'
import ResponseError from '@expresso/modules/Response/ResponseError'
import { UserCollection } from '@models/User'

class UserService {
  private static readonly _collection = dbAdmin.collection(UserCollection)

  public static async findById(id: string): Promise<any> {
    const snap = await this._collection.doc(id).get()

    if (!snap.exists) {
      throw new ResponseError.NotFound(
        'user data not found or has been deleted'
      )
    }

    const docs = snap.data()
    const data = useFirestoreDate({ id: snap.id, ...docs })

    return data
  }
}

export default UserService
