import type { IUser } from '@domain/entities/user.entity.ts'

export interface IUsersRepository {
  create(user: IUser): Promise<IUser>
  createMany(users: IUser[]): Promise<IUser[]>
}
