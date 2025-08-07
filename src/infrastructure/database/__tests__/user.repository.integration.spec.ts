import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserRepository } from '../repositories/user.repository';
import { User, Name, UserCategoryVO } from '../../../domain';

describe('UserRepository Integration', () => {
  let userRepository: UserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpar o banco antes de cada teste
    try {
      await prisma.user.deleteMany();
    } catch (error) {
      console.warn('Erro ao limpar usuários após teste:', error.message);
    }
  });

  describe('CRUD Operations', () => {
    it('should create and find a user', async () => {
      const userData = {
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      };

      const user = User.create(userData);
      const createdUser = await userRepository.create(user);

      expect(createdUser.id).toBeDefined();
      expect(createdUser.name.getValue()).toBe('João Silva');
      expect(createdUser.city).toBe('São Paulo');
      expect(createdUser.category.getValue()).toBe('STUDENT');

      const foundUser = await userRepository.findById(createdUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.name.getValue()).toBe('João Silva');
    });

    it('should find all users', async () => {
      const user1 = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });

      const user2 = User.create({
        name: Name.create('Pedro Costa'),
        city: 'Belo Horizonte',
        category: UserCategoryVO.create('LIBRARIAN'),
      });

      await userRepository.create(user1);
      await userRepository.create(user2);

      const allUsers = await userRepository.findAll();

      expect(allUsers).toHaveLength(2);
      expect(allUsers.map((u) => u.name.getValue())).toContain('Maria Santos');
      expect(allUsers.map((u) => u.name.getValue())).toContain('Pedro Costa');
    });

    it('should update a user', async () => {
      const user = User.create({
        name: Name.create('Ana Oliveira'),
        city: 'Salvador',
        category: UserCategoryVO.create('STUDENT'),
      });

      const createdUser = await userRepository.create(user);
      const updatedUser = await userRepository.update(createdUser);

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
        createdUser.updatedAt.getTime(),
      );
    });

    it('should delete a user', async () => {
      const user = User.create({
        name: Name.create('Carlos Lima'),
        city: 'Recife',
        category: UserCategoryVO.create('STUDENT'),
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
        name: Name.create('Student User'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      const teacher = User.create({
        name: Name.create('Teacher User'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });

      const librarian = User.create({
        name: Name.create('Librarian User'),
        city: 'Belo Horizonte',
        category: UserCategoryVO.create('LIBRARIAN'),
      });

      const createdStudent = await userRepository.create(student);
      const createdTeacher = await userRepository.create(teacher);
      const createdLibrarian = await userRepository.create(librarian);

      expect(createdStudent.category.getValue()).toBe('STUDENT');
      expect(createdTeacher.category.getValue()).toBe('TEACHER');
      expect(createdLibrarian.category.getValue()).toBe('LIBRARIAN');
    });
  });
});
