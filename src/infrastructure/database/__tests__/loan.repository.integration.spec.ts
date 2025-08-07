import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { LoanRepository } from '../repositories/loan.repository';
import { UserRepository } from '../repositories/user.repository';
import { BookRepository } from '../repositories/book.repository';
import {
  User,
  Book,
  Loan,
  Name,
  UserCategoryVO,
  BookYear,
} from '../../../domain';

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
        } catch (_error) {
          // Ignorar erros de deleção
        }
      }

      const users = await userRepository.findAll();
      for (const user of users) {
        try {
          await userRepository.delete(user.id);
        } catch (_error) {
          // Ignorar erros de deleção
        }
      }

      const books = await bookRepository.findAll();
      for (const book of books) {
        try {
          await bookRepository.delete(book.id);
        } catch (_error) {
          // Ignorar erros de deleção
        }
      }
    } catch (_error) {
      // Ignorar erros gerais de limpeza
    }
  });

  describe('CRUD Operations', () => {
    it('should create and find a loan', async () => {
      // Criar usuário primeiro
      const user = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });
      const createdUser = await userRepository.create(user);

      // Criar livro primeiro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimo
      const loan = Loan.create(
        createdUser.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      const createdLoan = await loanRepository.create(loan);

      expect(createdLoan.id).toBeDefined();
      expect(createdLoan.userId).toBe(createdUser.id);
      expect(createdLoan.bookId).toBe(createdBook.id);
      expect(createdLoan.status).toBe('ACTIVE');

      const foundLoan = await loanRepository.findById(createdLoan.id);
      expect(foundLoan).toBeDefined();
      expect(foundLoan?.userId).toBe(createdUser.id);
    });

    it('should find loans by user ID', async () => {
      // Criar usuário
      const user = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });
      const createdUser = await userRepository.create(user);

      // Criar livros
      const book1 = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const book2 = Book.create({
        name: 'Harry Potter e a Pedra Filosofal',
        year: BookYear.create(1997),
        publisher: 'Bloomsbury',
      });
      const createdBook1 = await bookRepository.create(book1);
      const createdBook2 = await bookRepository.create(book2);

      // Criar empréstimos
      const loan1 = Loan.create(
        createdUser.id,
        createdBook1.id,
        UserCategoryVO.create('TEACHER'),
      );
      const loan2 = Loan.create(
        createdUser.id,
        createdBook2.id,
        UserCategoryVO.create('TEACHER'),
      );
      await loanRepository.create(loan1);
      await loanRepository.create(loan2);

      const userLoans = await loanRepository.findByUserId(createdUser.id);
      expect(userLoans).toHaveLength(2);
    });

    it('should find loans by book ID', async () => {
      // Criar usuários
      const user1 = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });
      const user2 = User.create({
        name: Name.create('Maria Santos'),
        city: 'Rio de Janeiro',
        category: UserCategoryVO.create('TEACHER'),
      });
      const createdUser1 = await userRepository.create(user1);
      const createdUser2 = await userRepository.create(user2);

      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimos
      const loan1 = Loan.create(
        createdUser1.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      const loan2 = Loan.create(
        createdUser2.id,
        createdBook.id,
        UserCategoryVO.create('TEACHER'),
      );
      await loanRepository.create(loan1);
      await loanRepository.create(loan2);

      const bookLoans = await loanRepository.findByBookId(createdBook.id);
      expect(bookLoans).toHaveLength(2);
    });

    it('should find active loan by book ID', async () => {
      // Criar usuário
      const user = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });
      const createdUser = await userRepository.create(user);

      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimo
      const loan = Loan.create(
        createdUser.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      await loanRepository.create(loan);

      const activeLoan = await loanRepository.findActiveByBookId(
        createdBook.id,
      );
      expect(activeLoan).toBeDefined();
      expect(activeLoan?.bookId).toBe(createdBook.id);
    });

    it('should return null when no active loan for book', async () => {
      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      const activeLoan = await loanRepository.findActiveByBookId(
        createdBook.id,
      );
      expect(activeLoan).toBeNull();
    });

    it('should update a loan', async () => {
      // Criar usuário
      const user = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });
      const createdUser = await userRepository.create(user);

      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimo
      const loan = Loan.create(
        createdUser.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      const createdLoan = await loanRepository.create(loan);

      // Marcar como devolvido
      createdLoan.return();
      const updatedLoan = await loanRepository.update(createdLoan);

      expect(updatedLoan.status).toBe('RETURNED');
    });

    it('should delete a loan', async () => {
      // Criar usuário
      const user = User.create({
        name: Name.create('João Silva'),
        city: 'São Paulo',
        category: UserCategoryVO.create('STUDENT'),
      });
      const createdUser = await userRepository.create(user);

      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimo
      const loan = Loan.create(
        createdUser.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      const createdLoan = await loanRepository.create(loan);

      await loanRepository.delete(createdLoan.id);

      const foundLoan = await loanRepository.findById(createdLoan.id);
      expect(foundLoan).toBeNull();
    });
  });

  describe('Loan Status and Business Rules', () => {
    it('should create loans with correct return dates based on user category', async () => {
      // Criar usuários com diferentes categorias
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

      // Criar livro
      const book = Book.create({
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      });
      const createdBook = await bookRepository.create(book);

      // Criar empréstimos
      const studentLoan = Loan.create(
        createdStudent.id,
        createdBook.id,
        UserCategoryVO.create('STUDENT'),
      );
      const teacherLoan = Loan.create(
        createdTeacher.id,
        createdBook.id,
        UserCategoryVO.create('TEACHER'),
      );
      const librarianLoan = Loan.create(
        createdLibrarian.id,
        createdBook.id,
        UserCategoryVO.create('LIBRARIAN'),
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
