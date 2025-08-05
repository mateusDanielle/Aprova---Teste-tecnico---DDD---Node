import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { UsersController } from './controllers/users.controller';
import { BooksController } from './controllers/books.controller';
import { LoansController } from './controllers/loans.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [UsersController, BooksController, LoansController],
})
export class PresentationModule {}
