interface RoleEntity {
  name: string
  createdAt: Date
  updatedAt: Date
}

export type RoleAttributes = Omit<RoleEntity, 'createdAt' | 'updatedAt'>

export const RoleCollection = 'roles'
