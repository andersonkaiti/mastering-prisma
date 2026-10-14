export interface IUser {
  id: string
  name: string
  email: string | null
  birthdate: Date | null
  isActive: boolean
}
