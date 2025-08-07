import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AppConfigService } from '../../config/config.service';

describe('Loans Integration (e2e)', () => {
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
    // Limpar o banco antes de cada teste de forma mais robusta
    try {
      await prisma.loan.deleteMany();
      await prisma.user.deleteMany();
      await prisma.book.deleteMany();
    } catch {
      // Ignorar erros de limpeza
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/loans', () => {
    it('should create a loan successfully for a student', async () => {
      // Criar usuário primeiro
      const userResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        })
        .expect(201);

      // Criar livro primeiro
      const bookResponse = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      const createLoanDto = {
        userId: userResponse.body.id,
        bookId: bookResponse.body.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a loan for a teacher with longer period', async () => {
      // Criar usuário professor primeiro
      const userResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'TEACHER',
        })
        .expect(201);

      // Criar livro primeiro
      const bookResponse = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'Harry Potter e a Pedra Filosofal',
          year: 1997,
          publisher: 'Bloomsbury',
        })
        .expect(201);

      const createLoanDto = {
        userId: userResponse.body.id,
        bookId: bookResponse.body.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });
  });

  describe('GET /api/loans', () => {
    it('should return all loans', async () => {
      // Criar usuário primeiro
      const userResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        })
        .expect(201);

      // Criar livro primeiro
      const bookResponse = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      // Criar empréstimo
      await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: userResponse.body.id,
          bookId: bookResponse.body.id,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/api/loans')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
