import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Loan } from '../../domain';
import type {
  IUserRepository,
  IBookRepository,
  ILoanRepository,
} from '../../domain';
import { CreateLoanDto } from '../dto/create-loan.dto';

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

  async execute(createLoanDto: CreateLoanDto): Promise<{ returnDate: Date }> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(createLoanDto.userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verificar se o livro existe
    const book = await this.bookRepository.findById(createLoanDto.bookId);
    if (!book) {
      throw new BadRequestException('Livro não encontrado');
    }

    // Verificar se o livro já está emprestado
    const activeLoan = await this.loanRepository.findActiveByBookId(
      createLoanDto.bookId,
    );
    if (activeLoan) {
      throw new BadRequestException('Livro já está emprestado');
    }

    // Criar o empréstimo com a data de devolução baseada na categoria do usuário
    const loan = Loan.create(
      {
        userId: createLoanDto.userId,
        bookId: createLoanDto.bookId,
      },
      user.category,
    );

    await this.loanRepository.create(loan);

    return { returnDate: loan.returnDate };
  }
}
