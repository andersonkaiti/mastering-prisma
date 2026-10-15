import { TransactionUseCase } from '@application/use-cases/transaction.usecase.ts'
import { UsersRepository } from '@infra/database/repositories/users.repository.ts'

export function makeTransactionUseCase() {
  const usersRepository = new UsersRepository()

  return new TransactionUseCase(usersRepository)
}
