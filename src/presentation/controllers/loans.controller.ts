import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLoanUseCase } from '../../application/use-cases/create-loan.use-case';
import { CreateLoanDto } from '../../application/dto/create-loan.dto';

@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly createLoanUseCase: CreateLoanUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Emprestar livro',
    description: 'Cria um novo empréstimo de livro',
  })
  @ApiResponse({
    status: 201,
    description: 'Empréstimo criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        returnDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-25T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou livro já emprestado',
  })
  async create(
    @Body() createLoanDto: CreateLoanDto,
  ): Promise<{ returnDate: Date }> {
    return this.createLoanUseCase.execute(createLoanDto);
  }
}
