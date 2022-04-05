import { dbAdmin } from '@config/database'
import useValidation from '@expresso/hooks/useValidation'
import { DtoPaginate } from '@expresso/modules/FirestoreQuery/interface'
import useFirestoreDate from '@expresso/modules/FirestoreQuery/useFirestoreDate'
import useQuery from '@expresso/modules/FirestoreQuery/useQuery'
import ResponseError from '@expresso/modules/Response/ResponseError'
import {
  CategoryAttributes,
  CategoryCollection,
} from '@database/models/Category'
import { Request } from 'express'
import categorySchema from './schema'

class CategoryService {
  private static readonly _collection = dbAdmin.collection(CategoryCollection)

  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const ref = await useQuery(req, this._collection)

    const docsData: FirebaseFirestore.DocumentData = []
    ref.forEach((doc) => {
      const snap = { id: doc.id, ...doc.data() }
      return docsData.push(snap)
    })

    const data = useFirestoreDate(docsData)

    return { data, total: data.length }
  }

  /**
   *
   * @param id
   * @returns
   */
  public static async findById(id: string): Promise<any> {
    const snap = await this._collection.doc(id).get()

    if (!snap.exists) {
      throw new ResponseError.NotFound(
        'category data not found or has been deleted'
      )
    }

    const docs = snap.data()
    const data = useFirestoreDate({ id: snap.id, ...docs })

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async created(formData: CategoryAttributes): Promise<any> {
    const newFormData = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const value = useValidation(categorySchema.create, newFormData)

    const ref = await this._collection.add(value)
    const snap = await ref.get()
    const data = useFirestoreDate({ id: ref.id, ...snap.data() })

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @returns
   */
  public static async updated(
    id: string,
    formData: CategoryAttributes
  ): Promise<any> {
    const ref = this._collection.doc(id)
    const getOne = await this.findById(id)

    const newFormData = {
      ...formData,
      updatedAt: new Date(),
    }

    const value = useValidation(categorySchema.create, {
      ...getOne,
      ...newFormData,
    })

    await ref.update(value)
    const snap = await ref.get()
    const data = useFirestoreDate({ id: ref.id, ...snap.data() })

    return data
  }

  /**
   *
   * @param id
   */
  public static async deleted(id: string): Promise<void> {
    const data = await this.findById(id)
    console.log({ data })

    await this._collection.doc(id).delete()
  }
}

export default CategoryService
