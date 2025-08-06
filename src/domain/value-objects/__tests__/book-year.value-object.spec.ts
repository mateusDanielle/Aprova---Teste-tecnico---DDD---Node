import { BookYear } from '../book-year.vo';

describe('BookYear Value Object', () => {
  describe('create', () => {
    it('should create a valid book year', () => {
      const year = BookYear.create(2024);
      expect(year.getValue()).toBe(2024);
    });

    it('should create a book year with minimum value', () => {
      const year = BookYear.create(1000);
      expect(year.getValue()).toBe(1000);
    });

    it('should create a book year with current year', () => {
      const currentYear = new Date().getFullYear();
      const year = BookYear.create(currentYear);
      expect(year.getValue()).toBe(currentYear);
    });

    it('should create a book year with next year', () => {
      const nextYear = new Date().getFullYear() + 1;
      const year = BookYear.create(nextYear);
      expect(year.getValue()).toBe(nextYear);
    });
  });

  describe('validation', () => {
    it('should throw error for year before 1000', () => {
      expect(() => BookYear.create(999)).toThrow('Year must be at least 1000');
    });

    it('should throw error for year after current year + 1', () => {
      const tooFarYear = new Date().getFullYear() + 2;
      expect(() => BookYear.create(tooFarYear)).toThrow(
        `Year cannot be greater than ${new Date().getFullYear() + 1}`,
      );
    });

    it('should throw error for negative year', () => {
      expect(() => BookYear.create(-2024)).toThrow(
        'Year must be at least 1000',
      );
    });
  });

  describe('getValue', () => {
    it('should return the year value', () => {
      const year = BookYear.create(2024);
      expect(year.getValue()).toBe(2024);
    });
  });

  describe('equals', () => {
    it('should return true for equal years', () => {
      const year1 = BookYear.create(2024);
      const year2 = BookYear.create(2024);
      expect(year1.equals(year2)).toBe(true);
    });

    it('should return false for different years', () => {
      const year1 = BookYear.create(2024);
      const year2 = BookYear.create(2023);
      expect(year1.equals(year2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the year value as string', () => {
      const year = BookYear.create(2024);
      expect(year.toString()).toBe('2024');
    });
  });

  describe('isClassic', () => {
    it('should return true for classic books (before 1950)', () => {
      const year = BookYear.create(1949);
      expect(year.isClassic()).toBe(true);
    });

    it('should return false for modern books (1950 and after)', () => {
      const year = BookYear.create(1950);
      expect(year.isClassic()).toBe(false);
    });
  });

  describe('isModern', () => {
    it('should return true for modern books (1950 and after)', () => {
      const year = BookYear.create(1950);
      expect(year.isModern()).toBe(true);
    });

    it('should return false for classic books (before 1950)', () => {
      const year = BookYear.create(1949);
      expect(year.isModern()).toBe(false);
    });
  });
});
