import { UpsertUserUseCase } from '@application/use-cases/upsert-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeUpsertUserUseCase() {
  const usersRepository = new UsersRepository()

  return new UpsertUserUseCase(usersRepository)
}
