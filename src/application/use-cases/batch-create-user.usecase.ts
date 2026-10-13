import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.js'

interface IInputDTO {
  users: {
    name: string
    email: string
  }[]
}

export class BatchCreateUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ users }: IInputDTO): Promise<IUser[]> {
    return await this.usersRepository.createMany(users)
  }
}
