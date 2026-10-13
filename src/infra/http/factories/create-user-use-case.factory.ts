import { CreateUserUseCase } from '@application/use-cases/create-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeCreateUserUseCase() {
  const usersRepository = new UsersRepository()

  return new CreateUserUseCase(usersRepository)
}
