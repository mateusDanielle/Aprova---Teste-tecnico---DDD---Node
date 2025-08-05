import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({
    description: 'ID do livro',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'clx0987654321fedcba',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
