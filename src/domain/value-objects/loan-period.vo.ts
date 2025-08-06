export class LoanPeriod {
  private constructor(
    private readonly loanDate: Date,
    private readonly returnDate: Date,
  ) {}

  static create(loanDate: Date, daysToAdd: number): LoanPeriod {
    const returnDate = new Date(loanDate);
    returnDate.setDate(returnDate.getDate() + daysToAdd);

    return new LoanPeriod(loanDate, returnDate);
  }

  getLoanDate(): Date {
    return this.loanDate;
  }

  getReturnDate(): Date {
    return this.returnDate;
  }

  getDaysRemaining(): number {
    const now = new Date();
    const diffTime = this.returnDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  isOverdue(): boolean {
    return this.getDaysRemaining() < 0;
  }

  isActive(): boolean {
    return !this.isOverdue();
  }

  getTotalDays(): number {
    const diffTime = this.returnDate.getTime() - this.loanDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toString(): string {
    return this.returnDate.toISOString();
  }
}
