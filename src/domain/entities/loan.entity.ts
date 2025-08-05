import { UserCategory } from './user.entity';

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export interface LoanProps {
  id?: string;
  userId: string;
  bookId: string;
  loanDate?: Date;
  returnDate?: Date;
  status?: LoanStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Loan {
  public readonly id: string;
  public readonly userId: string;
  public readonly bookId: string;
  public readonly loanDate: Date;
  public returnDate: Date;
  public status: LoanStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: LoanProps) {
    this.id = props.id || crypto.randomUUID();
    this.userId = props.userId;
    this.bookId = props.bookId;
    this.loanDate = props.loanDate || new Date();
    this.returnDate = props.returnDate || this.calculateReturnDate();
    this.status = props.status || LoanStatus.ACTIVE;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(
    props: Omit<
      LoanProps,
      'id' | 'loanDate' | 'returnDate' | 'status' | 'createdAt' | 'updatedAt'
    >,
    userCategory: UserCategory,
  ): Loan {
    const loan = new Loan(props);
    loan.returnDate = loan.calculateReturnDateByCategory(userCategory);
    return loan;
  }

  private calculateReturnDate(): Date {
    // Default to 10 days (STUDENT)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 10);
    return returnDate;
  }

  private calculateReturnDateByCategory(category: UserCategory): Date {
    const returnDate = new Date();

    switch (category) {
      case UserCategory.TEACHER:
        returnDate.setDate(returnDate.getDate() + 30);
        break;
      case UserCategory.STUDENT:
        returnDate.setDate(returnDate.getDate() + 10);
        break;
      case UserCategory.LIBRARIAN:
        returnDate.setDate(returnDate.getDate() + 60);
        break;
      default:
        returnDate.setDate(returnDate.getDate() + 10);
    }

    return returnDate;
  }

  public return(): void {
    this.status = LoanStatus.RETURNED;
    this.updatedAt = new Date();
  }

  public markAsOverdue(): void {
    this.status = LoanStatus.OVERDUE;
    this.updatedAt = new Date();
  }

  public isOverdue(): boolean {
    return new Date() > this.returnDate && this.status === LoanStatus.ACTIVE;
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      bookId: this.bookId,
      loanDate: this.loanDate,
      returnDate: this.returnDate,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
