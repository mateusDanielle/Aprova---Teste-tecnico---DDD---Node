import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { LoanRepository } from '../repositories/loan.repository';
import { UserRepository } from '../repositories/user.repository';
import { BookRepository } from '../repositories/book.repository';
import { Loan, LoanStatus, UserCategory } from '../../../domain';
import { User } from '../../../domain/entities/user.entity';
import { Book } from '../../../domain/entities/book.entity';

describe('LoanRepository Integration', () => {
  let module: TestingModule;
  let loanRepository: LoanRepository;
  let userRepository: UserRepository;
  let bookRepository: BookRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    loanRepository = module.get<LoanRepository>('ILoanRepository');
    userRepository = module.get<UserRepository>('IUserRepository');
    bookRepository = module.get<BookRepository>('IBookRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Limpar dados de teste de forma mais robusta
    try {
      const loans = await loanRepository.findAll();
      for (const loan of loans) {
        try {
          await loanRepository.delete(loan.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }

      const users = await userRepository.findAll();
      for (const user of users) {
        try {
          await userRepository.delete(user.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }

      const books = await bookRepository.findAll();
      for (const book of books) {
        try {
          await bookRepository.delete(book.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }
    } catch (error) {
      // Ignorar erros gerais de limpeza
    }
  });

  afterEach(async () => {
    // Limpeza adicional após cada teste
    try {
      const loans = await loanRepository.findAll();
      for (const loan of loans) {
        try {
          await loanRepository.delete(loan.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }

      const users = await userRepository.findAll();
      for (const user of users) {
        try {
          await userRepository.delete(user.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }

      const books = await bookRepository.findAll();
      for (const book of books) {
        try {
          await bookRepository.delete(book.id);
        } catch (error) {
          // Ignorar erros de deleção
        }
      }
    } catch (error) {
      // Ignorar erros gerais de limpeza
    }
  });

  describe('CRUD Operations', () => {
    it('should create and find a loan', async () => {
      // Criar usuário primeiro
      const user = await userRepository.create(
        User.create({
          name: 'João Silva',
          city: 'São Paulo',
          category: UserCategory.STUDENT,
        }),
      );

      // Criar livro primeiro
      const book = await bookRepository.create(
        Book.create({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Editora Martins Fontes',
        }),
      );

      const loanData = {
        userId: user.id,
        bookId: book.id,
      };

      const loan = Loan.create(loanData, UserCategory.STUDENT);
      const createdLoan = await loanRepository.create(loan);

      expect(createdLoan.id).toBeDefined();
      expect(createdLoan.userId).toBe(loanData.userId);
      expect(createdLoan.bookId).toBe(loanData.bookId);
      expect(createdLoan.status).toBe(LoanStatus.ACTIVE);

      const foundLoan = await loanRepository.findById(createdLoan.id);
      expect(foundLoan).toBeDefined();
      expect(foundLoan?.userId).toBe(loanData.userId);
    });

    it('should find loans by user ID', async () => {
      const user = await userRepository.create(
        User.create({
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: UserCategory.TEACHER,
        }),
      );

      const book1 = await bookRepository.create(
        Book.create({
          name: 'Dom Casmurro',
          year: 1899,
          publisher: 'Editora Garnier',
        }),
      );

      const book2 = await bookRepository.create(
        Book.create({
          name: 'Grande Sertão: Veredas',
          year: 1956,
          publisher: 'Editora Nova Fronteira',
        }),
      );

      const loan1 = Loan.create(
        { userId: user.id, bookId: book1.id },
        UserCategory.TEACHER,
      );
      const loan2 = Loan.create(
        { userId: user.id, bookId: book2.id },
        UserCategory.TEACHER,
      );

      await loanRepository.create(loan1);
      await loanRepository.create(loan2);

      const userLoans = await loanRepository.findByUserId(user.id);
      expect(userLoans).toHaveLength(2);
    });

    it('should find loans by book ID', async () => {
      const user1 = await userRepository.create(
        User.create({
          name: 'Pedro Costa',
          city: 'Belo Horizonte',
          category: UserCategory.STUDENT,
        }),
      );

      const user2 = await userRepository.create(
        User.create({
          name: 'Ana Oliveira',
          city: 'Salvador',
          category: UserCategory.LIBRARIAN,
        }),
      );

      const book = await bookRepository.create(
        Book.create({
          name: 'Vidas Secas',
          year: 1938,
          publisher: 'Editora Record',
        }),
      );

      const loan1 = Loan.create(
        { userId: user1.id, bookId: book.id },
        UserCategory.STUDENT,
      );
      const loan2 = Loan.create(
        { userId: user2.id, bookId: book.id },
        UserCategory.LIBRARIAN,
      );

      await loanRepository.create(loan1);
      await loanRepository.create(loan2);

      const bookLoans = await loanRepository.findByBookId(book.id);
      expect(bookLoans).toHaveLength(2);
    });

    it('should find active loan by book ID', async () => {
      const user = await userRepository.create(
        User.create({
          name: 'Carlos Lima',
          city: 'Recife',
          category: UserCategory.STUDENT,
        }),
      );

      const book = await bookRepository.create(
        Book.create({
          name: 'Capitães da Areia',
          year: 1937,
          publisher: 'Editora Record',
        }),
      );

      const loan = Loan.create(
        { userId: user.id, bookId: book.id },
        UserCategory.STUDENT,
      );
      await loanRepository.create(loan);

      const activeLoan = await loanRepository.findActiveByBookId(book.id);
      expect(activeLoan).toBeDefined();
      expect(activeLoan?.status).toBe(LoanStatus.ACTIVE);
    });

    it('should return null when no active loan for book', async () => {
      const book = await bookRepository.create(
        Book.create({
          name: 'Macunaíma',
          year: 1928,
          publisher: 'Editora Record',
        }),
      );

      const activeLoan = await loanRepository.findActiveByBookId(book.id);
      expect(activeLoan).toBeNull();
    });

    it('should update a loan', async () => {
      const user = await userRepository.create(
        User.create({
          name: 'Fernando Silva',
          city: 'Fortaleza',
          category: UserCategory.STUDENT,
        }),
      );

      const book = await bookRepository.create(
        Book.create({
          name: 'Iracema',
          year: 1865,
          publisher: 'Editora Record',
        }),
      );

      const loan = Loan.create(
        { userId: user.id, bookId: book.id },
        UserCategory.STUDENT,
      );
      const createdLoan = await loanRepository.create(loan);

      // Marcar como devolvido
      createdLoan.return();
      const updatedLoan = await loanRepository.update(createdLoan);

      expect(updatedLoan.status).toBe(LoanStatus.RETURNED);
    });

    it('should delete a loan', async () => {
      const user = await userRepository.create(
        User.create({
          name: 'Roberto Santos',
          city: 'Manaus',
          category: UserCategory.TEACHER,
        }),
      );

      const book = await bookRepository.create(
        Book.create({
          name: 'O Guarani',
          year: 1857,
          publisher: 'Editora Record',
        }),
      );

      const loan = Loan.create(
        { userId: user.id, bookId: book.id },
        UserCategory.TEACHER,
      );
      const createdLoan = await loanRepository.create(loan);

      await loanRepository.delete(createdLoan.id);

      const foundLoan = await loanRepository.findById(createdLoan.id);
      expect(foundLoan).toBeNull();
    });
  });

  describe('Loan Status and Business Rules', () => {
    it('should create loans with correct return dates based on user category', async () => {
      const student = await userRepository.create(
        User.create({
          name: 'Student User',
          city: 'São Paulo',
          category: UserCategory.STUDENT,
        }),
      );

      const teacher = await userRepository.create(
        User.create({
          name: 'Teacher User',
          city: 'Rio de Janeiro',
          category: UserCategory.TEACHER,
        }),
      );

      const librarian = await userRepository.create(
        User.create({
          name: 'Librarian User',
          city: 'Belo Horizonte',
          category: UserCategory.LIBRARIAN,
        }),
      );

      const book = await bookRepository.create(
        Book.create({
          name: 'Test Book',
          year: 2020,
          publisher: 'Test Publisher',
        }),
      );

      const studentLoan = Loan.create(
        { userId: student.id, bookId: book.id },
        UserCategory.STUDENT,
      );
      const teacherLoan = Loan.create(
        { userId: teacher.id, bookId: book.id },
        UserCategory.TEACHER,
      );
      const librarianLoan = Loan.create(
        { userId: librarian.id, bookId: book.id },
        UserCategory.LIBRARIAN,
      );

      const createdStudentLoan = await loanRepository.create(studentLoan);
      const createdTeacherLoan = await loanRepository.create(teacherLoan);
      const createdLibrarianLoan = await loanRepository.create(librarianLoan);

      // Verificar datas de devolução
      const studentReturnDate = new Date();
      studentReturnDate.setDate(studentReturnDate.getDate() + 10);

      const teacherReturnDate = new Date();
      teacherReturnDate.setDate(teacherReturnDate.getDate() + 30);

      const librarianReturnDate = new Date();
      librarianReturnDate.setDate(librarianReturnDate.getDate() + 60);

      expect(createdStudentLoan.returnDate.getDate()).toBe(
        studentReturnDate.getDate(),
      );
      expect(createdTeacherLoan.returnDate.getDate()).toBe(
        teacherReturnDate.getDate(),
      );
      expect(createdLibrarianLoan.returnDate.getDate()).toBe(
        librarianReturnDate.getDate(),
      );
    });
  });
});
