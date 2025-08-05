import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain';
import type { IUserRepository } from '../../domain';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ id: string }> {
    const user = User.create({
      name: createUserDto.name,
      city: createUserDto.city,
      category: createUserDto.category,
    });

    const createdUser = await this.userRepository.create(user);

    return { id: createdUser.id };
  }
}
