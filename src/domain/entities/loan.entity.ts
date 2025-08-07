import { UserCategoryVO } from '../value-objects';

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export interface LoanProps {
  id?: string;
  userId: string;
  bookId: string;
  loanDate: Date;
  returnDate: Date;
  status: LoanStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Loan {
  public readonly id: string;
  public readonly userId: string;
  public readonly bookId: string;
  public readonly loanDate: Date;
  public readonly returnDate: Date;
  public readonly status: LoanStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: LoanProps) {
    this.id = props.id || crypto.randomUUID();
    this.userId = props.userId;
    this.bookId = props.bookId;
    this.loanDate = props.loanDate;
    this.returnDate = props.returnDate;
    this.status = props.status;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(
    userId: string,
    bookId: string,
    userCategory: UserCategoryVO,
  ): Loan {
    const loanDate = new Date();
    const returnDate = new Date(loanDate);
    returnDate.setDate(returnDate.getDate() + userCategory.getLoanPeriodDays());

    return new Loan({
      userId,
      bookId,
      loanDate,
      returnDate,
      status: LoanStatus.ACTIVE,
    });
  }

  public return(): void {
    if (this.status === LoanStatus.ACTIVE) {
      (this as any).status = LoanStatus.RETURNED;
      (this as any).updatedAt = new Date();
    }
  }

  public markAsOverdue(): void {
    if (this.status === LoanStatus.ACTIVE) {
      (this as any).status = LoanStatus.OVERDUE;
      (this as any).updatedAt = new Date();
    }
  }

  public isOverdue(): boolean {
    return new Date() > this.returnDate;
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
