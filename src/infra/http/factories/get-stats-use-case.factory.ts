import { GetStatsUseCase } from '@application/use-cases/get-stats.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeGetStatsUseCase() {
  const usersRepository = new UsersRepository()

  return new GetStatsUseCase(usersRepository)
}
