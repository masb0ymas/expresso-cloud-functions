import { UseSortedProps } from './interface'

function useSorted(
  props: UseSortedProps
): FirebaseFirestore.Query<FirebaseFirestore.DocumentData> {
  if (!props.querySorted || !props.querySorted[0]?.id) {
    return props.query
  }

  const { id, desc = true } = props.querySorted[0]
  const sortType = desc ? 'desc' : 'asc'

  return props.query.orderBy(id, sortType)
}

export default useSorted
