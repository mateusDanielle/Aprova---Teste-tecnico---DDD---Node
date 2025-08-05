import { Loan, LoanStatus } from '../loan.entity';
import { UserCategory } from '../user.entity';

describe('Loan Entity', () => {
  describe('create', () => {
    it('should create a loan for STUDENT with 10 days return date', () => {
      const loanData = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const loan = Loan.create(loanData, UserCategory.STUDENT);

      expect(loan.userId).toBe(loanData.userId);
      expect(loan.bookId).toBe(loanData.bookId);
      expect(loan.status).toBe(LoanStatus.ACTIVE);
      expect(loan.id).toBeDefined();
      expect(loan.createdAt).toBeInstanceOf(Date);
      expect(loan.updatedAt).toBeInstanceOf(Date);

      // Verificar se a data de devolução é 10 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 10);
      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });

    it('should create a loan for TEACHER with 30 days return date', () => {
      const loanData = {
        userId: 'user-456',
        bookId: 'book-789',
      };

      const loan = Loan.create(loanData, UserCategory.TEACHER);

      // Verificar se a data de devolução é 30 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 30);
      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });

    it('should create a loan for LIBRARIAN with 60 days return date', () => {
      const loanData = {
        userId: 'user-789',
        bookId: 'book-123',
      };

      const loan = Loan.create(loanData, UserCategory.LIBRARIAN);

      // Verificar se a data de devolução é 60 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 60);
      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });
  });

  describe('return', () => {
    it('should mark loan as returned', () => {
      const loan = Loan.create(
        { userId: 'user-123', bookId: 'book-456' },
        UserCategory.STUDENT,
      );

      loan.return();

      expect(loan.status).toBe(LoanStatus.RETURNED);
    });
  });

  describe('markAsOverdue', () => {
    it('should mark loan as overdue', () => {
      const loan = Loan.create(
        { userId: 'user-123', bookId: 'book-456' },
        UserCategory.STUDENT,
      );

      loan.markAsOverdue();

      expect(loan.status).toBe(LoanStatus.OVERDUE);
    });
  });

  describe('isOverdue', () => {
    it('should return true when loan is overdue', () => {
      const loan = Loan.create(
        { userId: 'user-123', bookId: 'book-456' },
        UserCategory.STUDENT,
      );

      // Simular empréstimo vencido (data de devolução no passado)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      loan.returnDate = pastDate;

      expect(loan.isOverdue()).toBe(true);
    });

    it('should return false when loan is not overdue', () => {
      const loan = Loan.create(
        { userId: 'user-123', bookId: 'book-456' },
        UserCategory.STUDENT,
      );

      // Simular empréstimo não vencido (data de devolução no futuro)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      loan.returnDate = futureDate;

      expect(loan.isOverdue()).toBe(false);
    });

    it('should return false when loan is already returned', () => {
      const loan = Loan.create(
        { userId: 'user-123', bookId: 'book-456' },
        UserCategory.STUDENT,
      );

      loan.return();

      expect(loan.isOverdue()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return loan data as JSON', () => {
      const loanData = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const loan = Loan.create(loanData, UserCategory.STUDENT);
      const json = loan.toJSON();

      expect(json).toEqual({
        id: loan.id,
        userId: loanData.userId,
        bookId: loanData.bookId,
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        status: loan.status,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
      });
    });
  });
});
