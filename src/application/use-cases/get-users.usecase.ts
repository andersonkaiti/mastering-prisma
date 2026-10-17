import type { IUserWithRelations } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

export class GetUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<IUserWithRelations[]> {
    return await this.usersRepository.findMany()
  }
}
