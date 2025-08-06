import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { UserCategory } from '../../domain';
import { PrismaClient } from '@prisma/client';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await prisma.loan.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterEach(async () => {
    // Limpeza adicional após cada teste
    await prisma.loan.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe('POST /users', () => {
    it('should create a student user', async () => {
      const userData = {
        name: 'João Silva',
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a teacher user', async () => {
      const userData = {
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: UserCategory.TEACHER,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a librarian user', async () => {
      const userData = {
        name: 'Pedro Costa',
        city: 'Belo Horizonte',
        category: UserCategory.LIBRARIAN,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUserData = {
        name: '', // Nome vazio
        city: 'São Paulo',
        category: UserCategory.STUDENT,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserData)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteUserData = {
        name: 'João Silva',
        // city missing
        category: UserCategory.STUDENT,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(incompleteUserData)
        .expect(400);
    });

    it('should return 400 for invalid category', async () => {
      const invalidUserData = {
        name: 'João Silva',
        city: 'São Paulo',
        category: 'INVALID_CATEGORY',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserData)
        .expect(400);
    });
  });
});
