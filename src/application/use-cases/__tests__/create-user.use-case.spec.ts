import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../create-user.use-case';
import { User, UserCategory } from '../../../domain';
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

      const mockUser = User.create(createUserDto);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createUserDto.name,
          city: createUserDto.city,
          category: createUserDto.category,
        }),
      );
      expect(result).toEqual({ id: mockUser.id });
    });

    it('should create a TEACHER user', async () => {
      const createUserDto = {
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      };

      const mockUser = User.create(createUserDto);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          category: UserCategory.TEACHER,
        }),
      );
    });

    it('should create a LIBRARIAN user', async () => {
      const createUserDto = {
        name: 'Pedro Costa',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      };

      const mockUser = User.create(createUserDto);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toEqual({ id: mockUser.id });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          category: UserCategory.LIBRARIAN,
        }),
      );
    });
  });
});
