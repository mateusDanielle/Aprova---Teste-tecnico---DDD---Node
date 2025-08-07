import { User } from '../user.entity';
import { Name, UserCategoryVO } from '../../value-objects';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with STUDENT category', () => {
      const user = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      expect(user.name.getValue()).toBe('João Silva');
      expect(user.city).toBe('São Paulo');
      expect(user.category.getValue()).toBe('STUDENT');
    });

    it('should create a user with TEACHER category', () => {
      const user = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });

      expect(user.name.getValue()).toBe('Maria Santos');
      expect(user.city).toBe('Rio de Janeiro');
      expect(user.category.getValue()).toBe('TEACHER');
    });

    it('should create a user with LIBRARIAN category', () => {
      const user = User.create({
        name: Name.create('Pedro Costa'),
        city: 'Belo Horizonte',
        category: UserCategoryVO.create('LIBRARIAN'),
      });

      expect(user.name.getValue()).toBe('Pedro Costa');
      expect(user.city).toBe('Belo Horizonte');
      expect(user.category.getValue()).toBe('LIBRARIAN');
    });
  });

  describe('toJSON', () => {
    it('should return user data as JSON', () => {
      const userData = {
        name: Name.create('Ana Oliveira'),
        city: 'Salvador',
        category: UserCategoryVO.create('STUDENT'),
      };

      const user = User.create(userData);
      const json = user.toJSON();

      expect(json).toEqual({
        id: user.id,
        name: 'Ana Oliveira',
        city: 'Salvador',
        category: 'STUDENT',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });
});
