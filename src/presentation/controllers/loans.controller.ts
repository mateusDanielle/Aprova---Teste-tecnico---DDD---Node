import { Controller, Post, Body } from '@nestjs/common';
import { CreateLoanUseCase } from '../../application/use-cases/create-loan.use-case';
import { CreateLoanDto } from '../../application/dto/create-loan.dto';
import { ApiLoanResponse } from '../../shared/decorators';
import { ValidateEntity } from '../../shared/decorators';

@Controller('loans')
@ValidateEntity()
export class LoansController {
  constructor(private readonly createLoanUseCase: CreateLoanUseCase) {}

  @Post()
  @ApiLoanResponse()
  async createLoan(@Body() createLoanDto: CreateLoanDto) {
    return this.createLoanUseCase.execute(createLoanDto);
  }
}
