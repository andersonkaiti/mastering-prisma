import type { IUser } from '@domain/entities/user.entity.ts'

export interface ICreateUserDTO
  extends Omit<IUser, 'id' | 'birthdate' | 'isActive'> {}

export interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<IUser>
  createMany(users: ICreateUserDTO[]): Promise<IUser[]>
  findMany(): Promise<IUser[]>
}
