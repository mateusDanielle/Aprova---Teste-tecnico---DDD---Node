import { Name } from '../name.vo';

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a valid name', () => {
      const name = Name.create('João Silva');
      expect(name.getValue()).toBe('João Silva');
    });

    it('should create a name with minimum length', () => {
      const name = Name.create('Jo');
      expect(name.getValue()).toBe('Jo');
    });

    it('should create a name with maximum length', () => {
      const longName = 'A'.repeat(100);
      const name = Name.create(longName);
      expect(name.getValue()).toBe(longName);
    });

    it('should trim whitespace from name', () => {
      const name = Name.create('  João Silva  ');
      expect(name.getValue()).toBe('João Silva');
    });
  });

  describe('validation', () => {
    it('should throw error for name shorter than 2 characters', () => {
      expect(() => Name.create('A')).toThrow(
        'Name must be at least 2 characters',
      );
    });

    it('should throw error for name with only whitespace', () => {
      expect(() => Name.create('   ')).toThrow(
        'Name must be at least 2 characters',
      );
    });

    it('should throw error for name longer than 100 characters', () => {
      const tooLongName = 'A'.repeat(101);
      expect(() => Name.create(tooLongName)).toThrow(
        'Name must be less than 100 characters',
      );
    });

    it('should throw error for name with invalid characters', () => {
      expect(() => Name.create('João123')).toThrow(
        'Name contains invalid characters',
      );
    });
  });

  describe('getValue', () => {
    it('should return the name value', () => {
      const name = Name.create('João Silva');
      expect(name.getValue()).toBe('João Silva');
    });
  });

  describe('getFullName', () => {
    it('should return the full name', () => {
      const name = Name.create('João Silva');
      expect(name.getFullName()).toBe('João Silva');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = Name.create('João Silva');
      const name2 = Name.create('João Silva');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = Name.create('João Silva');
      const name2 = Name.create('Maria Santos');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name value as string', () => {
      const name = Name.create('João Silva');
      expect(name.toString()).toBe('João Silva');
    });
  });
});
