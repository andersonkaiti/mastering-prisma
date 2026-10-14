import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.js'

interface IInputDTO {
  users: {
    name: string
    email: string
  }[]
}

interface IOutputDTO extends Array<IUser> {}

export class BatchCreateUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ users }: IInputDTO): Promise<IOutputDTO> {
    return await this.usersRepository.createMany(users)
  }
}
