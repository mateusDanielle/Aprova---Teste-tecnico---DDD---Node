import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { UserRepository } from '../repositories/user.repository';
import { User, UserCategory } from '../../../domain';

describe('UserRepository Integration', () => {
  let module: TestingModule;
  let userRepository: UserRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    userRepository = module.get<UserRepository>('IUserRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Limpar dados de teste de forma mais robusta
    try {
      const users = await userRepository.findAll();
      for (const user of users) {
        await userRepository.delete(user.id);
      }
    } catch (error) {
      console.warn('Erro ao limpar usuários:', error.message);
    }
  });

  afterEach(async () => {
    // Limpeza adicional após cada teste
    try {
      const users = await userRepository.findAll();
      for (const user of users) {
        await userRepository.delete(user.id);
      }
    } catch (error) {
      console.warn('Erro ao limpar usuários após teste:', error.message);
    }
  });

  describe('CRUD Operations', () => {
    it('should create and find a user', async () => {
      const userData = {
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      };

      const user = User.create(userData);
      const createdUser = await userRepository.create(user);

      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser.city).toBe(userData.city);
      expect(createdUser.category).toBe(userData.category);

      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.name).toBe(userData.name);
    });

    it('should find all users', async () => {
      const user1 = User.create({
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      });

      const user2 = User.create({
        name: 'Pedro Costa',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      });

      await userRepository.create(user1);
      await userRepository.create(user2);

      const allUsers = await userRepository.findAll();

      expect(allUsers).toHaveLength(2);
      expect(allUsers.map((u) => u.name)).toContain('Maria Santos');
      expect(allUsers.map((u) => u.name)).toContain('Pedro Costa');
    });

    it('should update a user', async () => {
      const user = User.create({
        name: 'Ana Oliveira',
        city: 'Salvador',
        category: UserCategory.STUDENT,
      });

      const createdUser = await userRepository.create(user);
      const updatedUser = await userRepository.update(createdUser);

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        createdUser.updatedAt.getTime(),
      );
    });

    it('should delete a user', async () => {
      const user = User.create({
        name: 'Carlos Lima',
        city: 'Recife',
        category: UserCategory.STUDENT,
      });

      const createdUser = await userRepository.create(user);
      await userRepository.delete(createdUser.id);

      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toBeNull();
    });

    it('should return null when user not found', async () => {
      const foundUser = await userRepository.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });

  describe('User Categories', () => {
    it('should create users with different categories', async () => {
      const student = User.create({
        name: 'Student User',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      });

      const teacher = User.create({
        name: 'Teacher User',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      });

      const librarian = User.create({
        name: 'Librarian User',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      });

      const createdStudent = await userRepository.create(student);
      const createdTeacher = await userRepository.create(teacher);
      const createdLibrarian = await userRepository.create(librarian);

      expect(createdStudent.category).toBe(UserCategory.STUDENT);
      expect(createdTeacher.category).toBe(UserCategory.TEACHER);
      expect(createdLibrarian.category).toBe(UserCategory.LIBRARIAN);
    });
  });
});
