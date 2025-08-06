import { LoanPeriod } from '../loan-period.vo';

describe('LoanPeriod Value Object', () => {
  describe('create', () => {
    it('should create a valid loan period', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getLoanDate()).toEqual(loanDate);
      expect(period.getReturnDate()).toEqual(new Date('2024-01-11'));
    });

    it('should create a loan period with 0 days', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 0);

      expect(period.getLoanDate()).toEqual(loanDate);
      expect(period.getReturnDate()).toEqual(loanDate);
    });

    it('should create a loan period with 1 day', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 1);

      expect(period.getLoanDate()).toEqual(loanDate);
      expect(period.getReturnDate()).toEqual(new Date('2024-01-02'));
    });
  });

  describe('getLoanDate', () => {
    it('should return the loan date', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getLoanDate()).toEqual(loanDate);
    });
  });

  describe('getReturnDate', () => {
    it('should return the return date', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getReturnDate()).toEqual(new Date('2024-01-11'));
    });
  });

  describe('getTotalDays', () => {
    it('should return correct total days for 10-day period', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getTotalDays()).toBe(10);
    });

    it('should return 0 for 0-day period', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 0);

      expect(period.getTotalDays()).toBe(0);
    });

    it('should return 1 for 1-day period', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 1);

      expect(period.getTotalDays()).toBe(1);
    });

    it('should handle month boundary correctly', () => {
      const loanDate = new Date('2024-01-25');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getTotalDays()).toBe(10);
    });

    it('should handle year boundary correctly', () => {
      const loanDate = new Date('2024-12-25');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getTotalDays()).toBe(10);
    });
  });

  describe('getDaysRemaining', () => {
    it('should return positive days for future return date', () => {
      const loanDate = new Date();
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getDaysRemaining()).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for past return date', () => {
      const loanDate = new Date('2020-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.getDaysRemaining()).toBe(0);
    });
  });

  describe('isOverdue', () => {
    it('should return false for future return date', () => {
      const loanDate = new Date();
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.isOverdue()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true for future return date', () => {
      const loanDate = new Date();
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.isActive()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return return date as ISO string', () => {
      const loanDate = new Date('2024-01-01');
      const period = LoanPeriod.create(loanDate, 10);

      expect(period.toString()).toBe(new Date('2024-01-11').toISOString());
    });
  });
});
