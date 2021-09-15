interface RoleEntity {
  name: string
  createdAt: Date
  updatedAt: Date
}

export type RoleAttributes = Pick<RoleEntity, 'name'>

export const RoleCollection = 'roles'
