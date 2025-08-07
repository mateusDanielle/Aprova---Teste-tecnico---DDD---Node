import { Loan } from '../loan.entity';
import { UserCategoryVO } from '../../value-objects';

describe('Loan Entity', () => {
  describe('create', () => {
    it('should create a loan for STUDENT with 10 days return date', () => {
      const loanData = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const loan = Loan.create(
        loanData.userId,
        loanData.bookId,
        UserCategoryVO.create('STUDENT'),
      );

      expect(loan.userId).toBe(loanData.userId);
      expect(loan.bookId).toBe(loanData.bookId);
      expect(loan.status).toBe('ACTIVE');

      // Verificar se a data de devolução é 10 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 10);

      // Comparar apenas a data (sem hora) para evitar problemas de timing
      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });

    it('should create a loan for TEACHER with 30 days return date', () => {
      const loanData = {
        userId: 'user-456',
        bookId: 'book-789',
      };

      const loan = Loan.create(
        loanData.userId,
        loanData.bookId,
        UserCategoryVO.create('TEACHER'),
      );

      // Verificar se a data de devolução é 30 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 30);

      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });

    it('should create a loan for LIBRARIAN with 60 days return date', () => {
      const loanData = {
        userId: 'user-789',
        bookId: 'book-012',
      };

      const loan = Loan.create(
        loanData.userId,
        loanData.bookId,
        UserCategoryVO.create('LIBRARIAN'),
      );

      // Verificar se a data de devolução é 60 dias após a criação
      const expectedReturnDate = new Date();
      expectedReturnDate.setDate(expectedReturnDate.getDate() + 60);

      expect(loan.returnDate.getDate()).toBe(expectedReturnDate.getDate());
    });
  });

  describe('return', () => {
    it('should mark loan as returned', () => {
      const loan = Loan.create(
        'user-123',
        'book-456',
        UserCategoryVO.create('STUDENT'),
      );

      loan.return();

      expect(loan.status).toBe('RETURNED');
    });
  });

  describe('markAsOverdue', () => {
    it('should mark loan as overdue', () => {
      const loan = Loan.create(
        'user-123',
        'book-456',
        UserCategoryVO.create('STUDENT'),
      );

      loan.markAsOverdue();

      expect(loan.status).toBe('OVERDUE');
    });
  });

  describe('isOverdue', () => {
    it('should return true when loan is overdue', () => {
      const loan = Loan.create(
        'user-123',
        'book-456',
        UserCategoryVO.create('STUDENT'),
      );

      // Simular empréstimo vencido (data de devolução no passado)
      (loan as any).returnDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 dia atrás

      expect(loan.isOverdue()).toBe(true);
    });

    it('should return false when loan is not overdue', () => {
      const loan = Loan.create(
        'user-123',
        'book-456',
        UserCategoryVO.create('STUDENT'),
      );

      // Simular empréstimo não vencido (data de devolução no futuro)
      (loan as any).returnDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 dia à frente

      expect(loan.isOverdue()).toBe(false);
    });

    it('should return false when loan is already returned', () => {
      const loan = Loan.create(
        'user-123',
        'book-456',
        UserCategoryVO.create('STUDENT'),
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

      const loan = Loan.create(
        loanData.userId,
        loanData.bookId,
        UserCategoryVO.create('STUDENT'),
      );
      const json = loan.toJSON();

      expect(json).toEqual({
        id: loan.id,
        userId: 'user-123',
        bookId: 'book-456',
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        status: 'ACTIVE',
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
      });
    });
  });
});
