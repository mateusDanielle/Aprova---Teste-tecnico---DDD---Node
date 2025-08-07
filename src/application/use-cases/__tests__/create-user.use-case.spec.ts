/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../create-user.use-case';
import { User, Name, UserCategoryVO, UserCategory } from '../../../domain';
import type { IUserRepository } from '../../../domain';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    mockUserRepository = module.get('IUserRepository');
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      };

      const mockUser = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(Object), // Name Value Object
          city: 'São Paulo',
          category: expect.any(Object), // UserCategoryVO Value Object
        }),
      );
    });

    it('should create a TEACHER user', async () => {
      const createUserDto = {
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      };

      const mockUser = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(Object),
          city: 'Rio de Janeiro',
          category: expect.any(Object),
        }),
      );
    });

    it('should create a LIBRARIAN user', async () => {
      const createUserDto = {
        name: 'Pedro Costa',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      };

      const mockUser = User.create({
        name: Name.create('Pedro Costa'),
        city: 'Belo Horizonte',
        category: UserCategoryVO.create('LIBRARIAN'),
      });

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(Object),
          city: 'Belo Horizonte',
          category: expect.any(Object),
        }),
      );
    });
  });
});
