import { Request } from 'express'
import * as admin from 'firebase-admin'
import _ from 'lodash'
import useFiltered from './useFiltered'
import useSorted from './useSorted'

async function useQuery(
  req: Request,
  collection: admin.firestore.CollectionReference
): Promise<
  never[] | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
> {
  const reqQuery = req.getQuery()

  // query pagination
  const page = Number(reqQuery.page) || 1
  const pageSize = Number(reqQuery.pageSize) || 10

  // query filter
  const filtered = _.get(reqQuery, 'filtered', '[]')
  const parseFiltered = JSON.parse(filtered)

  // query sort
  const sorted = _.get(reqQuery, 'sorted', '[]')
  const parseSorted = JSON.parse(sorted)

  // skip or offset
  let skip = (page - 1) * pageSize || 1
  if (page > 1) skip = Number(skip) + 1

  // filtered query
  let queryFind = parseFiltered
    ? useFiltered({
        query: collection,
        queryFiltered: parseFiltered,
      })
    : collection

  queryFind = sorted
    ? useSorted({ query: queryFind, querySorted: parseSorted })
    : queryFind

  const first = await queryFind.limit(skip).get()
  if (first.docs.length <= 0 || first.docs.length < skip) {
    return []
  }
  const last = first.docs[first.docs.length - 1]

  const ref = await queryFind.startAt(last).limit(pageSize).get()
  return ref
}

export default useQuery
