import type { IUser } from '@domain/entities/user.entity.ts'
import type { IUsersRepository } from '@domain/repositories/users.repository.js'

interface IInputDTO {
  name: string
  email: string
}

interface IOutputDTO extends IUser {}

export class CreateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ name, email }: IInputDTO): Promise<IOutputDTO> {
    return await this.usersRepository.create({
      name,
      email,
    })
  }
}
