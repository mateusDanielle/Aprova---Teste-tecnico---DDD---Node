import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type {
  IUserRepository,
  IBookRepository,
  ILoanRepository,
} from '../../domain';
import { Loan, UserCategoryVO } from '../../domain';
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
    const user = await this.userRepository.findById(createLoanDto.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const book = await this.bookRepository.findById(createLoanDto.bookId);
    if (!book) {
      throw new BadRequestException('Book not found');
    }

    const activeLoan = await this.loanRepository.findActiveByBookId(
      createLoanDto.bookId,
    );
    if (activeLoan) {
      throw new BadRequestException('Book is already loaned');
    }

    const userCategory = UserCategoryVO.create(user.category.getValue());
    const loan = Loan.create(
      createLoanDto.userId,
      createLoanDto.bookId,
      userCategory,
    );

    const createdLoan = await this.loanRepository.create(loan);

    return { returnDate: createdLoan.returnDate };
  }
}
