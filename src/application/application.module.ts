import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { CreateBookUseCase } from './use-cases/create-book.use-case';
import { SearchBooksUseCase } from './use-cases/search-books.use-case';
import { CreateLoanUseCase } from './use-cases/create-loan.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    CreateUserUseCase,
    CreateBookUseCase,
    SearchBooksUseCase,
    CreateLoanUseCase,
  ],
  exports: [
    CreateUserUseCase,
    CreateBookUseCase,
    SearchBooksUseCase,
    CreateLoanUseCase,
  ],
})
export class ApplicationModule {}
