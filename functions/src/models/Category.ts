interface CategoryEntity {
  name: string
  createdAt: Date
  updatedAt: Date
}

export type CategoryAttributes = Pick<CategoryEntity, 'name'>

export const CategoryCollection = 'categories'
