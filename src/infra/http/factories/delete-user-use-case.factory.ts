import { DeleteUserUseCase } from '@application/use-cases/delete-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeDeleteUserUseCase() {
  const usersRepository = new UsersRepository()

  return new DeleteUserUseCase(usersRepository)
}
