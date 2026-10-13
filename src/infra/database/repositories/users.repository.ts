import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.d.ts'
import { prisma } from '@infra/database/prisma/index.ts'

export class UsersRepository implements IUsersRepository {
  async create({ name, email }: IUser): Promise<IUser> {
    return await prisma.user.create({
      data: {
        name,
        email,
      },
    })
  }
}
