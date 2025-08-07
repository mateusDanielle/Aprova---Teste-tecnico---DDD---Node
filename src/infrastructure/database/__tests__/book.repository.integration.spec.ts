import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { BookRepository } from '../repositories/book.repository';
import { Book, BookYear } from '../../../domain';

describe('BookRepository Integration', () => {
  let module: TestingModule;
  let bookRepository: BookRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    bookRepository = module.get<BookRepository>('IBookRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Limpar dados de teste
    const books = await bookRepository.findAll();
    for (const book of books) {
      await bookRepository.delete(book.id);
    }
  });

  describe('CRUD Operations', () => {
    it('should create and find a book', async () => {
      const bookData = {
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      };

      const book = Book.create(bookData);
      const createdBook = await bookRepository.create(book);

      expect(createdBook.id).toBeDefined();
      expect(createdBook.name).toBe('O Senhor dos Anéis');
      expect(createdBook.year.getValue()).toBe(1954);
      expect(createdBook.publisher).toBe('Allen & Unwin');

      const foundBook = await bookRepository.findById(createdBook.id);
      expect(foundBook).toBeDefined();
      expect(foundBook?.name).toBe('O Senhor dos Anéis');
    });

    it('should find all books', async () => {
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

      await bookRepository.create(book1);
      await bookRepository.create(book2);

      const allBooks = await bookRepository.findAll();

      expect(allBooks).toHaveLength(2);
      expect(allBooks.map((b) => b.name)).toContain('O Senhor dos Anéis');
      expect(allBooks.map((b) => b.name)).toContain(
        'Harry Potter e a Pedra Filosofal',
      );
    });

    it('should update a book', async () => {
      const book = Book.create({
        name: 'Livro Original',
        year: BookYear.create(2020),
        publisher: 'Editora Original',
      });

      const createdBook = await bookRepository.create(book);

      // Aguardar um pouco para garantir que o timestamp seja diferente
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatedBook = await bookRepository.update(createdBook);

      expect(updatedBook.updatedAt.getTime()).toBeGreaterThan(
        createdBook.updatedAt.getTime(),
      );
    });

    it('should delete a book', async () => {
      const book = Book.create({
        name: 'Livro para Deletar',
        year: BookYear.create(2021),
        publisher: 'Editora Teste',
      });

      const createdBook = await bookRepository.create(book);
      await bookRepository.delete(createdBook.id);

      const foundBook = await bookRepository.findById(createdBook.id);
      expect(foundBook).toBeNull();
    });

    it('should return null when book not found', async () => {
      const foundBook = await bookRepository.findById('non-existent-id');
      expect(foundBook).toBeNull();
    });
  });

  describe('Search Operations', () => {
    it('should search books by name (case insensitive)', async () => {
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

      await bookRepository.create(book1);
      await bookRepository.create(book2);

      const searchResults = await bookRepository.searchByName('senhor');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toBe('O Senhor dos Anéis');
    });
  });
});
