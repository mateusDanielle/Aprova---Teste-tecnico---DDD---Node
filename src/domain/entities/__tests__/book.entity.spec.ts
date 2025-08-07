import { Book } from '../book.entity';
import { BookYear } from '../../value-objects';

describe('Book Entity', () => {
  describe('create', () => {
    it('should create a book with valid data', () => {
      const bookData = {
        name: 'O Senhor dos Anéis',
        year: BookYear.create(1954),
        publisher: 'Allen & Unwin',
      };

      const book = Book.create(bookData);

      expect(book.name).toBe('O Senhor dos Anéis');
      expect(book.year.getValue()).toBe(1954);
      expect(book.publisher).toBe('Allen & Unwin');
      expect(book.id).toBeDefined();
      expect(book.createdAt).toBeInstanceOf(Date);
      expect(book.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a modern book', () => {
      const bookData = {
        name: 'Harry Potter e a Pedra Filosofal',
        year: BookYear.create(1997),
        publisher: 'Bloomsbury',
      };

      const book = Book.create(bookData);

      expect(book.name).toBe('Harry Potter e a Pedra Filosofal');
      expect(book.year.getValue()).toBe(1997);
      expect(book.publisher).toBe('Bloomsbury');
    });
  });

  describe('toJSON', () => {
    it('should return book data as JSON', () => {
      const bookData = {
        name: 'Dom Casmurro',
        year: BookYear.create(1899),
        publisher: 'Editora Garnier',
      };

      const book = Book.create(bookData);
      const json = book.toJSON();

      expect(json).toEqual({
        id: book.id,
        name: 'Dom Casmurro',
        year: 1899,
        publisher: 'Editora Garnier',
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      });
    });
  });
});
