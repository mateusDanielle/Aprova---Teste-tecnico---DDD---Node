import { Injectable } from '@nestjs/common';
import { Loan, LoanStatus } from '../../../domain';
import { ILoanRepository } from '../../../domain/repositories/loan.repository.interface';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(loan: Loan): Promise<Loan> {
    const createdLoan = await this.prisma.loan.create({
      data: {
        id: loan.id,
        userId: loan.userId,
        bookId: loan.bookId,
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        status: loan.status,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
      },
    });

    return new Loan({
      id: createdLoan.id,
      userId: createdLoan.userId,
      bookId: createdLoan.bookId,
      loanDate: createdLoan.loanDate,
      returnDate: createdLoan.returnDate,
      status: createdLoan.status as LoanStatus,
      createdAt: createdLoan.createdAt,
      updatedAt: createdLoan.updatedAt,
    });
  }

  async findById(id: string): Promise<Loan | null> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      return null;
    }

    return new Loan({
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      loanDate: loan.loanDate,
      returnDate: loan.returnDate,
      status: loan.status as LoanStatus,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
    });

    return loans.map(
      (loan) =>
        new Loan({
          id: loan.id,
          userId: loan.userId,
          bookId: loan.bookId,
          loanDate: loan.loanDate,
          returnDate: loan.returnDate,
          status: loan.status as LoanStatus,
          createdAt: loan.createdAt,
          updatedAt: loan.updatedAt,
        }),
    );
  }

  async findByBookId(bookId: string): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({
      where: { bookId },
    });

    return loans.map(
      (loan) =>
        new Loan({
          id: loan.id,
          userId: loan.userId,
          bookId: loan.bookId,
          loanDate: loan.loanDate,
          returnDate: loan.returnDate,
          status: loan.status as LoanStatus,
          createdAt: loan.createdAt,
          updatedAt: loan.updatedAt,
        }),
    );
  }

  async findActiveByBookId(bookId: string): Promise<Loan | null> {
    const loan = await this.prisma.loan.findFirst({
      where: {
        bookId,
        status: 'ACTIVE',
      },
    });

    if (!loan) {
      return null;
    }

    return new Loan({
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      loanDate: loan.loanDate,
      returnDate: loan.returnDate,
      status: loan.status as LoanStatus,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    });
  }

  async findAll(): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany();

    return loans.map(
      (loan) =>
        new Loan({
          id: loan.id,
          userId: loan.userId,
          bookId: loan.bookId,
          loanDate: loan.loanDate,
          returnDate: loan.returnDate,
          status: loan.status as LoanStatus,
          createdAt: loan.createdAt,
          updatedAt: loan.updatedAt,
        }),
    );
  }

  async update(loan: Loan): Promise<Loan> {
    const updatedLoan = await this.prisma.loan.update({
      where: { id: loan.id },
      data: {
        userId: loan.userId,
        bookId: loan.bookId,
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        status: loan.status,
        updatedAt: new Date(),
      },
    });

    return new Loan({
      id: updatedLoan.id,
      userId: updatedLoan.userId,
      bookId: updatedLoan.bookId,
      loanDate: updatedLoan.loanDate,
      returnDate: updatedLoan.returnDate,
      status: updatedLoan.status as LoanStatus,
      createdAt: updatedLoan.createdAt,
      updatedAt: updatedLoan.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.loan.delete({
      where: { id },
    });
  }
}
