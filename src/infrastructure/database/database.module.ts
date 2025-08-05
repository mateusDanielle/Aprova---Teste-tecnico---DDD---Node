import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { BookRepository } from './repositories/book.repository';
import { LoanRepository } from './repositories/loan.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
    {
      provide: 'ILoanRepository',
      useClass: LoanRepository,
    },
  ],
  exports: [
    PrismaService,
    'IUserRepository',
    'IBookRepository',
    'ILoanRepository',
  ],
})
export class DatabaseModule { }
