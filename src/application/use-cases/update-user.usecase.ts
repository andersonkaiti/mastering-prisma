import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IInputDTO {
  id: IUser['id']
  user: Omit<Partial<IUser>, 'id'>
}

interface IOutputDTO extends IUser {}

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ id, user }: IInputDTO): Promise<IOutputDTO> {
    return await this.usersRepository.update(id, user)
  }
}
