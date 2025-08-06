import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Limpar o banco antes de cada teste
    await prisma.loan.deleteMany();
    await prisma.user.deleteMany();
    await prisma.book.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/books', () => {
    it('should create a book successfully', async () => {
      const createBookDto = {
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Allen & Unwin',
      };

      const response = await request(app.getHttpServer())
        .post('/api/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');

      // Verificar se o livro foi criado no banco
      const createdBook = await prisma.book.findUnique({
        where: { id: response.body.id },
      });

      expect(createdBook).toBeDefined();
      expect(createdBook!.name).toBe('O Senhor dos Anéis');
      expect(createdBook!.year).toBe(1954);
      expect(createdBook!.publisher).toBe('Allen & Unwin');
    });

    it('should create a modern book successfully', async () => {
      const createBookDto = {
        name: 'Harry Potter e a Pedra Filosofal',
        year: 1997,
        publisher: 'Bloomsbury',
      };

      const response = await request(app.getHttpServer())
        .post('/api/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');

      // Verificar se o livro foi criado no banco
      const createdBook = await prisma.book.findUnique({
        where: { id: response.body.id },
      });

      expect(createdBook).toBeDefined();
      expect(createdBook!.name).toBe('Harry Potter e a Pedra Filosofal');
      expect(createdBook!.year).toBe(1997);
      expect(createdBook!.publisher).toBe('Bloomsbury');
    });

    it('should return 400 for year before 1000', async () => {
      const createBookDto = {
        name: 'Livro Antigo',
        year: 999,
        publisher: 'Editora Antiga',
      };

      await request(app.getHttpServer())
        .post('/api/books')
        .send(createBookDto)
        .expect(400);
    });

    it('should return 400 for year in the far future', async () => {
      const futureYear = new Date().getFullYear() + 2;
      const createBookDto = {
        name: 'Livro do Futuro',
        year: futureYear,
        publisher: 'Editora Futura',
      };

      await request(app.getHttpServer())
        .post('/api/books')
        .send(createBookDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const createBookDto = {
        name: 'Livro Incompleto',
        // year missing
        publisher: 'Editora',
      };

      await request(app.getHttpServer())
        .post('/api/books')
        .send(createBookDto)
        .expect(400);
    });
  });

  describe('GET /api/books/search', () => {
    beforeEach(async () => {
      // Criar alguns livros para teste
      await prisma.book.createMany({
        data: [
          {
            name: 'O Senhor dos Anéis',
            year: 1954,
            publisher: 'Allen & Unwin',
          },
          {
            name: 'Harry Potter e a Pedra Filosofal',
            year: 1997,
            publisher: 'Bloomsbury',
          },
          {
            name: 'O Hobbit',
            year: 1937,
            publisher: 'Allen & Unwin',
          },
        ],
      });
    });

    it('should search books by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/books/search?q=senhor')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBe(1);
      expect(response.body.books[0].name).toBe('O Senhor dos Anéis');
    });

    it('should search books case insensitive', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/books/search?q=HARRY')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBe(1);
      expect(response.body.books[0].name).toBe(
        'Harry Potter e a Pedra Filosofal',
      );
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/books/search?q=nonexistent')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBe(0);
    });

    it('should return all books when no search term provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/books/search')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBe(3);
    });
  });

  describe('GET /api/books', () => {
    beforeEach(async () => {
      // Criar alguns livros para teste
      await prisma.book.createMany({
        data: [
          {
            name: 'O Senhor dos Anéis',
            year: 1954,
            publisher: 'Allen & Unwin',
          },
          {
            name: 'Harry Potter e a Pedra Filosofal',
            year: 1997,
            publisher: 'Bloomsbury',
          },
          {
            name: 'O Hobbit',
            year: 1937,
            publisher: 'Allen & Unwin',
          },
        ],
      });
    });

    it('should return all books', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/books')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);

      const books = response.body;
      expect(books[0]).toHaveProperty('id');
      expect(books[0]).toHaveProperty('name');
      expect(books[0]).toHaveProperty('year');
      expect(books[0]).toHaveProperty('publisher');
      expect(books[0]).toHaveProperty('createdAt');
      expect(books[0]).toHaveProperty('updatedAt');
    });
  });

  describe('GET /api/books/:id', () => {
    let bookId: string;

    beforeEach(async () => {
      const book = await prisma.book.create({
        data: {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        },
      });
      bookId = book.id;
    });

    it('should return book by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/books/${bookId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', bookId);
      expect(response.body).toHaveProperty('name', 'O Senhor dos Anéis');
      expect(response.body).toHaveProperty('year', 1954);
      expect(response.body).toHaveProperty('publisher', 'Allen & Unwin');
    });

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = 'non-existent-id';
      await request(app.getHttpServer())
        .get(`/api/books/${nonExistentId}`)
        .expect(404);
    });
  });
});
