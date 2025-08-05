import { Book } from '../book.entity';

describe('Book Entity', () => {
  describe('create', () => {
    it('should create a book with valid data', () => {
      const bookData = {
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Editora Martins Fontes',
      };

      const book = Book.create(bookData);

      expect(book.name).toBe(bookData.name);
      expect(book.year).toBe(bookData.year);
      expect(book.publisher).toBe(bookData.publisher);
      expect(book.id).toBeDefined();
      expect(book.createdAt).toBeInstanceOf(Date);
      expect(book.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a book with different data', () => {
      const bookData = {
        name: 'Dom Casmurro',
        year: 1899,
        publisher: 'Editora Garnier',
      };

      const book = Book.create(bookData);

      expect(book.name).toBe(bookData.name);
      expect(book.year).toBe(bookData.year);
      expect(book.publisher).toBe(bookData.publisher);
    });
  });

  describe('toJSON', () => {
    it('should return book data as JSON', () => {
      const bookData = {
        name: 'Grande Sertão: Veredas',
        year: 1956,
        publisher: 'Editora Nova Fronteira',
      };

      const book = Book.create(bookData);
      const json = book.toJSON();

      expect(json).toEqual({
        id: book.id,
        name: bookData.name,
        year: bookData.year,
        publisher: bookData.publisher,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      });
    });
  });
});
