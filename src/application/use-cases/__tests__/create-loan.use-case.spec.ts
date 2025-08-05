import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateLoanUseCase } from '../create-loan.use-case';
import { User, Book, Loan, UserCategory } from '../../../domain';
import type {
  IUserRepository,
  IBookRepository,
  ILoanRepository,
} from '../../../domain';

describe('CreateLoanUseCase', () => {
  let useCase: CreateLoanUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockBookRepository: jest.Mocked<IBookRepository>;
  let mockLoanRepository: jest.Mocked<ILoanRepository>;

  beforeEach(async () => {
    const mockUserRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockBookRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      searchByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockLoanRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByBookId: jest.fn(),
      findActiveByBookId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLoanUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepo,
        },
        {
          provide: 'IBookRepository',
          useValue: mockBookRepo,
        },
        {
          provide: 'ILoanRepository',
          useValue: mockLoanRepo,
        },
      ],
    }).compile();

    useCase = module.get<CreateLoanUseCase>(CreateLoanUseCase);
    mockUserRepository = module.get('IUserRepository');
    mockBookRepository = module.get('IBookRepository');
    mockLoanRepository = module.get('ILoanRepository');
  });

  describe('execute', () => {
    it('should create a loan successfully for STUDENT', async () => {
      const createLoanDto = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const mockUser = User.create({
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      });

      const mockBook = Book.create({
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Editora Martins Fontes',
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(null);

      const mockLoan = Loan.create(createLoanDto, UserCategory.STUDENT);
      mockLoanRepository.create.mockResolvedValue(mockLoan);

      const result = await useCase.execute(createLoanDto);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        createLoanDto.userId,
      );
      expect(mockBookRepository.findById).toHaveBeenCalledWith(
        createLoanDto.bookId,
      );
      expect(mockLoanRepository.findActiveByBookId).toHaveBeenCalledWith(
        createLoanDto.bookId,
      );
      expect(mockLoanRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ returnDate: mockLoan.returnDate });
    });

    it('should create a loan for TEACHER with 30 days return date', async () => {
      const createLoanDto = {
        userId: 'user-456',
        bookId: 'book-789',
      };

      const mockUser = User.create({
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      });

      const mockBook = Book.create({
        name: 'Dom Casmurro',
        year: 1899,
        publisher: 'Editora Garnier',
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(null);

      const mockLoan = Loan.create(createLoanDto, UserCategory.TEACHER);
      mockLoanRepository.create.mockResolvedValue(mockLoan);

      const result = await useCase.execute(createLoanDto);

      expect(result.returnDate.getDate()).toBe(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getDate(),
      );
    });

    it('should throw BadRequestException when user not found', async () => {
      const createLoanDto = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Usuário não encontrado'),
      );
    });

    it('should throw BadRequestException when book not found', async () => {
      const createLoanDto = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const mockUser = User.create({
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Livro não encontrado'),
      );
    });

    it('should throw BadRequestException when book is already loaned', async () => {
      const createLoanDto = {
        userId: 'user-123',
        bookId: 'book-456',
      };

      const mockUser = User.create({
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      });

      const mockBook = Book.create({
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Editora Martins Fontes',
      });

      const mockActiveLoan = Loan.create(createLoanDto, UserCategory.STUDENT);

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(mockActiveLoan);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Livro já está emprestado'),
      );
    });
  });
});
