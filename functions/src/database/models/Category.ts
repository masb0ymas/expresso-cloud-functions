interface CategoryEntity {
  name: string
  createdAt: Date
  updatedAt: Date
}

export type CategoryAttributes = Omit<CategoryEntity, 'createdAt' | 'updatedAt'>

export const CategoryCollection = 'categories'
