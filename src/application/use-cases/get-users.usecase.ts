import type { IOrder } from '@domain/entities/order.entity.ts'
import type { IProfile } from '@domain/entities/profile.entity.ts'
import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IOutputDTO
  extends Array<IUser & { profile: IProfile | null; orders: IOrder[] }> {}

export class GetUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<IOutputDTO> {
    return await this.usersRepository.findMany()
  }
}
