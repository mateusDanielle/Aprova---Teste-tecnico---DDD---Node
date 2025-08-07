import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AppConfigService } from '../../config/config.service';

describe('Books Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar prefixo global como no main.ts
    const configService = app.get(AppConfigService);
    app.setGlobalPrefix(configService.apiPrefix);

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
    });
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      // Criar alguns livros primeiro
      await request(app.getHttpServer()).post('/api/books').send({
        name: 'O Senhor dos Anéis',
        year: 1954,
        publisher: 'Allen & Unwin',
      });

      await request(app.getHttpServer()).post('/api/books').send({
        name: 'Harry Potter e a Pedra Filosofal',
        year: 1997,
        publisher: 'Bloomsbury',
      });

      const response = await request(app.getHttpServer())
        .get('/api/books')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/books/search', () => {
    it('should search books by name', async () => {
      // Criar um livro primeiro
      await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      // Aguardar um pouco para garantir que o livro foi criado
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request(app.getHttpServer())
        .get('/api/books/search?q=senhor')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(Array.isArray(response.body.books)).toBe(true);
      expect(response.body.books.length).toBeGreaterThanOrEqual(1);
    });
  });
});
