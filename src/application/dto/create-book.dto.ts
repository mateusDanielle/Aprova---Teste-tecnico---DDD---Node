import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Nome do livro',
    example: 'O Senhor dos Anéis',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ano de publicação',
    example: 1954,
    minimum: 1000,
    maximum: 2024,
  })
  @IsNumber()
  @Min(1000)
  @Max(2024)
  year: number;

  @ApiProperty({
    description: 'Editora do livro',
    example: 'Editora Martins Fontes',
  })
  @IsString()
  @IsNotEmpty()
  publisher: string;
}
