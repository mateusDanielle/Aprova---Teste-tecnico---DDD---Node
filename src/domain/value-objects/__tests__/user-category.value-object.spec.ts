import { UserCategoryVO, UserCategory } from '../user-category.vo';

describe('UserCategoryVO Value Object', () => {
  describe('create', () => {
    it('should create a valid STUDENT category', () => {
      const category = UserCategoryVO.create('STUDENT');
      expect(category.getValue()).toBe(UserCategory.STUDENT);
    });

    it('should create a valid TEACHER category', () => {
      const category = UserCategoryVO.create('TEACHER');
      expect(category.getValue()).toBe(UserCategory.TEACHER);
    });

    it('should create a valid LIBRARIAN category', () => {
      const category = UserCategoryVO.create('LIBRARIAN');
      expect(category.getValue()).toBe(UserCategory.LIBRARIAN);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid category', () => {
      expect(() => UserCategoryVO.create('INVALID')).toThrow(
        'Invalid user category: INVALID',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => UserCategoryVO.create('')).toThrow(
        'Invalid user category: ',
      );
    });

    it('should throw error for whitespace only', () => {
      expect(() => UserCategoryVO.create('   ')).toThrow(
        'Invalid user category:    ',
      );
    });
  });

  describe('getValue', () => {
    it('should return the category value', () => {
      const category = UserCategoryVO.create('STUDENT');
      expect(category.getValue()).toBe(UserCategory.STUDENT);
    });
  });

  describe('equals', () => {
    it('should return true for equal categories', () => {
      const category1 = UserCategoryVO.create('STUDENT');
      const category2 = UserCategoryVO.create('STUDENT');
      expect(category1.equals(category2)).toBe(true);
    });

    it('should return false for different categories', () => {
      const category1 = UserCategoryVO.create('STUDENT');
      const category2 = UserCategoryVO.create('TEACHER');
      expect(category1.equals(category2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the category value as string', () => {
      const category = UserCategoryVO.create('STUDENT');
      expect(category.toString()).toBe('STUDENT');
    });
  });

  describe('getLoanPeriodDays', () => {
    it('should return 10 days for STUDENT', () => {
      const category = UserCategoryVO.create('STUDENT');
      expect(category.getLoanPeriodDays()).toBe(10);
    });

    it('should return 30 days for TEACHER', () => {
      const category = UserCategoryVO.create('TEACHER');
      expect(category.getLoanPeriodDays()).toBe(30);
    });

    it('should return 60 days for LIBRARIAN', () => {
      const category = UserCategoryVO.create('LIBRARIAN');
      expect(category.getLoanPeriodDays()).toBe(60);
    });
  });
});
