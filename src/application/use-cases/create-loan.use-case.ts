import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreateLoanDto } from '../dto/create-loan.dto';
import type {
  IUserRepository,
  IBookRepository,
  ILoanRepository,
} from '../../domain';
import { Loan } from '../../domain';

@Injectable()
export class CreateLoanUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(createLoanDto: CreateLoanDto) {
    const user = await this.userRepository.findById(createLoanDto.userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const book = await this.bookRepository.findById(createLoanDto.bookId);
    if (!book) {
      throw new BadRequestException('Livro não encontrado');
    }

    const activeLoan = await this.loanRepository.findActiveByBookId(
      createLoanDto.bookId,
    );
    if (activeLoan) {
      throw new BadRequestException('Livro já está emprestado');
    }

    const loan = Loan.create(
      createLoanDto.userId,
      createLoanDto.bookId,
      user.category,
    );

    const createdLoan = await this.loanRepository.create(loan);

    return { id: createdLoan.id };
  }
}
