import { GetUsersUseCase } from '@application/use-cases/get-users.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeGetUsersUseCase() {
  const usersRepository = new UsersRepository()

  return new GetUsersUseCase(usersRepository)
}
