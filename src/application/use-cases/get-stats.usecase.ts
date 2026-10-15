import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IOutputDTO {
  totalUsers: number
  totalEmails: number
  oldestBirthdate: Date | null
  youngerBirthdate: Date | null
}

export class GetStatsUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<IOutputDTO> {
    return await this.usersRepository.getStats()
  }
}
