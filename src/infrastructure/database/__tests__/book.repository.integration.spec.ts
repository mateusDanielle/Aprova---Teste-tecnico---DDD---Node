import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { BookRepository } from '../repositories/book.repository';
import { Book } from '../../../domain';

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
        year: 1954,
        publisher: 'Editora Martins Fontes',
      };

      const book = Book.create(bookData);
      const createdBook = await bookRepository.create(book);

      expect(createdBook.id).toBeDefined();
      expect(createdBook.name).toBe(bookData.name);
      expect(createdBook.year).toBe(bookData.year);
      expect(createdBook.publisher).toBe(bookData.publisher);

      const foundBook = await bookRepository.findById(createdBook.id);
      expect(foundBook).toBeDefined();
      expect(foundBook?.name).toBe(bookData.name);
    });

    it('should find all books', async () => {
      const book1 = Book.create({
        name: 'Dom Casmurro',
        year: 1899,
        publisher: 'Editora Garnier',
      });

      const book2 = Book.create({
        name: 'Grande Sertão: Veredas',
        year: 1956,
        publisher: 'Editora Nova Fronteira',
      });

      await bookRepository.create(book1);
      await bookRepository.create(book2);

      const allBooks = await bookRepository.findAll();

      expect(allBooks).toHaveLength(2);
      expect(allBooks.map((b) => b.name)).toContain('Dom Casmurro');
      expect(allBooks.map((b) => b.name)).toContain('Grande Sertão: Veredas');
    });

    it('should update a book', async () => {
      const book = Book.create({
        name: 'Vidas Secas',
        year: 1938,
        publisher: 'Editora Record',
      });

      const createdBook = await bookRepository.create(book);
      const updatedBook = await bookRepository.update(createdBook);

      expect(updatedBook.updatedAt.getTime()).toBeGreaterThan(
        createdBook.updatedAt.getTime(),
      );
    });

    it('should delete a book', async () => {
      const book = Book.create({
        name: 'Capitães da Areia',
        year: 1937,
        publisher: 'Editora Record',
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
        year: 1954,
        publisher: 'Editora Martins Fontes',
      });

      const book2 = Book.create({
        name: 'O Hobbit',
        year: 1937,
        publisher: 'Editora Martins Fontes',
      });

      const book3 = Book.create({
        name: 'Dom Casmurro',
        year: 1899,
        publisher: 'Editora Garnier',
      });

      await bookRepository.create(book1);
      await bookRepository.create(book2);
      await bookRepository.create(book3);

      // Busca por "senhor"
      const searchResults1 = await bookRepository.searchByName('senhor');
      expect(searchResults1).toHaveLength(1);
      expect(searchResults1[0].name).toBe('O Senhor dos Anéis');

      // Busca por "O" (deve encontrar 3 livros: O Senhor dos Anéis, O Hobbit, Dom Casmurro)
      const searchResults2 = await bookRepository.searchByName('O');
      expect(searchResults2).toHaveLength(3);

      // Busca por "dom" (case insensitive)
      const searchResults3 = await bookRepository.searchByName('DOM');
      expect(searchResults3).toHaveLength(1);
      expect(searchResults3[0].name).toBe('Dom Casmurro');
    });

    it('should return empty array when no books match search', async () => {
      const searchResults =
        await bookRepository.searchByName('non-existent-book');
      expect(searchResults).toHaveLength(0);
    });
  });
});
