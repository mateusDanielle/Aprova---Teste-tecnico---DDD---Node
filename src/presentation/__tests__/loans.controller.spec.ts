import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('LoansController (e2e)', () => {
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

  describe('POST /api/loans', () => {
    let userId: string;
    let bookId: string;

    beforeEach(async () => {
      // Criar usuário e livro para os testes
      const user = await prisma.user.create({
        data: {
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        },
      });
      userId = user.id;

      const book = await prisma.book.create({
        data: {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        },
      });
      bookId = book.id;
    });

    it('should create a loan successfully for a student', async () => {
      const createLoanDto = {
        userId,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');
      expect(response.body.returnDate).toBeDefined();

      // Verificar se o empréstimo foi criado no banco
      const createdLoan = await prisma.loan.findFirst({
        where: {
          userId,
          bookId,
        },
      });

      expect(createdLoan).toBeDefined();
      expect(createdLoan!.userId).toBe(userId);
      expect(createdLoan!.bookId).toBe(bookId);
      expect(createdLoan!.returnDate).toBeDefined();
    });

    it('should create a loan for a teacher with longer period', async () => {
      // Criar um professor
      const teacher = await prisma.user.create({
        data: {
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'TEACHER',
        },
      });

      const createLoanDto = {
        userId: teacher.id,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');
      expect(response.body.returnDate).toBeDefined();

      // Verificar se o empréstimo foi criado no banco
      const createdLoan = await prisma.loan.findFirst({
        where: {
          userId: teacher.id,
          bookId,
        },
      });

      expect(createdLoan).toBeDefined();
      expect(createdLoan!.userId).toBe(teacher.id);
      expect(createdLoan!.bookId).toBe(bookId);
    });

    it('should create a loan for a librarian with longest period', async () => {
      // Criar um bibliotecário
      const librarian = await prisma.user.create({
        data: {
          name: 'Pedro Oliveira',
          city: 'Belo Horizonte',
          category: 'LIBRARIAN',
        },
      });

      const createLoanDto = {
        userId: librarian.id,
        bookId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      expect(response.body).toHaveProperty('returnDate');
      expect(response.body.returnDate).toBeDefined();

      // Verificar se o empréstimo foi criado no banco
      const createdLoan = await prisma.loan.findFirst({
        where: {
          userId: librarian.id,
          bookId,
        },
      });

      expect(createdLoan).toBeDefined();
      expect(createdLoan!.userId).toBe(librarian.id);
      expect(createdLoan!.bookId).toBe(bookId);
    });

    it('should return 400 for non-existent user', async () => {
      const createLoanDto = {
        userId: 'non-existent-user-id',
        bookId,
      };

      await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(400);
    });

    it('should return 400 for non-existent book', async () => {
      const createLoanDto = {
        userId,
        bookId: 'non-existent-book-id',
      };

      await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(400);
    });

    it('should return 400 for already loaned book', async () => {
      // Criar primeiro empréstimo
      const createLoanDto = {
        userId,
        bookId,
      };

      await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(201);

      // Tentar criar segundo empréstimo para o mesmo livro
      const secondUser = await prisma.user.create({
        data: {
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'STUDENT',
        },
      });

      const secondLoanDto = {
        userId: secondUser.id,
        bookId,
      };

      await request(app.getHttpServer())
        .post('/api/loans')
        .send(secondLoanDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const createLoanDto = {
        userId,
        // bookId missing
      };

      await request(app.getHttpServer())
        .post('/api/loans')
        .send(createLoanDto)
        .expect(400);
    });
  });

  describe('GET /api/loans', () => {
    beforeEach(async () => {
      // Criar usuários e livros para teste
      const user1 = await prisma.user.create({
        data: {
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        },
      });

      const user2 = await prisma.user.create({
        data: {
          name: 'Maria Santos',
          city: 'Rio de Janeiro',
          category: 'TEACHER',
        },
      });

      const book1 = await prisma.book.create({
        data: {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        },
      });

      const book2 = await prisma.book.create({
        data: {
          name: 'Harry Potter e a Pedra Filosofal',
          year: 1997,
          publisher: 'Bloomsbury',
        },
      });

      // Criar empréstimos
      await prisma.loan.createMany({
        data: [
          {
            userId: user1.id,
            bookId: book1.id,
            returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dias
          },
          {
            userId: user2.id,
            bookId: book2.id,
            returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          },
        ],
      });
    });

    it('should return all loans', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/loans')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      const loans = response.body;
      expect(loans[0]).toHaveProperty('id');
      expect(loans[0]).toHaveProperty('userId');
      expect(loans[0]).toHaveProperty('bookId');
      expect(loans[0]).toHaveProperty('returnDate');
      expect(loans[0]).toHaveProperty('createdAt');
      expect(loans[0]).toHaveProperty('updatedAt');
    });
  });

  describe('GET /api/loans/:id', () => {
    let loanId: string;

    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          name: 'João Silva',
          city: 'São Paulo',
          category: 'STUDENT',
        },
      });

      const book = await prisma.book.create({
        data: {
          name: 'O Senhor dos Anéis',
          year: 1954,
          publisher: 'Allen & Unwin',
        },
      });

      const loan = await prisma.loan.create({
        data: {
          userId: user.id,
          bookId: book.id,
          returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dias
        },
      });
      loanId = loan.id;
    });

    it('should return loan by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/loans/${loanId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', loanId);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('bookId');
      expect(response.body).toHaveProperty('returnDate');
    });

    it('should return 404 for non-existent loan', async () => {
      const nonExistentId = 'non-existent-id';
      await request(app.getHttpServer())
        .get(`/api/loans/${nonExistentId}`)
        .expect(404);
    });
  });
});
