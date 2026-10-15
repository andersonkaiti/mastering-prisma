import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IOutputDTO extends Array<IUser> {}

export class TransactionUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<IOutputDTO> {
    return await this.usersRepository.transaction()
  }
}
