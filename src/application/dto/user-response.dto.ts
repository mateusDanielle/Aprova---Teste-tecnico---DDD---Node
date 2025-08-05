import { ApiProperty } from '@nestjs/swagger';
import { UserCategory } from '../../domain';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Cidade do usuário',
    example: 'São Paulo',
  })
  city: string;

  @ApiProperty({
    description: 'Categoria do usuário',
    enum: UserCategory,
    example: UserCategory.STUDENT,
  })
  category: UserCategory;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
