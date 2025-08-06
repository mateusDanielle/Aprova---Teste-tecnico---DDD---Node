import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('UsersController (e2e)', () => {
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

      // Verificar se o usuário foi criado no banco
      const createdUser = await prisma.user.findUnique({
        where: { id: response.body.id },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser!.name).toBe('João Silva');
      expect(createdUser!.city).toBe('São Paulo');
      expect(createdUser!.category).toBe('STUDENT');
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

      // Verificar se o usuário foi criado no banco
      const createdUser = await prisma.user.findUnique({
        where: { id: response.body.id },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser!.name).toBe('Maria Santos');
      expect(createdUser!.city).toBe('Rio de Janeiro');
      expect(createdUser!.category).toBe('TEACHER');
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

      // Verificar se o usuário foi criado no banco
      const createdUser = await prisma.user.findUnique({
        where: { id: response.body.id },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser!.name).toBe('Pedro Oliveira');
      expect(createdUser!.city).toBe('Belo Horizonte');
      expect(createdUser!.category).toBe('LIBRARIAN');
    });

    it('should return 400 for invalid user category', async () => {
      const createUserDto = {
        name: 'João Silva',
        city: 'São Paulo',
        category: 'INVALID',
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for name shorter than 2 characters', async () => {
      const createUserDto = {
        name: 'A',
        city: 'São Paulo',
        category: 'STUDENT',
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for name with invalid characters', async () => {
      const createUserDto = {
        name: 'João123',
        city: 'São Paulo',
        category: 'STUDENT',
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const createUserDto = {
        name: 'João Silva',
        // city missing
        category: 'STUDENT',
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      // Criar alguns usuários para teste
      await prisma.user.createMany({
        data: [
          {
            name: 'João Silva',
            city: 'São Paulo',
            category: 'STUDENT',
          },
          {
            name: 'Maria Santos',
            city: 'Rio de Janeiro',
            category: 'TEACHER',
          },
          {
            name: 'Pedro Oliveira',
            city: 'Belo Horizonte',
            category: 'LIBRARIAN',
          },
        ],
      });
    });

    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);

      const users = response.body;
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('city');
      expect(users[0]).toHaveProperty('category');
      expect(users[0]).toHaveProperty('createdAt');
      expect(users[0]).toHaveProperty('updatedAt');
    });
  });

  describe('GET /api/users/:id', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        },
      });
      userId = user.id;
    });

    it('should return user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('name', 'João Silva');
      expect(response.body).toHaveProperty('city', 'São Paulo');
      expect(response.body).toHaveProperty('category', 'STUDENT');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = 'non-existent-id';
      await request(app.getHttpServer())
        .get(`/api/users/${nonExistentId}`)
        .expect(404);
    });
  });
});
