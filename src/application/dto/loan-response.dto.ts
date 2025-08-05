import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '../../domain';

export class LoanResponseDto {
  @ApiProperty({
    description: 'ID do empréstimo',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'clx0987654321fedcba',
  })
  userId: string;

  @ApiProperty({
    description: 'ID do livro',
    example: 'clx1234567890abcdef',
  })
  bookId: string;

  @ApiProperty({
    description: 'Data do empréstimo',
    example: '2024-01-15T10:30:00.000Z',
  })
  loanDate: Date;

  @ApiProperty({
    description: 'Data de devolução',
    example: '2024-01-25T10:30:00.000Z',
  })
  returnDate: Date;

  @ApiProperty({
    description: 'Status do empréstimo',
    enum: LoanStatus,
    example: LoanStatus.ACTIVE,
  })
  status: LoanStatus;

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
