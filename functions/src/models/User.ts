interface UserEntity {
  fullName: string
  email: string
  phone?: string | null
  isActive?: boolean | null
  isBlocked?: boolean | null
  picturePath?: string | null
  Role: string
  createdAt: Date
  updatedAt: Date
}

export type UserAttributes = Omit<UserEntity, 'createdAt' | 'updatedAt'>

export type LoginAttributes = Pick<UserEntity, 'email'> & {
  password: string
}

export const UserCollection = 'users'
