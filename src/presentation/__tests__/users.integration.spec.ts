import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { AppConfigService } from '../../config/config.service';

describe('Users Integration (e2e)', () => {
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

  describe('POST /api/users', () => {
    it('should create a student user successfully', async () => {
      const createUserDto = {
        name: 'João Silva',
        city: 'São Paulo',
        category: 'STUDENT',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a teacher user successfully', async () => {
      const createUserDto = {
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: 'TEACHER',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a librarian user successfully', async () => {
      const createUserDto = {
        name: 'Pedro Oliveira',
        city: 'Belo Horizonte',
        category: 'LIBRARIAN',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('string');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      // Criar alguns usuários primeiro
      await request(app.getHttpServer()).post('/api/users').send({
        name: 'João Silva',
        city: 'São Paulo',
        category: 'STUDENT',
      });

      await request(app.getHttpServer()).post('/api/users').send({
        name: 'Maria Santos',
        city: 'Rio de Janeiro',
        category: 'TEACHER',
      });

      const response = await request(app.getHttpServer())
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
