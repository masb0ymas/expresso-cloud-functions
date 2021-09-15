import * as admin from 'firebase-admin'
import _ from 'lodash'
import { iFilteredQueryProps } from './interface'
import useFiltered from './useFiltered'
import useSorted from './useSorted'

async function useQuery(
  reqQuery: iFilteredQueryProps,
  collection: admin.firestore.CollectionReference
): Promise<
  never[] | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
> {
  const page = reqQuery.page || 1
  const pageSize = reqQuery.pageSize || 10
  const filtered = reqQuery.filtered || []
  const sorted = reqQuery.sorted || []

  // parse query
  const parseSkip = parseInt(page as string)
  const parseLimit = parseInt(pageSize as string)
  const parseFiltered = !_.isEmpty(filtered)
    ? JSON.parse(JSON.stringify(filtered))
    : []
  const parseSorted = !_.isEmpty(sorted)
    ? JSON.parse(JSON.stringify(sorted))
    : []

  // skip or offset
  let skip = (Number(parseSkip) - 1) * Number(parseLimit) || 1
  if (Number(parseSkip) > 1) {
    skip = Number(skip) + 1
  }

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

  const ref = await queryFind.startAt(last).limit(parseLimit).get()
  return ref
}

export default useQuery
