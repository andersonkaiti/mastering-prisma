import { UpdateUserUseCase } from '@application/use-cases/update-user.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeUpdateUserUseCase() {
  const usersRepository = new UsersRepository()

  return new UpdateUserUseCase(usersRepository)
}
