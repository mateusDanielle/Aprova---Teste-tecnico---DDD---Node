import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { CreateLoanUseCase } from '../../application/use-cases/create-loan.use-case';
import { CreateLoanDto } from '../../application/dto/create-loan.dto';
import { ApiLoanResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';
import type { ILoanRepository } from '../../domain';

@Controller('loans')
@ValidateEntity()
export class LoansController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  @Post()
  @ApiLoanResponse()
  async createLoan(@Body() createLoanDto: CreateLoanDto) {
    return this.createLoanUseCase.execute(createLoanDto);
  }

  @Get()
  async findAll() {
    const loans = await this.loanRepository.findAll();
    return loans.map((loan) => ({
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      returnDate: loan.returnDate,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const loan = await this.loanRepository.findById(id);
    if (!loan) {
      throw new Error('Loan not found');
    }
    return {
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      returnDate: loan.returnDate,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };
  }
}
