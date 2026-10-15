import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IInputDTO extends Partial<IUser> {
  name: string
  email: string
}

interface IOutputDTO extends IUser {}

export class UpsertUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(user: IInputDTO): Promise<IOutputDTO> {
    return await this.usersRepository.upsert(user)
  }
}
