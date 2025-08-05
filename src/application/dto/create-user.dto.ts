import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserCategory } from '../../domain';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cidade do usuário',
    example: 'São Paulo',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Categoria do usuário',
    enum: UserCategory,
    example: UserCategory.STUDENT,
  })
  @IsEnum(UserCategory)
  category: UserCategory;
}
