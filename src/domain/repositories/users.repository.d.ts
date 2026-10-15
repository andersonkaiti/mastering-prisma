import type { IUser } from '@domain/entities/user.entity.ts'

export interface ICreateUserDTO
  extends Omit<IUser, 'id' | 'birthdate' | 'isActive'> {}

export interface IUpdateUserDTO extends Omit<Partial<IUser>, 'id'> {}

export interface IUpsertUserDTO extends Partial<IUser> {
  name: string
  email: string
}

export interface IGetStatsResponse {
  totalUsers: number
  totalEmails: number
  oldestBirthdate: Date | null
  youngerBirthdate: Date | null
}

export interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<IUser>
  createMany(users: ICreateUserDTO[]): Promise<IUser[]>
  findMany(): Promise<IUser[]>
  findOne(id: IUser['id']): Promise<IUser | null>
  getStats(): Promise<IGetStatsResponse>
  update(id: IUser['id'], user: IUpdateUserDTO): Promise<IUser>
  upsert(user: IUpsertUserDTO): Promise<IUser>
}
