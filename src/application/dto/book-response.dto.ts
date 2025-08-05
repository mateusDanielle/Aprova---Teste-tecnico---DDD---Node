import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({
    description: 'ID do livro',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do livro',
    example: 'O Senhor dos Anéis',
  })
  name: string;

  @ApiProperty({
    description: 'Ano de publicação',
    example: 1954,
  })
  year: number;

  @ApiProperty({
    description: 'Editora do livro',
    example: 'Editora Martins Fontes',
  })
  publisher: string;

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
