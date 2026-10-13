import { BatchCreateUsersUseCase } from '@application/use-cases/batch-create-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeBatchCreateUsersUseCase() {
  const usersRepository = new UsersRepository()

  return new BatchCreateUsersUseCase(usersRepository)
}
