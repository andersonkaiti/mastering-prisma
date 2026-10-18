import type { IOrderWithProducts } from './order.entity.ts'
import type { IProfile } from './profile.entity.ts'

export interface IUser {
  id: string
  name: string
  email: string | null
  birthdate: Date | null
  isActive: boolean
  affiliationId: string | null
}

export interface IUserWithRelations extends IUser {
  profile: IProfile | null
  orders: IOrderWithProducts[]
  affiliated: IUser | null
  affiliations: IUser[]
}
