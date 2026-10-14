import type { IUser } from '@domain/entities/user.entity.ts'
import type {
  ICreateUserDTO,
  IUsersRepository,
} from '@domain/repositories/users.repository.d.ts'
import { prisma } from '@infra/database/prisma/index.ts'

export class UsersRepository implements IUsersRepository {
  async create({ name, email }: ICreateUserDTO): Promise<IUser> {
    return await prisma.user.create({
      data: {
        name,
        email,
      },
    })
  }

  async createMany(users: ICreateUserDTO[]): Promise<IUser[]> {
    return await prisma.user.createManyAndReturn({
      data: users,
      skipDuplicates: true,
    })
  }
}
