import { GetUserUseCase } from '@application/use-cases/get-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeGetUserUseCase() {
  const usersRepository = new UsersRepository()

  return new GetUserUseCase(usersRepository)
}
