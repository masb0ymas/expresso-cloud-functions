import * as admin from 'firebase-admin'

export interface iFilteredProps {
  id: string
  value: string
}

export interface iSortedProps {
  id: string
  desc: boolean
}

export interface iFilteredQueryProps {
  page: string | number
  pageSize: string | number
  filtered: iFilteredProps[] | string
  sorted: iSortedProps[] | string
}

export interface DtoPaginate {
  data: any[]
  total: number
}

export interface UseFilterableProps {
  query: admin.firestore.Query
  queryFiltered: iFilteredProps[]
}

export interface UseSortedProps {
  query: admin.firestore.Query
  querySorted: iSortedProps[]
}

export type TypeOperator =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in'
  | 'pref' // preffix
  | 'betweenDate'
  | 'month-year'
  | 'year'
  | 'atDate'
  | 'beforeDate'
  | 'afterDate'
  | 'match'
