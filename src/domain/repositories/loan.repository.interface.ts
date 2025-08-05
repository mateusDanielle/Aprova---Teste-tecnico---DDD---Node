import { Loan } from '../entities/loan.entity';

export interface ILoanRepository {
  create(loan: Loan): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findByUserId(userId: string): Promise<Loan[]>;
  findByBookId(bookId: string): Promise<Loan[]>;
  findActiveByBookId(bookId: string): Promise<Loan | null>;
  findAll(): Promise<Loan[]>;
  update(loan: Loan): Promise<Loan>;
  delete(id: string): Promise<void>;
}
