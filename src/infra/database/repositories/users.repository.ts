import type { IUser } from '@domain/entities/user.entity.ts'
import type {
  ICreateUserDTO,
  IGetStatsResponse,
  ITransactionResponse,
  IUpdateUserDTO,
  IUpsertUserDTO,
  IUsersRepository,
} from '@domain/repositories/users.repository.d.ts'
import { prisma } from '@infra/database/prisma/index.ts'
import { makeUser } from '@shared/utils/make-user.ts'

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

  async findMany(): Promise<IUser[]> {
    return await prisma.$queryRaw<IUser[]>`
      SELECT
        id,
        name,
        email,
        birthdate,
        is_active "isActive"
      FROM
        users
      `
  }

  async findOne(id: IUser['id']): Promise<IUser | null> {
    const [user] = await prisma.$queryRaw<IUser[]>`
      SELECT
        id,
        name,
        email,
        birthdate,
        is_active "isActive"
      FROM
        users
      WHERE
        id = ${id}
    `

    return user ?? null
  }

  async getStats(): Promise<IGetStatsResponse> {
    const [
      totalUsers,
      {
        _count: { email: totalEmails },
        _max: { birthdate: youngerBirthdate },
        _min: { birthdate: oldestBirthdate },
      },
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.aggregate({
        _count: {
          email: true,
        },
        _max: {
          birthdate: true,
        },
        _min: {
          birthdate: true,
        },
      }),
    ])

    return {
      totalUsers,
      totalEmails,
      oldestBirthdate,
      youngerBirthdate,
    }
  }

  async update(id: IUser['id'], user: IUpdateUserDTO): Promise<IUser> {
    return await prisma.user.update({
      data: user,
      where: {
        id,
      },
    })
  }

  async upsert(user: IUpsertUserDTO): Promise<IUser> {
    return await prisma.user.upsert({
      create: user,
      update: user,
      where: {
        email: user.email,
      },
    })
  }

  async delete(id: IUser['id']): Promise<IUser> {
    return await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async transaction(): Promise<ITransactionResponse> {
    const user = makeUser()

    // const users = await prisma.$transaction([
    //   prisma.user.create({
    //     data: user,
    //   }),
    //   prisma.user.create({
    //     data: makeUser(),
    //   }),
    //   prisma.user.create({
    //     data: user,
    //   }),
    // ])

    const users = await prisma.$transaction(async (tx) => {
      // Every query inside the callback must use `tx`, never the shared
      // `prisma` singleton — otherwise it runs outside the transaction and
      // won't be rolled back if a later step fails.
      const userOne = await tx.user.create({
        data: user,
      })

      const userTwo = await tx.user.create({
        data: makeUser(),
      })

      const userThree = await tx.user.create({
        data: user,
      })

      return [userOne, userTwo, userThree]
    })

    return users
  }
}
