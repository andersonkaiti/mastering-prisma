import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.ts'

interface IInputDTO {
  id: IUser['id']
}

interface IOutputDTO extends IUser {}

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ id }: IInputDTO): Promise<IOutputDTO> {
    return await this.usersRepository.delete(id)
  }
}
