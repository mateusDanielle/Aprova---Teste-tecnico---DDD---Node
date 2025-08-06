import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain';
import { User, Name, UserCategoryVO } from '../../domain';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ id: string }> {
    const name = Name.create(createUserDto.name);
    const category = UserCategoryVO.create(createUserDto.category);

    const user = User.create({
      name,
      city: createUserDto.city,
      category,
    });

    const createdUser = await this.userRepository.create(user);

    return { id: createdUser.id };
  }
}
