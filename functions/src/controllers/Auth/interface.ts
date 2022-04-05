export interface DtoSignUp {
  message: string
  data: any
}

export interface DtoLogin {
  message: string
  accessToken: string
  refreshToken: string
  user: {
    uid: string
    fullName: any
    role: any
    email: string
    photoUrl: string | null
  }
}
