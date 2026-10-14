import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IInputDTO {
  id: string
}

type OutputDTO = IUser | null

export class GetUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ id }: IInputDTO): Promise<OutputDTO> {
    return await this.usersRepository.findOne(id)
  }
}
