import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { ApiCreateResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';

@Controller('users')
@ValidateEntity()
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiCreateResponse(UserResponseDto)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
