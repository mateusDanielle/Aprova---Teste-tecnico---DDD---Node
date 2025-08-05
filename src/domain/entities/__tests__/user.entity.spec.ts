import { User, UserCategory } from '../user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid data', () => {
      const userData = {
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      };

      const user = User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.city).toBe(userData.city);
      expect(user.category).toBe(userData.category);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with TEACHER category', () => {
      const user = User.create({
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      });

      expect(user.category).toBe(UserCategory.TEACHER);
    });

    it('should create a user with LIBRARIAN category', () => {
      const user = User.create({
        name: 'Pedro Costa',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      });

      expect(user.category).toBe(UserCategory.LIBRARIAN);
    });
  });

  describe('toJSON', () => {
    it('should return user data as JSON', () => {
      const userData = {
        name: 'Ana Oliveira',
        city: 'Salvador',
        category: UserCategory.STUDENT,
      };

      const user = User.create(userData);
      const json = user.toJSON();

      expect(json).toEqual({
        id: user.id,
        name: userData.name,
        city: userData.city,
        category: userData.category,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });
});
