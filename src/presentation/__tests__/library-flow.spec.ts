import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('Library Flow (e2e)', () => {
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

  describe('Complete Library Flow', () => {
    it('should complete a full library flow: create user, create book, search book, create loan', async () => {
      // 1. Criar um usuário estudante
      const createUserResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        })
        .expect(201);

      const userId = createUserResponse.body.id;
      expect(userId).toBeDefined();

      // 2. Criar um livro
      const createBookResponse = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      const bookId = createBookResponse.body.id;
      expect(bookId).toBeDefined();

      // 3. Buscar o livro criado
      const searchResponse = await request(app.getHttpServer())
        .get('/api/books/search?q=senhor')
        .expect(200);

      expect(searchResponse.body.books).toHaveLength(1);
      expect(searchResponse.body.books[0].name).toBe('O Senhor dos Anéis');
      expect(searchResponse.body.books[0].id).toBe(bookId);

      // 4. Criar um empréstimo
      const createLoanResponse = await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId,
          bookId,
        })
        .expect(201);

      expect(createLoanResponse.body).toHaveProperty('returnDate');
      expect(createLoanResponse.body.returnDate).toBeDefined();

      // 5. Verificar se o empréstimo foi criado no banco
      const createdLoan = await prisma.loan.findFirst({
        where: {
          userId,
          bookId,
        },
      });

      expect(createdLoan).toBeDefined();
      expect(createdLoan!.userId).toBe(userId);
      expect(createdLoan!.bookId).toBe(bookId);

      // 6. Verificar se o livro não pode ser emprestado novamente
      const secondUserResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'STUDENT',
        })
        .expect(201);

      const secondUserId = secondUserResponse.body.id;

      await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: secondUserId,
          bookId,
        })
        .expect(400); // Deve falhar porque o livro já está emprestado
    });

    it('should handle different user categories with different loan periods', async () => {
      // 1. Criar usuários de diferentes categorias
      const studentResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        })
        .expect(201);

      const teacherResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'TEACHER',
        })
        .expect(201);

      const librarianResponse = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'Pedro Oliveira',
          city: 'Belo Horizonte',
          category: 'LIBRARIAN',
        })
        .expect(201);

      // 2. Criar livros diferentes
      const book1Response = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      const book2Response = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'Harry Potter e a Pedra Filosofal',
          year: 1997,
          publisher: 'Bloomsbury',
        })
        .expect(201);

      const book3Response = await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Hobbit',
          year: 1937,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      // 3. Criar empréstimos para cada categoria
      const studentLoanResponse = await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: studentResponse.body.id,
          bookId: book1Response.body.id,
        })
        .expect(201);

      const teacherLoanResponse = await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: teacherResponse.body.id,
          bookId: book2Response.body.id,
        })
        .expect(201);

      const librarianLoanResponse = await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: librarianResponse.body.id,
          bookId: book3Response.body.id,
        })
        .expect(201);

      // 4. Verificar se as datas de retorno são diferentes
      const studentReturnDate = new Date(studentLoanResponse.body.returnDate);
      const teacherReturnDate = new Date(teacherLoanResponse.body.returnDate);
      const librarianReturnDate = new Date(
        librarianLoanResponse.body.returnDate,
      );

      // Verificar se os períodos são diferentes (aproximadamente)
      const now = new Date();
      const studentDays = Math.ceil(
        (studentReturnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const teacherDays = Math.ceil(
        (teacherReturnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const librarianDays = Math.ceil(
        (librarianReturnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Estudante: 10 dias, Professor: 30 dias, Bibliotecário: 60 dias
      expect(studentDays).toBeGreaterThanOrEqual(9);
      expect(studentDays).toBeLessThanOrEqual(11);
      expect(teacherDays).toBeGreaterThanOrEqual(29);
      expect(teacherDays).toBeLessThanOrEqual(31);
      expect(librarianDays).toBeGreaterThanOrEqual(59);
      expect(librarianDays).toBeLessThanOrEqual(61);
    });

    it('should handle validation errors properly', async () => {
      // 1. Tentar criar usuário com nome inválido
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'A', // Muito curto
          city: 'São Paulo',
          category: 'STUDENT',
        })
        .expect(400);

      // 2. Tentar criar usuário com categoria inválida
      await request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'João Silva',
          city: 'São Paulo',
          category: 'INVALID',
        })
        .expect(400);

      // 3. Tentar criar livro com ano inválido
      await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'Livro Antigo',
          year: 999, // Muito antigo
          publisher: 'Editora',
        })
        .expect(400);

      // 4. Tentar criar empréstimo com dados inválidos
      await request(app.getHttpServer())
        .post('/api/loans')
        .send({
          userId: 'invalid-id',
          bookId: 'invalid-id',
        })
        .expect(400);
    });

    it('should handle search functionality properly', async () => {
      // 1. Criar vários livros
      await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'Harry Potter e a Pedra Filosofal',
          year: 1997,
          publisher: 'Bloomsbury',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/books')
        .send({
          name: 'O Hobbit',
          year: 1937,
          publisher: 'Allen & Unwin',
        })
        .expect(201);

      // 2. Buscar por termo específico
      const searchResponse = await request(app.getHttpServer())
        .get('/api/books/search?q=senhor')
        .expect(200);

      expect(searchResponse.body.books).toHaveLength(1);
      expect(searchResponse.body.books[0].name).toBe('O Senhor dos Anéis');

      // 3. Buscar por termo que não existe
      const noMatchResponse = await request(app.getHttpServer())
        .get('/api/books/search?q=nonexistent')
        .expect(200);

      expect(noMatchResponse.body.books).toHaveLength(0);

      // 4. Buscar sem termo (deve retornar todos)
      const allBooksResponse = await request(app.getHttpServer())
        .get('/api/books/search')
        .expect(200);

      expect(allBooksResponse.body.books).toHaveLength(3);
    });
  });
});
