import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateLoanUseCase } from '../create-loan.use-case';
import {
  User,
  Book,
  Loan,
  Name,
  UserCategoryVO,
  BookYear,
} from '../../../domain';
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
      update: jest.fn(),
      delete: jest.fn(),
      searchByName: jest.fn(),
    };

    const mockLoanRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
      findByBookId: jest.fn(),
      findActiveByBookId: jest.fn(),
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
        userId: 'user-id',
        bookId: 'book-id',
      };

      const mockUser = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      const mockBook = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });

      const mockLoan = Loan.create({
        userId: 'user-id',
        bookId: 'book-id',
        userCategory: UserCategoryVO.create('STUDENT'),
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(null);
      mockLoanRepository.create.mockResolvedValue(mockLoan);

      const result = await useCase.execute(createLoanDto);

      expect(result).toEqual({ id: mockLoan.id });
      expect(mockLoanRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-id',
          bookId: 'book-id',
        }),
      );
    });

    it('should create a loan for TEACHER with 30 days return date', async () => {
      const createLoanDto = {
        userId: 'user-id',
        bookId: 'book-id',
      };

      const mockUser = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });

      const mockBook = Book.create({
        name: 'Harry Potter e a Pedra Filosofal',
        year: BookYear.create(1997),
        publisher: 'Bloomsbury',
      });

      const mockLoan = Loan.create({
        userId: 'user-id',
        bookId: 'book-id',
        userCategory: UserCategoryVO.create('TEACHER'),
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(null);
      mockLoanRepository.create.mockResolvedValue(mockLoan);

      const result = await useCase.execute(createLoanDto);

      expect(result).toEqual({ id: mockLoan.id });
      expect(mockLoanRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-id',
          bookId: 'book-id',
        }),
      );
    });

    it('should throw BadRequestException when user not found', async () => {
      const createLoanDto = {
        userId: 'non-existent-user',
        bookId: 'book-id',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Usuário não encontrado'),
      );
    });

    it('should throw BadRequestException when book not found', async () => {
      const createLoanDto = {
        userId: 'user-id',
        bookId: 'non-existent-book',
      };

      const mockUser = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Livro não encontrado'),
      );
    });

    it('should throw BadRequestException when book is already loaned', async () => {
      const createLoanDto = {
        userId: 'user-id',
        bookId: 'book-id',
      };

      const mockUser = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });

      const mockBook = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });

      const existingLoan = Loan.create({
        userId: 'other-user-id',
        bookId: 'book-id',
        userCategory: UserCategoryVO.create('STUDENT'),
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockLoanRepository.findActiveByBookId.mockResolvedValue(existingLoan);

      await expect(useCase.execute(createLoanDto)).rejects.toThrow(
        new BadRequestException('Livro já está emprestado'),
      );
    });
  });
});
