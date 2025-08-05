import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('BooksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /books', () => {
    it('should create a book', async () => {
      const bookData = {
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Editora Martins Fontes',
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(bookData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should return 400 for invalid book data', async () => {
      const invalidBookData = {
        name: '', // Nome vazio
        year: 1954,
        publisher: 'Editora Martins Fontes',
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookData)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteBookData = {
        name: 'O Senhor dos Anéis',
        // year missing
        publisher: 'Editora Martins Fontes',
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(incompleteBookData)
        .expect(400);
    });

    it('should return 400 for invalid year', async () => {
      const invalidBookData = {
        name: 'O Senhor dos Anéis',
        year: 'invalid-year', // Ano inválido
        publisher: 'Editora Martins Fontes',
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookData)
        .expect(400);
    });
  });

  describe('GET /books/search', () => {
    beforeEach(async () => {
      // Criar alguns livros para teste
      const books = [
        {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Editora Martins Fontes',
        },
        {
          name: 'O Hobbit',
          year: 1937,
          publisher: 'Editora Martins Fontes',
        },
        {
          name: 'Dom Casmurro',
          year: 1899,
          publisher: 'Editora Garnier',
        },
      ];

      for (const book of books) {
        await request(app.getHttpServer())
          .post('/books')
          .send(book)
          .expect(201);
      }
    });

    it('should search books by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/books/search?q=senhor')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBeGreaterThan(0);
      expect(response.body.books[0]).toHaveProperty('id');
      expect(response.body.books[0]).toHaveProperty('name');
      expect(response.body.books[0]).toHaveProperty('year');
      expect(response.body.books[0]).toHaveProperty('publisher');
    });

    it('should return empty array for non-existent book', async () => {
      const response = await request(app.getHttpServer())
        .get('/books/search?q=non-existent-book')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBe(0);
    });

    it('should search case-insensitive', async () => {
      const response = await request(app.getHttpServer())
        .get('/books/search?q=SENHOR')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBeGreaterThan(0);
    });

    it('should return 400 for missing query parameter', async () => {
      await request(app.getHttpServer()).get('/books/search').expect(400);
    });
  });
});
