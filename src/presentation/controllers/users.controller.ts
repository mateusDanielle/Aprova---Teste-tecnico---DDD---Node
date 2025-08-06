import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { ApiCreateResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';
import type { IUserRepository } from '../../domain';

@Controller('users')
@ValidateEntity()
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  @Post()
  @ApiCreateResponse(UserResponseDto)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id,
      name: user.name.getValue(),
      city: user.city,
      category: user.category.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name.getValue(),
      city: user.city,
      category: user.category.getValue(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
